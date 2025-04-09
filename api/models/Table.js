const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 2,
        max: 20
    },
    location: {
        type: String,
        required: true,
        enum: ['indoor', 'outdoor', 'private']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    currentReservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        default: null
    }
});

module.exports = mongoose.model('Table', tableSchema); 