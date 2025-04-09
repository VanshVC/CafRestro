const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const moment = require('moment');

// Validation middleware
const validateReservation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required (HH:MM)'),
    body('partySize').isInt({ min: 1, max: 20 }).withMessage('Party size must be between 1 and 20'),
    body('specialRequests').optional().trim(),
    body('location').optional().trim()
];

// Create a new reservation
router.post('/', validateReservation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { date, time, partySize, location } = req.body;
        const reservationDateTime = moment(`${date} ${time}`);

        // Check if the reservation is for a future date/time
        if (reservationDateTime.isBefore(moment())) {
            return res.status(400).json({ message: 'Reservation must be for a future date and time' });
        }

        // Find available table based on party size and location preference
        const tableQuery = {
            capacity: { $gte: partySize },
            isAvailable: true
        };
        
        // Add location filter if specified
        if (location) {
            tableQuery.location = location;
        }

        const availableTable = await Table.findOne(tableQuery);

        if (!availableTable) {
            // If no table available with the preferred location, try without location preference
            if (location) {
                const anyLocationTable = await Table.findOne({
                    capacity: { $gte: partySize },
                    isAvailable: true
                });
                
                if (anyLocationTable) {
                    return res.status(400).json({ 
                        message: `No tables available in the ${location} section. Tables are available in other sections.`,
                        alternativeAvailable: true
                    });
                }
            }
            
            return res.status(400).json({ message: 'No suitable tables available for the requested party size' });
        }

        // Create reservation
        const reservation = new Reservation({
            ...req.body,
            tableNumber: availableTable.tableNumber
        });

        await reservation.save();

        // Update table availability
        availableTable.isAvailable = false;
        availableTable.currentReservation = reservation._id;
        await availableTable.save();

        res.status(201).json(reservation);
    } catch (error) {
        console.error('Reservation creation error:', error);
        res.status(500).json({ message: 'Error creating reservation' });
    }
});

// Get all reservations
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .sort({ date: 1, time: 1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reservations' });
    }
});

// Get reservation by ID
router.get('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reservation' });
    }
});

// Update reservation status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findById(req.params.id);
        
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        reservation.status = status;
        await reservation.save();

        // If reservation is cancelled or completed, free up the table
        if (status === 'cancelled' || status === 'completed') {
            const table = await Table.findOne({ tableNumber: reservation.tableNumber });
            if (table) {
                table.isAvailable = true;
                table.currentReservation = null;
                await table.save();
            }
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating reservation status' });
    }
});

// Delete reservation
router.delete('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Free up the table
        const table = await Table.findOne({ tableNumber: reservation.tableNumber });
        if (table) {
            table.isAvailable = true;
            table.currentReservation = null;
            await table.save();
        }

        await Reservation.deleteOne({ _id: req.params.id });
        res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting reservation' });
    }
});

module.exports = router; 