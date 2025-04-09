// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation to menu items when they come into view
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
});

// Observe hover cards
document.querySelectorAll('.hover-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Add scroll-based header transparency
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.backgroundColor = '#1a1a1a';
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        header.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
    } else {
        // Scrolling up
        header.style.backgroundColor = '#1a1a1a';
    }
    
    lastScroll = currentScroll;
});

// Dish Collage Filtering
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const collageItems = document.querySelectorAll('.collage-item');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    // Add staggered animation to collage items
    collageItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter items with animation
            collageItems.forEach(item => {
                // Reset animation
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow
                item.style.animation = null;
                
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) rotateX(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) rotateX(5deg)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Add hover effect for dish items
    collageItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(0) scale(1.03)';
            this.style.boxShadow = '0 15px 30px rgba(200, 169, 126, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        });
    });
});

// Sliders and interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const sliderTrack = document.querySelector('.slider-track');
    const sliderItems = document.querySelectorAll('.slider-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentIndex = 0;
    const itemWidth = sliderItems[0]?.offsetWidth || 0;
    const itemsToShow = window.innerWidth < 768 ? 1 : 3;
    
    // Create dots
    if (sliderItems.length > 0 && dotsContainer) {
        sliderItems.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Next slide
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < sliderItems.length - itemsToShow) {
                currentIndex++;
                updateSlider();
            } else {
                // Loop back to the beginning
                currentIndex = 0;
                updateSlider();
            }
        });
    }
    
    // Previous slide
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            } else {
                // Loop to the end
                currentIndex = sliderItems.length - itemsToShow;
                currentIndex = Math.max(0, currentIndex);
                updateSlider();
            }
        });
    }
    
    function updateSlider() {
        if (!sliderTrack) return;
        sliderTrack.style.transform = `translateX(-${currentIndex * (itemWidth + 20)}px)`;
        
        // Update dots
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }
    
    // Auto slide functionality
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (currentIndex < sliderItems.length - itemsToShow) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 5000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Start auto slide
    if (sliderItems.length > 0) {
        startAutoSlide();
        
        // Reset auto slide on user interaction
        if (prevBtn) prevBtn.addEventListener('click', resetAutoSlide);
        if (nextBtn) nextBtn.addEventListener('click', resetAutoSlide);
        dotsContainer?.addEventListener('click', resetAutoSlide);
    }
});

// Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const dineInModal = document.getElementById('dine-in-modal');
    const deliveryModal = document.getElementById('delivery-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const dineInBtn = document.querySelector('a[href="#dine-in"]');
    const deliveryBtn = document.querySelector('a[href="#delivery"]');
    const deliveryForm = document.getElementById('delivery-form');

    // Phone number validation - apply to all phone inputs
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove any non-numeric characters
            this.value = this.value.replace(/\D/g, '');
        });
        
        input.addEventListener('keypress', function(e) {
            // Only allow numeric key presses
            if (!/^\d*$/.test(e.key)) {
                e.preventDefault();
            }
        });
    });

    // Open Dine In modal
    if (dineInBtn && dineInModal) {
        dineInBtn.addEventListener('click', function(e) {
            e.preventDefault();
            dineInModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Open Delivery modal
    if (deliveryBtn && deliveryModal) {
        deliveryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            deliveryModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (dineInModal) dineInModal.style.display = 'none';
            if (deliveryModal) deliveryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === dineInModal) {
            dineInModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === deliveryModal) {
            deliveryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Reservation Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservationForm');
    const reservationStatus = document.getElementById('reservationStatus');
    const availabilityDateInput = document.getElementById('availability-date');
    const checkAvailabilityBtn = document.getElementById('check-availability-btn');
    const timeSlots = document.querySelectorAll('.time-slot');

    // Initialize availability date to today
    if (availabilityDateInput) {
        const today = new Date().toISOString().split('T')[0];
        availabilityDateInput.value = today;
        availabilityDateInput.min = today;
        
        // Trigger availability check on load to show initial available slots
        setTimeout(() => {
            if (checkAvailabilityBtn) {
                checkAvailabilityBtn.click();
            }
        }, 500);
    }

    // Set minimum date to today for reservation form
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today; // Set default date to today
        dateInput.min = today;

        // Set time input constraints
        const timeInput = document.getElementById('time');
        if (timeInput) {
            timeInput.min = '11:00';
            timeInput.max = '22:00';
            timeInput.value = '19:00'; // Set default time to 7:00 PM
        }
    }

    // Add hover effects and animations to time slots
    timeSlots.forEach((slot, index) => {
        // Add staggered animation on initial load
        slot.style.opacity = '0';
        slot.style.transform = 'translateY(20px)';
        slot.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        setTimeout(() => {
            slot.style.opacity = '1';
            slot.style.transform = 'translateY(0)';
        }, 100 + index * 50);
        
        // Add hover sound effect
        slot.addEventListener('mouseenter', function() {
            if (!this.classList.contains('unavailable')) {
                this.style.transform = 'translateY(-5px) scale(1.05)';
                this.style.boxShadow = '0 10px 20px rgba(200, 169, 126, 0.3)';
                
                // Play subtle hover sound if user has interacted with the page
                if (window.hasInteracted) {
                    const hoverSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAQIAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/jWMQACJEjgRKIEVCJGQiRYAjFgCMSAIxMAjGgB/AD/wB+A9jjdmSbm4m9vR2Yp1DOpl7vQzrN97uVZ8dTGk0HPj7GPrb///8vjU6xc5jh1mHcrxmNJqbjVI//8fP////xVCUQACJEjABGIgRWIkYgJFQCMXAIxoAjFgCMZAH8AP/AH4D2UAAUASiQBHEe//8bQdWLuxeZtLu5OalHbisR4LTd6Oe93o6XLjx9zP/+L4+9Sz//F0MVYcctDOX//////yfqUQACJEkABGICRSIkWAJFQCMVAIyAAjGQCMaAH8AP/AH4D2g');
                    hoverSound.volume = 0.1;
                    hoverSound.play().catch(e => {});
                }
            }
        });
        
        slot.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Set flag for user interaction to enable sound effects
    window.addEventListener('click', function() {
        window.hasInteracted = true;
    }, { once: true });

    // Handle time slot selection with enhanced feedback
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            const statusIndicator = this.querySelector('.status-indicator');
            
            // Don't allow selecting unavailable slots
            if (statusIndicator.classList.contains('unavailable')) {
                showNotification('This time slot is not available', 'error');
                this.classList.add('shake');
                setTimeout(() => {
                    this.classList.remove('shake');
                }, 500);
                return;
            }
            
            // Visual feedback animation
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Play selection sound if user has interacted
            if (window.hasInteracted) {
                const selectSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAgAAAQIAJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQk//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAX//////////////////////////////////+NY5AAKZIUAPIO0FyDtBgAAIQbgAACG4IAAijsIrgqEIrgvBAAHwfB8HwfCIIgiCIJgiCYJgqCoKgqCoKguC4LguC4LguDIPgyD4Mg+Ei+QABAEAwSBAIBgMBgMBgQBAAEAgCAQCAQCAQCAQCAQCAQCAQE//jOMQABkSMA9CJA/ACIChiAQmB0AwcAQBB0NAMGwEAQcAwBBgAAQeQGIhZm7AxAS32Nj03JDk0YXQdPVF9VMW2tLPdV7CvXJVLM//xdHlYrYTHGxW2mqP///yYqNgABkSMAdCA4B0AIBCJgkCAIgdAIHA0AwbAQBB0BAMGwEAQcAwBBgAAQeQAAiZ//+N4QAQWnqtmZjHazH7Laz9yTWJZYbP8yz0nmpN+d6oqlz///+cSzlYaKVNEL//////8zDYAAZEjAHQgSAcBYCg1AwKBAHQCBwOAIGwEAQeAIBg4AgCDoBAMGgABB9ByFz//77WJVU19zv6V9mZmNYnbvWJZS32Ocua+d3Qz1TVH//////lbDZCoVsoNB///////85AAAGRIuBUIFQHQWAoOgMCgQBYBgcDwCBwBAMHAEAQdAIBg2AgCDoBgq3//9TYt2tJ9iUhKdmO4nq6Te3eN6Sd0c1JJN6T7uc9//9//+qtlhoUskRsJD///////mmAAGRI0B0IDgHgWAoOAICAOgIDgcAQOAIAg8AQDBwBAEHQCAYNgICDyDkXOy//+9JvWJdJJ6tu86Sd2OvSGzUmWJLSSTe7oZG/rd1f///+VsNkK5UNBw///////ytAABkSOAkCBQBAEQQBEDAQEAdAIHA4AgbAQBB0AgGDYCAIOgEAwZAAEH0HI3Pf//vcz1JJJltqSSd2LJPbvO8akyzGzJ7O5J7vPWb/////MpYaFTJEbCY////////LQAAZEjoJQgVAkA4Cg3AwKA8FgGBwOAIGwEAQeAIBg4AgCDoBAMGQEAg8g7F///vO9SSbO5JJPWSSS77xvSScxJJO63JVN9JJr////5Ww2QrFQ0KD///////+vAAGRIyBEIEgGgWAoOAMCAOgEDgcAQNgIAg6AQDBsBAEHQCAYMgICDyDuf//7zrUkknckm7pFknd5nGcWSexJJO6kl3OtSb////+VsNkKmUI2Ew////////rmAAGRIsBEIEQHAWAoOAMCAPBYBgcDgCBsBAEHQCAYNgIAg6AQDBoAAQeQezf//3M9SSbO5JJN9JJJd5nGpJOYkkn0kkmcakm/////MpYaFTJEbCY///////9dAABkSJgpCAoB0CAIgaCAHAgCIHQCBwPAIGwEAQdAIBg2AgCDoBAMGQABB5B7n///eZ6kkmnmSTepZJJ3WZm9JJnEkl3JJJ3Gtp/////MpYaFLJEbCY///////9dAABkSIgpCA0B0CAIgiCAHAgCIHA8AgcAQBB4AgGDgCAIOgEAwZAAEHkHs///9ZnqSTT2JJN9JJJO5nMakk5iSSfSSS7xqbP////zKWGxUyRGwmP///////UwAA=');
                selectSound.volume = 0.2;
                selectSound.play().catch(e => {});
            }
            
            // Toggle selection
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            
            // Pulse animation for the selected slot
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 1000);
            
            // Update reservation form with selected date and time
            if (dateInput && availabilityDateInput.value) {
                dateInput.value = availabilityDateInput.value;
            }
            
            const selectedTime = this.querySelector('.time').textContent;
            const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
            
            if (timeInput && timeMatch) {
                let hours = parseInt(timeMatch[1]);
                const minutes = timeMatch[2];
                const period = timeMatch[3].toUpperCase();
                
                // Convert to 24-hour format
                if (period === 'PM' && hours < 12) {
                    hours += 12;
                } else if (period === 'AM' && hours === 12) {
                    hours = 0;
                }
                
                // Format as HH:MM
                const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
                timeInput.value = formattedTime;
            }
            
            showNotification('Time slot selected', 'info');
        });
    });

    // Check availability functionality with enhanced animation
    if (checkAvailabilityBtn) {
        checkAvailabilityBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!availabilityDateInput.value) {
                showNotification('Please select a date', 'error');
                return;
            }
            
            // Add loading animation
            const timeSlotsContainer = document.querySelector('.time-slots');
            if (timeSlotsContainer) {
                timeSlotsContainer.classList.add('loading');
                
                // Reset all time slots to available but hide them during "loading"
                timeSlots.forEach(slot => {
                    slot.style.opacity = '0';
                    slot.style.transform = 'translateY(20px)';
                });
            }
            
            // Simulate server check delay
            setTimeout(() => {
                // Reset all time slots to available
                timeSlots.forEach(slot => {
                    const statusIndicator = slot.querySelector('.status-indicator');
                    statusIndicator.className = 'status-indicator available';
                });
                
                // Simulate random availability based on date
                const selectedDate = new Date(availabilityDateInput.value);
                const day = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
                const isWeekend = day === 0 || day === 6;
                
                // Weekend logic - busier
                if (isWeekend) {
                    // Make popular dinner times more limited or unavailable
                    timeSlots.forEach(slot => {
                        const statusIndicator = slot.querySelector('.status-indicator');
                        const time = statusIndicator.getAttribute('data-time');
                        
                        // Prime dinner hours are busy on weekends
                        if (time === '18:00' || time === '19:00') {
                            statusIndicator.className = 'status-indicator limited';
                        }
                        
                        // 8PM is typically booked solid on weekends
                        if (time === '20:00') {
                            statusIndicator.className = 'status-indicator unavailable';
                        }
                    });
                } else {
                    // Weekday logic - usually more available
                    // Only 7-8PM might be limited
                    timeSlots.forEach(slot => {
                        const statusIndicator = slot.querySelector('.status-indicator');
                        const time = statusIndicator.getAttribute('data-time');
                        
                        if (time === '19:00') {
                            statusIndicator.className = 'status-indicator limited';
                        }
                    });
                }
                
                // Additional random availability
                timeSlots.forEach(slot => {
                    const statusIndicator = slot.querySelector('.status-indicator');
                    const randomValue = Math.random();
                    
                    // If already unavailable, leave it that way
                    if (statusIndicator.classList.contains('unavailable')) {
                        return;
                    }
                    
                    // 10% chance to make any slot unavailable
                    if (randomValue < 0.1) {
                        statusIndicator.className = 'status-indicator unavailable';
                    }
                    // 20% chance to make any slot limited
                    else if (randomValue < 0.3 && !statusIndicator.classList.contains('limited')) {
                        statusIndicator.className = 'status-indicator limited';
                    }
                });
                
                // Remove loading animation and animate slots back in
                if (timeSlotsContainer) {
                    timeSlotsContainer.classList.remove('loading');
                    
                    // Show slots with staggered animation
                    timeSlots.forEach((slot, index) => {
                        setTimeout(() => {
                            slot.style.opacity = '1';
                            slot.style.transform = 'translateY(0)';
                        }, 50 * index);
                    });
                }
                
                showNotification('Availability updated', 'success');
            }, 800); // Simulate server delay
        });
    }

    // Handle reservation form submission
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Clear previous status
            reservationStatus.className = 'reservation-status';
            reservationStatus.textContent = '';
            
            // Get form data
            const formData = new FormData(reservationForm);
            const reservationData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                date: formData.get('date'),
                time: formData.get('time'),
                partySize: parseInt(formData.get('partySize')),
                location: formData.get('location') || 'No Preference',
                specialRequests: formData.get('specialRequests') || 'None'
            };

            // Validate party size (should be 1-10)
            if (isNaN(reservationData.partySize) || reservationData.partySize < 1 || reservationData.partySize > 10) {
                reservationStatus.className = 'reservation-status error';
                reservationStatus.textContent = 'Please enter a valid party size between 1 and 10.';
                return;
            }

            // Show loading state
            reservationStatus.className = 'reservation-status info';
            reservationStatus.textContent = 'Processing your reservation...';
            
            // Simulate server processing
            setTimeout(() => {
                // Format date nicely
                const reserveDate = new Date(reservationData.date);
                const formattedDate = reserveDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                // Show success message with details
                reservationStatus.className = 'reservation-status success';
                reservationStatus.innerHTML = `
                    <h3>Reservation Confirmed!</h3>
                    <p>Thank you, ${reservationData.name}. Your table has been reserved.</p>
                    <div class="reservation-details">
                        <p><strong>Date:</strong> ${formattedDate}</p>
                        <p><strong>Time:</strong> ${reservationData.time}</p>
                        <p><strong>Party Size:</strong> ${reservationData.partySize} ${reservationData.partySize > 1 ? 'people' : 'person'}</p>
                        <p><strong>Location:</strong> ${reservationData.location}</p>
                        ${reservationData.specialRequests ? `<p><strong>Special Requests:</strong> ${reservationData.specialRequests}</p>` : ''}
                    </div>
                    <p>A confirmation has been sent to ${reservationData.email}.</p>
                `;
                reservationForm.reset();
            }, 1500);
        });
    }
});

// Handle dine-in form
document.addEventListener('DOMContentLoaded', function() {
    const dineInForm = document.getElementById('dine-in-form');
    const guestCountInput = document.getElementById('guest-count');
    
    if (dineInForm) {
        dineInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate guest count
            const guestCount = parseInt(guestCountInput.value);
            if (isNaN(guestCount) || guestCount < 1 || guestCount > 10) {
                showNotification('Please enter a valid number of guests between 1 and 10', 'error');
                return;
            }
            
            // Simulate checking availability
            showNotification('Checking availability for ' + guestCount + ' guests...', 'info');
            
            setTimeout(() => {
                // Close the modal
                const dineInModal = document.getElementById('dine-in-modal');
                if (dineInModal) {
                    dineInModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
                
                // Scroll to reservation section
                const reservationSection = document.getElementById('reservation');
                if (reservationSection) {
                    reservationSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update party size in reservation form
                    const partySizeInput = document.getElementById('partySize');
                    if (partySizeInput) {
                        partySizeInput.value = guestCount;
                    }
                    
                    showNotification('Please complete your reservation details', 'success');
                }
            }, 1500);
        });
    }
});

// Enhanced delivery form
document.addEventListener('DOMContentLoaded', function() {
    const deliveryForm = document.getElementById('delivery-form');
    
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (cart.items.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            // Get form data - now with detailed address
            const formData = new FormData(deliveryForm);
            const orderData = {
                customer: {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    address: {
                        street: formData.get('street'),
                        apartment: formData.get('apartment'),
                        city: formData.get('city'),
                        state: formData.get('state'),
                        zipcode: formData.get('zipcode'),
                        landmark: formData.get('landmark'),
                        instructions: formData.get('deliveryInstructions')
                    }
                },
                items: cart.items,
                total: cart.total
            };
            
            // Validate zipcode format
            const zipcode = formData.get('zipcode');
            if (!/^\d{5}(-\d{4})?$/.test(zipcode)) {
                showNotification('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)', 'error');
                return;
            }
            
            // Validate all required fields are filled
            if (!formData.get('street') || !formData.get('city') || !formData.get('state')) {
                showNotification('Please fill in all required address fields', 'error');
                return;
            }
            
            // Show success message
            showNotification('Your order has been placed successfully!', 'success');
            
            // Close modal and reset
            document.getElementById('delivery-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
            deliveryForm.reset();
            
            // Clear cart
            cart.items = [];
            updateCart();
            
            console.log('Order placed:', orderData);
        });
    }
});

// Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cart state
    const cart = {
        items: [],
        total: 0
    };

    const cartModal = document.getElementById('cart-modal');
    const cartToggle = document.getElementById('cart-toggle');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const subtotalAmount = document.querySelector('.subtotal-amount');
    const taxAmount = document.querySelector('.tax-amount');
    const totalAmount = document.querySelector('.total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const deliveryForm = document.getElementById('delivery-form');

    // Open cart modal
    if (cartToggle) {
        cartToggle.addEventListener('click', function(e) {
            e.preventDefault();
            cartModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close cart modal
    if (cartModal) {
        cartModal.querySelector('.close-modal').addEventListener('click', function() {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Close cart when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Add to cart functionality
    document.querySelectorAll('.order-btn, .menu-item-action').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Find the closest dish container
            const dishItem = this.closest('.dish-description, .menu-item-content, .slider-content');
            
            if (!dishItem) return;
            
            // Get dish details
            const dishName = dishItem.querySelector('h3, h4, .menu-item-title').textContent;
            const priceText = dishItem.querySelector('.price, .menu-item-price').textContent;
            const dishPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
            
            // Add to cart
            addToCart(dishName, dishPrice);
            
            // Show notification
            showNotification(`Added ${dishName} to your cart!`);
        });
    });

    function addToCart(name, price) {
        const existingItem = cart.items.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.items.push({
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        updateCart();
    }

    function removeFromCart(index) {
        cart.items.splice(index, 1);
        updateCart();
    }

    function updateQuantity(index, change) {
        const item = cart.items[index];
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(index);
        } else {
            updateCart();
        }
    }

    function updateCart() {
        // Update cart count
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items display
        if (cart.items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <p>Add some delicious items to your order!</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = '';
            
            // Create cart item elements
            cart.items.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                    </div>
                    <button class="remove-item">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                
                // Add event listeners
                cartItem.querySelector('.decrease').addEventListener('click', () => updateQuantity(index, -1));
                cartItem.querySelector('.increase').addEventListener('click', () => updateQuantity(index, 1));
                cartItem.querySelector('.remove-item').addEventListener('click', () => removeFromCart(index));
                
                cartItems.appendChild(cartItem);
            });
        }

        // Update totals
        const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        subtotalAmount.textContent = `₹${subtotal.toFixed(2)}`;
        taxAmount.textContent = `₹${tax.toFixed(2)}`;
        totalAmount.textContent = `₹${total.toFixed(2)}`;

        cart.total = total;
    }

    // Checkout functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.items.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            // Open delivery modal
            const deliveryModal = document.getElementById('delivery-modal');
            cartModal.style.display = 'none';
            deliveryModal.style.display = 'block';
        });
    }

    // Delivery form submission
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (cart.items.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            // Get form data
            const formData = new FormData(deliveryForm);
            const orderData = {
                customer: {
                    name: formData.get('name'),
                    address: formData.get('address'),
                    phone: formData.get('phone'),
                    email: formData.get('email')
                },
                items: cart.items,
                total: cart.total
            };
            
            // Show success message
            showNotification('Your order has been placed successfully!', 'success');
            
            // Close modal and reset
            document.getElementById('delivery-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
            deliveryForm.reset();
            
            // Clear cart
            cart.items = [];
            updateCart();
            
            console.log('Order placed:', orderData);
        });
    }

    // Show notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `order-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Make functions globally available for menu item actions
    window.addToCart = addToCart;
    window.showNotification = showNotification;

    // Initialize cart
    if (cartCount) {
        updateCart();
    }
});

// Table selection functionality with visual feedback
document.addEventListener('DOMContentLoaded', function() {
    const tableItems = document.querySelectorAll('.table-item');
    const selectedTableInput = document.getElementById('selectedTable');
    const partySizeInput = document.getElementById('partySize');
    const statusElement = document.getElementById('table-selection-status');
    
    // Track selected area for filtering
    let selectedArea = 'all';
    
    // Initialize the floor plan first
    initFloorPlan();
    
    if (tableItems.length > 0) {
        // Initialize seat availability based on party size
        updateTableAvailability();
        
        // Setup enhanced interactive elements
        setupInteractiveAreas();
        
        // Update table availability when party size changes
        if (partySizeInput) {
            partySizeInput.addEventListener('change', function() {
                updateTableAvailability();
                
                // Add animation to the status element
                if (statusElement) {
                    statusElement.classList.add('pulse');
                    setTimeout(() => {
                        statusElement.classList.remove('pulse');
                    }, 1000);
                }
                
                // Deselect any selected table after party size change
                const selectedTable = document.querySelector('.table-item.selected');
                if (selectedTable) {
                    selectedTable.classList.remove('selected');
                    if (selectedTableInput) {
                        selectedTableInput.value = '';
                    }
                    
                    // Reset selection feedback
                    const selectionFeedback = document.getElementById('selection-feedback');
                    if (selectionFeedback) {
                        selectionFeedback.classList.add('hidden');
                        selectionFeedback.classList.remove('visible');
                    }
                }
            });
        }
        
        // Setup area filters from the existing HTML buttons
        setupAreaFilters();
        
        // Handle table selection
        tableItems.forEach(table => {
            table.addEventListener('click', function() {
                // Don't allow selecting tables that don't have enough seats
                if (this.classList.contains('unavailable')) {
                    showNotification('This table doesn\'t have enough seats for your party size', 'error');
                    
                    // Add shake animation
                    this.classList.add('shake');
                    setTimeout(() => {
                        this.classList.remove('shake');
                    }, 500);
                    return;
                }
                
                // Don't allow selecting filtered-out tables
                if (this.classList.contains('filtered-out')) {
                    showNotification('Please select an area filter that includes this table', 'error');
                    return;
                }
                
                // Visual selection
                tableItems.forEach(t => t.classList.remove('selected'));
                this.classList.add('selected');
                
                // Add selection animation
                this.classList.add('pulse');
                setTimeout(() => {
                    this.classList.remove('pulse');
                }, 1000);
                
                // Update hidden input value and show visual confirmation
                const tableNumber = this.querySelector('.table-number').textContent;
                const tableSeats = this.querySelector('.table-shape').getAttribute('data-seats');
                const tableArea = this.closest('.table-group').querySelector('.area-label').textContent;
                
                selectedTableInput.value = `Table ${tableNumber} (${tableArea}, ${tableSeats} seats)`;
                
                // Update visual confirmation
                const selectionFeedback = document.getElementById('selection-feedback');
                const selectionText = document.getElementById('selection-text');
                if (selectionFeedback && selectionText) {
                    selectionText.textContent = `Table ${tableNumber} in ${tableArea} with ${tableSeats} seats selected`;
                    selectionFeedback.classList.remove('hidden');
                    selectionFeedback.classList.add('visible');
                    
                    // Animate the confirmation
                    selectionFeedback.style.animation = 'none';
                    // Trigger reflow
                    void selectionFeedback.offsetWidth;
                    selectionFeedback.style.animation = 'pulse 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                }
                
                // Show success notification
                showNotification(`Table ${tableNumber} selected`, 'success');
                
                // Highlight the selected table area
                highlightTableArea(this);
            });
            
            // Add hover sound effect if supported
            if (window.hasInteracted) {
                table.addEventListener('mouseenter', function() {
                    if (!this.classList.contains('unavailable') && !this.classList.contains('filtered-out')) {
                        const hoverSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAQIAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/jWMQACJEjgRKIEVCJGQiRYAjFgCMSAIxMAjGgB/AD/wB+A9jjdmSbm4m9vR2Yp1DOpl7vQzrN97uVZ8dTGk0HPj7GPrb///8vjU6xc5jh1mHcrxmNJqbjVI//8fP////xVCUQACJEjABGIgRWIkYgJFQCMXAIxoAjFgCMZAH8AP/AH4D2UAAUASiQBHEe//8bQdWLuxeZtLu5OalHbisR4LTd6Oe93o6XLjx9zP/+L4+9Sz//F0MVYcctDOX//////yfqUQACJEkABGICRSIkWAJFQCMVAIyAAjGQCMaAH8AP/AH4D2g');
                        hoverSound.volume = 0.1;
                        hoverSound.play().catch(e => {});
                    }
                });
                
                // Add tooltip animation
                table.addEventListener('mouseenter', function() {
                    const tooltip = this.querySelector('.table-tooltip');
                    if (tooltip && !this.classList.contains('unavailable') && !this.classList.contains('filtered-out')) {
                        tooltip.style.transform = 'translateY(-50%) scale(1.05)';
                        tooltip.style.opacity = '1';
                    }
                });
                
                table.addEventListener('mouseleave', function() {
                    const tooltip = this.querySelector('.table-tooltip');
                    if (tooltip) {
                        tooltip.style.transform = 'translateY(-50%)';
                        tooltip.style.opacity = '';
                    }
                });
            }
        });
    }
    
    // Setup area filter buttons from the HTML
    function setupAreaFilters() {
        // Find the area filter buttons that were added to the HTML
        const filterButtons = document.querySelectorAll('.area-filter-btn');
        console.log('Setting up area filters with', filterButtons.length, 'buttons found');
        
        if (filterButtons.length > 0) {
            // Add event listeners to the filter buttons
            filterButtons.forEach(button => {
                // Add both click and touch events for better mobile support
                ['click', 'touchend'].forEach(eventType => {
                    button.addEventListener(eventType, function(e) {
                        // Prevent double firing on mobile devices
                        if (eventType === 'touchend') {
                            e.preventDefault();
                        }
                        
                        // Update active button styling
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Get area to filter
                        selectedArea = this.getAttribute('data-area');
                        console.log(`Area filter changed to: ${selectedArea}`);
                        
                        // Filter tables
                        filterTablesByArea(selectedArea);
                        
                        // Animate floor plan
                        animateFloorPlanForArea(selectedArea);
                        
                        // Show notification
                        if (selectedArea === 'all') {
                            showNotification('Showing all tables', 'info');
                        } else {
                            showNotification(`Showing tables in ${selectedArea} area`, 'info');
                        }
                        
                        // Add visual feedback to the button
                        this.classList.add('pulse-once');
                        setTimeout(() => {
                            this.classList.remove('pulse-once');
                        }, 500);
                        
                        // Update party size and availability after area change
                        if (partySizeInput) {
                            updateTableAvailability();
                        }
                        
                        // Reset any tooltips that might be visible
                        const tooltips = document.querySelectorAll('.table-tooltip');
                        tooltips.forEach(tooltip => {
                            tooltip.style.opacity = '0';
                            tooltip.style.transform = 'translateY(-50%)';
                        });
                        
                        // Reset table selection if current selection is filtered out
                        const selectedTable = document.querySelector('.table.selected');
                        if (selectedTable && selectedTable.classList.contains('filtered-out')) {
                            selectedTable.classList.remove('selected');
                            if (selectedTableInput) {
                                selectedTableInput.value = '';
                            }
                            
                            // Reset selection feedback
                            const selectionFeedback = document.getElementById('selection-feedback');
                            if (selectionFeedback) {
                                selectionFeedback.classList.add('hidden');
                                selectionFeedback.classList.remove('visible');
                            }
                        }
                    });
                });
            });
            
            // Set the "All Areas" button as active by default
            const allAreasBtn = document.querySelector('.area-filter-btn[data-area="all"]');
            if (allAreasBtn) {
                allAreasBtn.classList.add('active');
            }
            
            // Add hover effects for better UX
            filterButtons.forEach(button => {
                button.addEventListener('mouseenter', function() {
                    if (!this.classList.contains('active')) {
                        this.style.transform = 'scale(1.05)';
                    }
                });
                
                button.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('active')) {
                        this.style.transform = 'scale(1)';
                    }
                });
            });
        } else {
            console.warn('No area filter buttons found in the HTML');
        }
    }
    
    // Filter tables by area
    function filterTablesByArea(area) {
        // Use requestAnimationFrame for smoother animations on mobile
        requestAnimationFrame(() => {
            tableItems.forEach(table => {
                const tableArea = table.closest('.table-group').querySelector('.area-label').textContent;
                
                if (area === 'all' || tableArea === area) {
                    table.classList.remove('filtered-out');
                    
                    // Detect mobile for simpler animations
                    const isMobile = window.innerWidth <= 768;
                    
                    if (isMobile) {
                        // Simpler animation for mobile
                        table.style.opacity = '1';
                        table.style.pointerEvents = 'auto';
                    } else {
                        // Fancier animation for desktop
                        table.style.opacity = '1';
                        table.style.pointerEvents = 'auto';
                        
                        // Add a subtle animation to highlight the included tables
                        table.style.animation = 'none';
                        void table.offsetWidth; // Trigger reflow
                        table.style.animation = 'pulse 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    }
                } else {
                    table.classList.add('filtered-out');
                    table.style.opacity = '0.3';
                    table.style.pointerEvents = 'none';
                    
                    // Deselect if currently selected
                    if (table.classList.contains('selected')) {
                        table.classList.remove('selected');
                        if (selectedTableInput) {
                            selectedTableInput.value = '';
                        }
                        
                        // Reset selection feedback
                        const selectionFeedback = document.getElementById('selection-feedback');
                        if (selectionFeedback) {
                            selectionFeedback.classList.add('hidden');
                            selectionFeedback.classList.remove('visible');
                        }
                    }
                }
            });
            
            // Update available table count
            updateAvailableTableCount();
        });
    }
    
    // Animate floor plan when changing areas
    function animateFloorPlanForArea(area) {
        const restaurantLayout = document.querySelector('.restaurant-layout');
        if (!restaurantLayout) return;
        
        // Detect if on mobile for different transformations
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        // Save current transform
        const currentTransform = restaurantLayout.style.transform;
        
        // Apply transition with different timing based on device
        if (isMobile) {
            restaurantLayout.style.transition = 'transform 0.5s ease-out';
        } else {
            restaurantLayout.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }
        
        // Move floor plan to focus on the selected area with device-specific adjustments
        if (isMobile) {
            // Mobile transformations - simpler and less extreme
            switch(area) {
                case 'Window View':
                    restaurantLayout.style.transform = 'translate(40px, -30px) scale(1.1) rotate(0deg)';
                    break;
                case 'Main Dining':
                    restaurantLayout.style.transform = 'translate(0px, 0px) scale(1.15) rotate(0deg)';
                    break;
                case 'Private Corner':
                    restaurantLayout.style.transform = 'translate(-40px, -30px) scale(1.1) rotate(0deg)';
                    break;
                default:
                    restaurantLayout.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
                    break;
            }
        } else if (isTablet) {
            // Tablet transformations - moderate
            switch(area) {
                case 'Window View':
                    restaurantLayout.style.transform = 'translate(60px, -45px) scale(1.15) rotate(0deg)';
                    break;
                case 'Main Dining':
                    restaurantLayout.style.transform = 'translate(0px, 0px) scale(1.2) rotate(0deg)';
                    break;
                case 'Private Corner':
                    restaurantLayout.style.transform = 'translate(-60px, -45px) scale(1.15) rotate(0deg)';
                    break;
                default:
                    restaurantLayout.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
                    break;
            }
        } else {
            // Desktop transformations - full experience
            switch(area) {
                case 'Window View':
                    restaurantLayout.style.transform = 'translate(80px, -60px) scale(1.2) rotate(0deg)';
                    break;
                case 'Main Dining':
                    restaurantLayout.style.transform = 'translate(0px, 0px) scale(1.3) rotate(0deg)';
                    break;
                case 'Private Corner':
                    restaurantLayout.style.transform = 'translate(-80px, -60px) scale(1.2) rotate(0deg)';
                    break;
                default:
                    restaurantLayout.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
                    break;
            }
        }
        
        // Reset transforms after animation completes with device-specific timing
        setTimeout(() => {
            restaurantLayout.style.transition = 'transform 0.4s ease';
        }, isMobile ? 500 : 800);
    }
    
    // Highlight the area of the selected table
    function highlightTableArea(selectedTable) {
        const tableGroups = document.querySelectorAll('.table-group');
        const selectedGroup = selectedTable.closest('.table-group');
        
        tableGroups.forEach(group => {
            if (group === selectedGroup) {
                group.style.opacity = '1';
                group.style.transform = 'translateZ(5px) scale(1.03)';
            } else {
                group.style.opacity = '0.7';
                group.style.transform = 'translateZ(0)';
            }
        });
    }
    
    // Function to update table availability based on party size
    function updateTableAvailability() {
        if (!partySizeInput) return;
        
        const partySize = parseInt(partySizeInput.value) || 2;
        let availableCount = 0;
        
        tableItems.forEach(table => {
            const tableSeats = parseInt(table.querySelector('.table-shape').getAttribute('data-seats')) || 0;
            
            // Mark tables with insufficient seats as unavailable
            if (tableSeats < partySize) {
                table.classList.add('unavailable');
                table.title = 'Not enough seats for your party size';
                
                // Add visual indicator for unavailable tables
                addUnavailableIndicator(table);
            } else {
                table.classList.remove('unavailable');
                table.title = 'Click to select this table';
                availableCount++;
                
                // Remove visual indicator
                removeUnavailableIndicator(table);
            }
        });
        
        // Update status message
        updateAvailableTableCount();
    }
    
    // Add visual indicator for unavailable tables
    function addUnavailableIndicator(table) {
        if (!table.querySelector('.unavailable-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'unavailable-indicator';
            indicator.innerHTML = '<i class="fas fa-times-circle"></i>';
            table.appendChild(indicator);
        }
    }
    
    // Remove visual indicator
    function removeUnavailableIndicator(table) {
        const indicator = table.querySelector('.unavailable-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Update available table count based on current filters and party size
    function updateAvailableTableCount() {
        if (!statusElement || !partySizeInput) return;
        
        const partySize = parseInt(partySizeInput.value) || 2;
        
        // Count available tables that match the current filter
        let availableCount = 0;
        tableItems.forEach(table => {
            const tableArea = table.closest('.table-group').querySelector('.area-label').textContent;
            const isMatchingArea = (selectedArea === 'all' || tableArea === selectedArea);
            
            if (!table.classList.contains('unavailable') && isMatchingArea) {
                availableCount++;
            }
        });
        
        // Update status message
            if (availableCount === 0) {
            statusElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> No tables available for ${partySize} guests in the selected area`;
                statusElement.style.color = '#F44336';
            } else {
            statusElement.innerHTML = `<i class="fas fa-check-circle"></i> ${availableCount} tables available for ${partySize} guests`;
            statusElement.style.color = '#4CAF50';
        }
    }
});

// Floor Plan Interactive Controls
document.addEventListener('DOMContentLoaded', function() {
    // Get floor plan elements
    const scene = document.querySelector('.scene');
    const restaurantLayout = document.querySelector('.restaurant-layout');
    const floorPlanWrapper = document.querySelector('.floor-plan-wrapper');
    
    // Get control buttons
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const rotateLeftBtn = document.getElementById('rotate-left');
    const rotateRightBtn = document.getElementById('rotate-right');
    const resetViewBtn = document.getElementById('reset-view');
    
    // Initial state
    let currentScale = 1;
    let currentRotation = 0;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    
    // Add control tooltips for better UX
    if (zoomInBtn) zoomInBtn.title = "Zoom In";
    if (zoomOutBtn) zoomOutBtn.title = "Zoom Out";
    if (rotateLeftBtn) rotateLeftBtn.title = "Rotate Left";
    if (rotateRightBtn) rotateRightBtn.title = "Rotate Right";
    if (resetViewBtn) resetViewBtn.title = "Reset View";
    
    // Add instruction overlay
    if (floorPlanWrapper) {
        const instructionOverlay = document.createElement('div');
        instructionOverlay.className = 'instruction-overlay';
        instructionOverlay.innerHTML = `
            <div class="instruction-content">
                <h3>Interactive Floor Plan</h3>
                <p>Use controls to navigate, drag to move, select a table to reserve it</p>
                <button class="got-it-btn">Got It</button>
            </div>
        `;
        floorPlanWrapper.appendChild(instructionOverlay);
        
        // Add event listener to dismiss
        const gotItBtn = instructionOverlay.querySelector('.got-it-btn');
        if (gotItBtn) {
            gotItBtn.addEventListener('click', function() {
                instructionOverlay.style.opacity = '0';
                setTimeout(() => {
                    instructionOverlay.style.display = 'none';
                }, 500);
                
                // Store in session storage so it doesn't show again
                sessionStorage.setItem('floorPlanInstructionSeen', 'true');
            });
        }
        
        // Check if already seen
        if (sessionStorage.getItem('floorPlanInstructionSeen')) {
            instructionOverlay.style.display = 'none';
        }
    }
    
    // Update transform function to properly handle zoom for all elements
    function updateTransform(animate = true) {
        if (restaurantLayout) {
            // Apply animation only when explicitly requested
            restaurantLayout.style.transition = animate ? 'transform 0.3s ease' : 'none';
            
            // Apply transform with limits
            restaurantLayout.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale}) rotate(${currentRotation}deg)`;
            
            // Update scale for all table groups and elements to maintain correct relative positions
            updateElementsScale(currentScale, animate);
            
            // Update control button states for visual feedback
            highlightActiveControls();
        }
    }
    
    // New function to update scale of table groups and elements
    function updateElementsScale(scale, animate) {
        // Update table groups based on current scale
        const tableGroups = document.querySelectorAll('.table-group');
        const tableItems = document.querySelectorAll('.table-item');
        const areaMarkers = document.querySelectorAll('.area-marker');
        
        // Make sure transitions are synchronized
        const transition = animate ? 'transform 0.3s ease, opacity 0.3s ease' : 'none';
        
        tableGroups.forEach(group => {
            // Preserve original position but apply reverse scale to keep size consistent
            group.style.transition = transition;
            
            // Don't scale the groups themselves as they should move with the restaurant layout
            group.style.transform = 'translateZ(0)';
        });
        
        // Update area markers (they should scale inversely with the zoom to maintain size)
        areaMarkers.forEach(marker => {
            marker.style.transition = transition;
            marker.style.transform = `translateX(-50%) scale(${1/scale})`;
        });
        
        // Update table items and shapes (they should scale inversely with the zoom)
        tableItems.forEach(table => {
            if (!table.classList.contains('filtered-out')) {
                table.style.transition = transition;
                
                // Scale tables inversely to maintain size
                if (!table.classList.contains('selected')) {
                    table.style.transform = `translateZ(5px) scale(${1/scale})`;
                } else {
                    // Keep selected tables highlighted
                    table.style.transform = `translateZ(15px) scale(${1.1 * (1/scale)})`;
                }
                
                // Update table info display to remain readable
                const tableInfo = table.querySelector('.table-info');
                if (tableInfo) {
                    tableInfo.style.transition = transition;
                    tableInfo.style.transform = `translateX(-50%) scale(${1/scale})`;
                }
                
                // Update tooltips position
                const tooltip = table.querySelector('.table-tooltip');
                if (tooltip) {
                    tooltip.style.transition = transition;
                    tooltip.style.transform = `translateY(-50%) scale(${1/scale})`;
                }
            }
        });
    }
    
    // Highlight active control buttons based on current state
    function highlightActiveControls() {
        // Reset all buttons
        if (zoomInBtn) zoomInBtn.classList.remove('active');
        if (zoomOutBtn) zoomOutBtn.classList.remove('active');
        if (rotateLeftBtn) rotateLeftBtn.classList.remove('active');
        if (rotateRightBtn) rotateRightBtn.classList.remove('active');
        
        // Highlight based on current state
        if (currentScale > 1 && zoomInBtn) {
            zoomInBtn.classList.add('active');
        } else if (currentScale < 1 && zoomOutBtn) {
            zoomOutBtn.classList.add('active');
        }
        
        if (currentRotation % 360 !== 0) {
            if (currentRotation > 0 && rotateRightBtn) {
                rotateRightBtn.classList.add('active');
            } else if (currentRotation < 0 && rotateLeftBtn) {
                rotateLeftBtn.classList.add('active');
            }
        }
    }
    
    // Zoom in
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
            // Add visual feedback
            this.classList.add('pulse-btn');
            setTimeout(() => {
                this.classList.remove('pulse-btn');
            }, 300);
            
            currentScale += 0.2;
            if (currentScale > 2) currentScale = 2; // Maximum zoom level
            updateTransform();
        });
    }
    
    // Zoom out
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
            // Add visual feedback
            this.classList.add('pulse-btn');
            setTimeout(() => {
                this.classList.remove('pulse-btn');
            }, 300);
            
            currentScale -= 0.2;
            if (currentScale < 0.5) currentScale = 0.5; // Minimum zoom level
            updateTransform();
        });
    }
    
    // Rotate left
    if (rotateLeftBtn) {
        rotateLeftBtn.addEventListener('click', function() {
            // Add visual feedback
            this.classList.add('pulse-btn');
            setTimeout(() => {
                this.classList.remove('pulse-btn');
            }, 300);
            
            currentRotation -= 45; // Larger rotation increment for better UX
            updateTransform();
        });
    }
    
    // Rotate right
    if (rotateRightBtn) {
        rotateRightBtn.addEventListener('click', function() {
            // Add visual feedback
            this.classList.add('pulse-btn');
            setTimeout(() => {
                this.classList.remove('pulse-btn');
            }, 300);
            
            currentRotation += 45; // Larger rotation increment for better UX
            updateTransform();
        });
    }
    
    // Reset view
    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', function() {
            // Add visual feedback
            this.classList.add('pulse-btn');
            setTimeout(() => {
                this.classList.remove('pulse-btn');
            }, 300);
            
            // Reset the floor plan
            resetFloorPlan();
        });
    }
    
    // Improved dragging functionality
    if (scene) {
        // Add cursor hint
        scene.setAttribute('title', 'Click and drag to move the floor plan');
        scene.style.cursor = 'grab';
        
        scene.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            scene.style.cursor = 'grabbing';
            
            // Remove transition for immediate response
            if (restaurantLayout) {
                restaurantLayout.style.transition = 'none';
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            
            // Apply limits to prevent dragging too far
            const maxDrag = 300 * currentScale;
            translateX = Math.max(-maxDrag, Math.min(maxDrag, translateX));
            translateY = Math.max(-maxDrag, Math.min(maxDrag, translateY));
            
            updateTransform(false); // No animation during drag
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                scene.style.cursor = 'grab';
                
                // Re-enable transition
                if (restaurantLayout) {
                    restaurantLayout.style.transition = 'transform 0.3s ease';
                }
            }
        });
        
        // Handle mouse leaving window
        document.addEventListener('mouseleave', function() {
            if (isDragging) {
                isDragging = false;
                scene.style.cursor = 'grab';
            }
        });
    }
    
    // Enhanced mouse wheel zoom
    if (scene) {
        scene.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            // Get mouse position relative to scene
            const rect = scene.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Calculate direction
            const delta = Math.sign(e.deltaY);
            
            // Adjust scale
            const prevScale = currentScale;
            
            // Adjust scale based on wheel direction
            if (delta > 0) {
                // Zoom out
                currentScale -= 0.1;
                if (currentScale < 0.5) currentScale = 0.5; // Minimum zoom
            } else {
                // Zoom in
                currentScale += 0.1;
                if (currentScale > 2) currentScale = 2; // Maximum zoom
            }
            
            // Calculate translation adjustment to zoom toward/away from mouse position
            // This makes the zoom feel more natural by centering on the cursor
            const scaleChange = currentScale - prevScale;
            const offsetX = (mouseX - rect.width / 2) * scaleChange;
            const offsetY = (mouseY - rect.height / 2) * scaleChange;
            
            translateX -= offsetX;
            translateY -= offsetY;
            
            // Apply limits to prevent dragging too far
            const maxDrag = 300 * currentScale;
            translateX = Math.max(-maxDrag, Math.min(maxDrag, translateX));
            translateY = Math.max(-maxDrag, Math.min(maxDrag, translateY));
            
            // Update transform with animation
            updateTransform(false);
        });
    }
    
    // Touch support for mobile devices
    if (scene) {
        let lastDistance = 0;
        let lastTouchTime = 0;
        
        scene.addEventListener('touchstart', function(e) {
            const now = Date.now();
            
            if (e.touches.length === 1) {
                isDragging = true;
                startX = e.touches[0].clientX - translateX;
                startY = e.touches[0].clientY - translateY;
                
                // Check for double tap (zoom in)
                if (now - lastTouchTime < 300) {
                    currentScale = Math.min(2, currentScale + 0.3);
                    updateTransform();
                }
            } else if (e.touches.length === 2) {
                // For pinch zoom
                lastDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
            
            lastTouchTime = now;
        });
        
        scene.addEventListener('touchmove', function(e) {
            e.preventDefault(); // Prevent scrolling
            
            if (e.touches.length === 1 && isDragging) {
                translateX = e.touches[0].clientX - startX;
                translateY = e.touches[0].clientY - startY;
                
                // Apply limits
                const maxDrag = 300 * currentScale;
                translateX = Math.max(-maxDrag, Math.min(maxDrag, translateX));
                translateY = Math.max(-maxDrag, Math.min(maxDrag, translateY));
                
                updateTransform(false);
            } else if (e.touches.length === 2) {
                // Pinch zoom
                const distance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                
                if (lastDistance) {
                    const delta = distance - lastDistance;
                    currentScale += delta * 0.01;
                    currentScale = Math.max(0.5, Math.min(2, currentScale));
                    updateTransform(false);
                }
                
                lastDistance = distance;
            }
        });
        
        scene.addEventListener('touchend', function() {
            isDragging = false;
            lastDistance = 0;
            
            // Re-enable transition
            if (restaurantLayout) {
                restaurantLayout.style.transition = 'transform 0.3s ease';
            }
        });
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Only process if the floor plan wrapper is in view
        if (!floorPlanWrapper) return;
        
        const rect = floorPlanWrapper.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        
        switch(e.key) {
            case '+':
            case '=':
                // Zoom in
                currentScale = Math.min(2, currentScale + 0.1);
                updateTransform();
                if (zoomInBtn) {
                    zoomInBtn.classList.add('pulse-btn');
                    setTimeout(() => zoomInBtn.classList.remove('pulse-btn'), 300);
                }
                break;
            case '-':
            case '_':
                // Zoom out
                currentScale = Math.max(0.5, currentScale - 0.1);
                updateTransform();
                if (zoomOutBtn) {
                    zoomOutBtn.classList.add('pulse-btn');
                    setTimeout(() => zoomOutBtn.classList.remove('pulse-btn'), 300);
                }
                break;
            case 'ArrowLeft':
                if (e.shiftKey) {
                    // Rotate left
                    currentRotation -= 45;
                    updateTransform();
                    if (rotateLeftBtn) {
                        rotateLeftBtn.classList.add('pulse-btn');
                        setTimeout(() => rotateLeftBtn.classList.remove('pulse-btn'), 300);
                    }
                } else {
                    // Move left
                    translateX += 30;
                    updateTransform();
                }
                break;
            case 'ArrowRight':
                if (e.shiftKey) {
                    // Rotate right
                    currentRotation += 45;
                    updateTransform();
                    if (rotateRightBtn) {
                        rotateRightBtn.classList.add('pulse-btn');
                        setTimeout(() => rotateRightBtn.classList.remove('pulse-btn'), 300);
                    }
                } else {
                    // Move right
                    translateX -= 30;
                    updateTransform();
                }
                break;
            case 'ArrowUp':
                // Move up
                translateY += 30;
                updateTransform();
                break;
            case 'ArrowDown':
                // Move down
                translateY -= 30;
                updateTransform();
                break;
            case 'r':
            case 'R':
                // Reset view
                currentScale = 1;
                currentRotation = 0;
                translateX = 0;
                translateY = 0;
                updateTransform();
                if (resetViewBtn) {
                    resetViewBtn.classList.add('pulse-btn');
                    setTimeout(() => resetViewBtn.classList.remove('pulse-btn'), 300);
                }
                break;
        }
    });
    
    // Initialize with default setting
    updateTransform();
});

// Make restaurant areas interactive
function setupInteractiveAreas() {
    // Make area markers interactive
    const areaMarkers = document.querySelectorAll('.area-marker');
    areaMarkers.forEach(marker => {
        marker.style.cursor = 'pointer';
        marker.addEventListener('click', function() {
            const area = this.getAttribute('data-area');
            // Find and click the corresponding filter button
            const filterBtn = document.querySelector(`.area-filter-btn[data-area="${area}"]`);
            if (filterBtn) {
                filterBtn.click();
            }
            showAreaInfo(area);
        });
        
        marker.addEventListener('mouseenter', function() {
            const area = this.getAttribute('data-area');
            marker.style.transform = 'translateX(-50%) scale(1.1)';
            highlightArea(area, true);
        });
        
        marker.addEventListener('mouseleave', function() {
            const area = this.getAttribute('data-area');
            marker.style.transform = 'translateX(-50%)';
            highlightArea(area, false);
        });
    });
    
    // Make restaurant features (entrance, kitchen, bar) interactive
    const features = document.querySelectorAll('.entrance, .kitchen, .bar');
    features.forEach(feature => {
        feature.style.cursor = 'pointer';
        
        feature.addEventListener('click', function() {
            const featureType = this.classList[0]; // 'entrance', 'kitchen', or 'bar'
            showFeatureInfo(featureType, this);
        });
        
        feature.addEventListener('mouseenter', function() {
            // Store original transform to avoid losing it
            const originalTransform = feature.style.transform || '';
            feature.dataset.originalTransform = originalTransform;
            
            // Apply new styling without completely replacing transform
            feature.style.backgroundColor = 'rgba(var(--primary-rgb), 0.4)';
            
            // Handle transform carefully to avoid removing original transforms
            const hasScale = originalTransform.includes('scale');
            if (!hasScale) {
                if (originalTransform) {
                    feature.style.transform = `${originalTransform} scale(1.05)`;
                } else {
                    feature.style.transform = 'scale(1.05)';
                }
            }
            
            feature.style.boxShadow = '0 5px 15px rgba(var(--primary-rgb), 0.4)';
        });
        
        feature.addEventListener('mouseleave', function() {
            // Restore original transform
            feature.style.backgroundColor = 'rgba(var(--primary-rgb), 0.2)';
            feature.style.transform = feature.dataset.originalTransform || '';
            feature.style.boxShadow = 'none';
        });
    });
    
    // Make table groups interactive
    const tableGroups = document.querySelectorAll('.table-group');
    tableGroups.forEach(group => {
        const areaName = group.querySelector('.area-label').textContent;
        
        group.addEventListener('mouseenter', function() {
            if (!group.classList.contains('highlighted')) {
                // Store original transform if it doesn't exist
                if (!group.dataset.originalTransform) {
                    group.dataset.originalTransform = group.style.transform || '';
                }
                
                // Apply subtle transform enhancement that preserves existing transforms
                if (group.style.transform) {
                    if (!group.style.transform.includes('translateZ(2px)')) {
                        group.style.transform += ' translateZ(2px)';
                    }
                } else {
                    group.style.transform = 'translateZ(2px)';
                }
                
                showAreaPreview(areaName);
            }
        });
        
        group.addEventListener('mouseleave', function() {
            if (!group.classList.contains('highlighted')) {
                // Restore original transform
                group.style.transform = group.dataset.originalTransform || '';
                hideAreaPreview();
            }
        });
    });
}

// Highlight the entire area (not just a selected table)
function highlightArea(areaName, isHighlighted) {
    const tableGroups = document.querySelectorAll('.table-group');
    
    tableGroups.forEach(group => {
        const groupArea = group.querySelector('.area-label').textContent;
        if (groupArea === areaName) {
            if (isHighlighted) {
                group.classList.add('highlighted');
                group.style.opacity = '1';
                
                // Store original transform if not already stored
                if (!group.dataset.originalTransform) {
                    group.dataset.originalTransform = group.style.transform || '';
                }
                
                // Apply relative transform that builds on existing transforms
                if (group.style.transform) {
                    if (!group.style.transform.includes('scale')) {
                        group.style.transform += ' scale(1.05)';
                    }
                    if (!group.style.transform.includes('translateZ')) {
                        group.style.transform += ' translateZ(8px)';
                    }
                } else {
                    group.style.transform = 'translateZ(8px) scale(1.05)';
                }
                
                // Highlight all tables in this area
                const tables = group.querySelectorAll('.table-item:not(.filtered-out):not(.unavailable)');
                tables.forEach(table => {
                    // Store original transform for tables too
                    if (!table.dataset.originalTransform) {
                        table.dataset.originalTransform = table.style.transform || '';
                    }
                    
                    // Apply new transform
                    table.style.transform = 'translateZ(10px) scale(1.05)';
                    table.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    
                    const tableShape = table.querySelector('.table-shape');
                    if (tableShape) {
                        tableShape.style.backgroundColor = 'rgba(var(--primary-rgb), 0.3)';
                    }
                });
            } else {
                group.classList.remove('highlighted');
                group.style.opacity = '';
                
                // Restore original transform
                group.style.transform = group.dataset.originalTransform || '';
                
                // Reset tables
                const tables = group.querySelectorAll('.table-item');
                tables.forEach(table => {
                    if (!table.classList.contains('selected')) {
                        // Restore original transform
                        table.style.transform = table.dataset.originalTransform || 'translateZ(5px)';
                        
                        const tableShape = table.querySelector('.table-shape');
                        if (tableShape) {
                            tableShape.style.backgroundColor = 'rgba(var(--primary-rgb), 0.2)';
                        }
                    }
                });
            }
        }
    });
}

// Show information about a specific area
function showAreaInfo(areaName) {
    let message, availableTables = 0;
    
    // Count available tables in this area
    tableItems.forEach(table => {
        const tableArea = table.closest('.table-group').querySelector('.area-label').textContent;
        if (tableArea === areaName && !table.classList.contains('unavailable')) {
            availableTables++;
        }
    });
    
    // Create area-specific messages
    switch(areaName) {
        case 'Window View':
            message = `Window View area: ${availableTables} tables available. Perfect for a scenic view during your meal.`;
            break;
        case 'Main Dining':
            message = `Main Dining area: ${availableTables} tables available. The heart of our restaurant with a vibrant atmosphere.`;
            break;
        case 'Private Corner':
            message = `Private Corner: ${availableTables} tables available. A quieter space for intimate dining experience.`;
            break;
        default:
            message = `${areaName}: ${availableTables} tables available`;
    }
    
    showNotification(message, 'info', 3000);
}

// Show preview of area on hover
function showAreaPreview(areaName) {
    const previewElement = document.createElement('div');
    previewElement.className = 'area-preview';
    previewElement.style.position = 'absolute';
    previewElement.style.bottom = '20px';
    previewElement.style.left = '20px';
    previewElement.style.backgroundColor = 'rgba(18, 18, 18, 0.9)';
    previewElement.style.color = '#fff';
    previewElement.style.padding = '10px 15px';
    previewElement.style.borderRadius = '5px';
    previewElement.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    previewElement.style.zIndex = '100';
    previewElement.style.maxWidth = '250px';
    previewElement.style.border = '1px solid var(--primary-color)';
    previewElement.style.fontSize = '0.9rem';
    previewElement.style.pointerEvents = 'none';
    previewElement.style.transition = 'opacity 0.2s ease';
    
    // Set area-specific content
    switch(areaName) {
        case 'Window View':
            previewElement.innerHTML = '<strong>Window View</strong><p>Tables with a view of the cityscape. Romantic and perfect for special occasions.</p>';
            break;
        case 'Main Dining':
            previewElement.innerHTML = '<strong>Main Dining</strong><p>The central area of our restaurant. Lively atmosphere with larger tables available.</p>';
            break;
        case 'Private Corner':
            previewElement.innerHTML = '<strong>Private Corner</strong><p>A secluded area ideal for intimate dining or quiet business conversations.</p>';
            break;
        default:
            previewElement.innerHTML = `<strong>${areaName}</strong>`;
    }
    
    // Remove any existing previews
    hideAreaPreview();
    
    // Add to floor plan wrapper instead of scene to avoid transform issues
    const floorPlanWrapper = document.querySelector('.floor-plan-wrapper');
    if (floorPlanWrapper) {
        floorPlanWrapper.appendChild(previewElement);
        
        // Animate in
        setTimeout(() => {
            previewElement.style.opacity = '1';
        }, 50);
    }
}

// Hide area preview
function hideAreaPreview() {
    const existingPreview = document.querySelector('.area-preview');
    if (existingPreview) {
        existingPreview.style.opacity = '0';
        setTimeout(() => {
            if (existingPreview.parentNode) {
                existingPreview.parentNode.removeChild(existingPreview);
            }
        }, 200);
    }
}

// Show information about a restaurant feature (entrance, kitchen, bar)
function showFeatureInfo(featureType, element) {
    let message;
    
    switch(featureType) {
        case 'entrance':
            message = 'Main Entrance: Welcome to Café Delight! Check in with our host for your reservation.';
            break;
        case 'kitchen':
            message = 'Kitchen: Where our chefs prepare each dish with care and precision.';
            break;
        case 'bar':
            message = 'Bar: A selection of craft cocktails, fine wines, and premium spirits.';
            break;
        default:
            message = featureType;
    }
    
    // Create tooltip within the floor plan wrapper instead of scene
    const tooltip = document.createElement('div');
    tooltip.className = 'feature-tooltip';
    tooltip.textContent = message;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '10px 15px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.width = 'max-content';
    tooltip.style.maxWidth = '250px';
    tooltip.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    tooltip.style.zIndex = '1000';
    tooltip.style.fontSize = '0.9rem';
    
    // Position the tooltip at the top of the floor plan wrapper
    tooltip.style.top = '10px';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.3s ease';
    tooltip.style.border = '1px solid var(--primary-color)';
    
    // Remove any existing tooltips
    const existingTooltips = document.querySelectorAll('.feature-tooltip');
    existingTooltips.forEach(t => {
        if (t.parentNode) {
            t.parentNode.removeChild(t);
        }
    });
    
    // Add to floor plan wrapper
    const floorPlanWrapper = document.querySelector('.floor-plan-wrapper');
    if (floorPlanWrapper) {
        floorPlanWrapper.appendChild(tooltip);
        
        // Animate in
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 50);
        
        // Remove after a delay
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 300);
        }, 3000);
    }
}

// Enhanced notification function with duration parameter
function showNotification(message, type = 'info', duration = 2000) {
    const notificationContainer = document.querySelector('.notification-container') || (() => {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    })();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas ${getIconForType(type)}"></i> ${message}`;
    notification.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
    notification.style.color = '#fff';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '8px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.borderLeft = `4px solid ${getColorForType(type)}`;
    notification.style.transform = 'translateX(120%)';
    notification.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    notification.style.opacity = '0';
    
    notificationContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 50);
    
    // Automatically remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, duration);
    
    function getIconForType(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info': 
            default: return 'fa-info-circle';
        }
    }
    
    function getColorForType(type) {
        switch(type) {
            case 'success': return '#4CAF50';
            case 'error': return '#F44336';
            case 'warning': return '#FFC107';
            case 'info':
            default: return 'var(--primary-color)';
        }
    }
}

// Initialize the floor plan view
function initFloorPlan() {
    const floorPlan3D = document.querySelector('.floor-plan-3d');
    const restaurantLayout = document.querySelector('.restaurant-layout');
    
    if (floorPlan3D && restaurantLayout) {
        // Make sure the 3D transform is applied
        floorPlan3D.style.transform = 'rotateX(40deg) rotateZ(0deg)';
        floorPlan3D.style.transformStyle = 'preserve-3d';
        
        // Set initial state for restaurant layout
        restaurantLayout.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
        restaurantLayout.style.transformStyle = 'preserve-3d';
        
        // Ensure all table groups are visible
        const tableGroups = document.querySelectorAll('.table-group');
        tableGroups.forEach(group => {
            group.style.opacity = '1';
            group.style.visibility = 'visible';
            group.style.display = 'block';
            
            // Make sure all tables are visible
            const tables = group.querySelectorAll('.table-item');
            tables.forEach(table => {
                if (!table.classList.contains('filtered-out') && 
                    !table.classList.contains('unavailable')) {
                    table.style.opacity = '1';
                    table.style.visibility = 'visible';
                }
            });
        });
        
        // Make sure walls are visible
        const walls = document.querySelectorAll('.wall');
        walls.forEach(wall => {
            wall.style.visibility = 'visible';
            wall.style.opacity = '1';
        });
        
        // Make sure features are visible
        const features = document.querySelectorAll('.entrance, .kitchen, .bar');
        features.forEach(feature => {
            feature.style.visibility = 'visible';
            feature.style.opacity = '1';
        });
        
        console.log('Floor plan initialized');
    }
}

// Reset restaurant floor plan to default state
function resetFloorPlan() {
    const floorPlan3D = document.querySelector('.floor-plan-3d');
    const restaurantLayout = document.querySelector('.restaurant-layout');
    
    if (floorPlan3D && restaurantLayout) {
        // Reset the 3D perspective
        floorPlan3D.style.transform = 'rotateX(40deg) rotateZ(0deg)';
        floorPlan3D.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Reset restaurant layout
        restaurantLayout.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
        restaurantLayout.style.transition = 'transform 0.4s ease';
        
        // Reset variables
        currentScale = 1;
        currentRotation = 0;
        translateX = 0;
        translateY = 0;
        
        // Reset all table groups
        const tableGroups = document.querySelectorAll('.table-group');
        tableGroups.forEach(group => {
            group.style.opacity = '1';
            group.style.transform = '';
            group.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            group.dataset.originalTransform = '';
            group.classList.remove('highlighted');
        });
        
        // Reset area markers
        const areaMarkers = document.querySelectorAll('.area-marker');
        areaMarkers.forEach(marker => {
            marker.style.transform = 'translateX(-50%)';
        });
        
        // Reset tables and their elements
        updateElementsScale(1, true);
        
        // Reset specific table states
        const tables = document.querySelectorAll('.table-item');
        tables.forEach(table => {
            if (!table.classList.contains('selected')) {
                // Clear inline styles that might be interfering
                table.style.transform = 'translateZ(5px)';
                table.dataset.originalTransform = 'translateZ(5px)';
                
                const tableShape = table.querySelector('.table-shape');
                if (tableShape) {
                    tableShape.style.backgroundColor = 'rgba(var(--primary-rgb), 0.2)';
                }
            }
        });
        
        // Reset walls and features
        document.querySelectorAll('.wall, .entrance, .kitchen, .bar').forEach(element => {
            element.style.visibility = 'visible';
            element.style.opacity = '1';
        });
        
        // Show notification
        showNotification('Floor plan reset to default view', 'info');
        
        console.log('Floor plan reset');
    }
}

// Reset view
if (resetViewBtn) {
    resetViewBtn.addEventListener('click', function() {
        // Add visual feedback
        this.classList.add('pulse-btn');
        setTimeout(() => {
            this.classList.remove('pulse-btn');
        }, 300);
        
        // Reset the floor plan
        resetFloorPlan();
    });
}

function initTableInteractions() {
    console.log('Initializing table interactions');
    
    const tables = document.querySelectorAll('.table-item');
    const tooltips = document.querySelectorAll('.table-tooltip');
    
    // Hide all tooltips initially
    tooltips.forEach(tooltip => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    });
    
    // Set up event listeners for table interactions
    tables.forEach(table => {
        // Show tooltip on hover
        table.addEventListener('mouseenter', function() {
            if (!this.classList.contains('unavailable') && !this.classList.contains('filtered-out')) {
                const tooltip = this.querySelector('.table-tooltip');
                if (tooltip) {
                    tooltip.style.opacity = '1';
                    tooltip.style.visibility = 'visible';
                    
                    // Position the tooltip appropriately based on table position
                    const tableRect = this.getBoundingClientRect();
                    const sceneRect = document.querySelector('.scene').getBoundingClientRect();
                    
                    // If table is close to the right edge, show tooltip on the left
                    if (tableRect.right + 200 > sceneRect.right) {
                        tooltip.style.left = 'auto';
                        tooltip.style.right = '110%';
                        tooltip.style.marginLeft = '0';
                        tooltip.style.marginRight = '10px';
                    } else {
                        tooltip.style.left = '100%';
                        tooltip.style.right = 'auto';
                        tooltip.style.marginLeft = '10px';
                        tooltip.style.marginRight = '0';
                    }
                }
            }
        });
        
        // Hide tooltip on mouse leave
        table.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.table-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            }
        });
        
        // Select table on click
        table.addEventListener('click', function() {
            if (!this.classList.contains('unavailable') && !this.classList.contains('filtered-out')) {
                // Deselect all tables first
                tables.forEach(t => t.classList.remove('selected'));
                
                // Select this table
                this.classList.add('selected');
                
                // Show selection feedback
                const selectionFeedback = document.getElementById('selection-feedback');
                const selectionText = document.getElementById('selection-text');
                const tableNum = this.getAttribute('data-table');
                const tableArea = this.getAttribute('data-area');
                const seats = this.querySelector('.table-shape').getAttribute('data-seats');
                
                if (selectionFeedback && selectionText) {
                    selectionFeedback.classList.remove('hidden');
                    selectionText.textContent = `Table ${tableNum} (${tableArea}, ${seats} seats)`;
                }
                
                // Update reservation form with selected table
                const tableSelectionStatus = document.getElementById('table-selection-status');
                if (tableSelectionStatus) {
                    tableSelectionStatus.textContent = `You selected Table ${tableNum} in ${tableArea} for ${seats} people`;
                    tableSelectionStatus.classList.add('table-selected');
                }
                
                // Show a notification
                showNotification(`Table ${tableNum} selected!`, 'success');
                
                // Add selected table info to a hidden input in form
                let selectedTableInput = document.getElementById('selected-table');
                if (!selectedTableInput) {
                    selectedTableInput = document.createElement('input');
                    selectedTableInput.type = 'hidden';
                    selectedTableInput.id = 'selected-table';
                    selectedTableInput.name = 'selected-table';
                    document.getElementById('reservationForm').appendChild(selectedTableInput);
                }
                selectedTableInput.value = tableNum;
            }
        });
    });
    
    // Highlight tables based on available seats when party size changes
    const partySizeSelect = document.getElementById('party-size');
    if (partySizeSelect) {
        partySizeSelect.addEventListener('change', function() {
            const partySize = parseInt(this.value);
            
            tables.forEach(table => {
                const tableSeats = parseInt(table.querySelector('.table-shape').getAttribute('data-seats'));
                
                if (tableSeats < partySize) {
                    table.classList.add('unavailable');
                } else {
                    table.classList.remove('unavailable');
                }
            });
            
            // Reset selection if the currently selected table is now unavailable
        const selectedTable = document.querySelector('.table-item.selected');
        if (selectedTable && selectedTable.classList.contains('unavailable')) {
            selectedTable.classList.remove('selected');
                
                const selectionFeedback = document.getElementById('selection-feedback');
                if (selectionFeedback) {
                    selectionFeedback.classList.add('hidden');
                }
                
                const tableSelectionStatus = document.getElementById('table-selection-status');
                if (tableSelectionStatus) {
                    tableSelectionStatus.textContent = 'Please select a table for your reservation';
                    tableSelectionStatus.classList.remove('table-selected');
                }
                
                showNotification('Your previously selected table is too small for your party size. Please select another table.', 'warning');
            }
        });
    }
}

// Update the initFloorPlan function to also initialize table interactions
function initFloorPlan() {
    console.log('Initializing floor plan');
    const floorPlan = document.querySelector('.floor-plan-3d');
    const layout = document.querySelector('.restaurant-layout');
    
    if (floorPlan && layout) {
        // Ensure 3D transform is applied
        floorPlan.style.transformStyle = 'preserve-3d';
        floorPlan.style.transform = 'rotateX(40deg) rotateZ(0deg)';
        
        // Make sure all table groups are visible
        const tableGroups = document.querySelectorAll('.table-group');
        tableGroups.forEach(group => {
            group.style.opacity = '1';
            group.style.transform = 'translateZ(0)';
        });
        
        // Make sure all tables are visible
        const tables = document.querySelectorAll('.table-item');
        tables.forEach(table => {
            table.style.opacity = '1';
            table.style.transform = 'translateZ(5px)';
        });
        
        // Make sure walls and features are visible
        const walls = document.querySelectorAll('.wall');
        walls.forEach(wall => {
            wall.style.opacity = '1';
        });
        
        const features = document.querySelectorAll('.entrance, .kitchen, .bar');
        features.forEach(feature => {
            feature.style.opacity = '1';
        });
        
        // Initialize table interactions
        initTableInteractions();
        
        console.log('Floor plan initialized successfully');
    } else {
        console.error('Floor plan elements not found');
    }
}

// Call initTableInteractions function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    initFloorPlan();
    initTableInteractions();
    
    // ... existing code ...
});

// Feedback Form Handling
document.addEventListener("DOMContentLoaded", function() {
    const feedbackForm = document.getElementById('customer-feedback');
    const successMessage = document.querySelector('.feedback-success');
    const closeSuccessBtn = document.querySelector('.close-success');
    
    if (feedbackForm) {
        // Handle star rating interaction
        const starLabels = document.querySelectorAll('.star-rating label');
        starLabels.forEach(label => {
            label.addEventListener('mouseover', function() {
                // Add hover class for animation
                this.classList.add('star-hover');
            });
            
            label.addEventListener('mouseout', function() {
                // Remove hover class
                this.classList.remove('star-hover');
            });
        });
        
        // Make checkbox items clickable as a whole
        const checkboxItems = document.querySelectorAll('.checkbox-item');
        checkboxItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Don't trigger if clicking on the actual checkbox or label
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL') {
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    
                    // Toggle active class
                    if (checkbox.checked) {
                        this.classList.add('active');
                    } else {
                        this.classList.remove('active');
                    }
                }
            });
        });
        
        // Form validation and submission
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const requiredFields = feedbackForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add shake animation to highlight error
                    field.classList.add('shake');
                    setTimeout(() => {
                        field.classList.remove('shake');
                    }, 500);
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Check if a rating was selected
            const ratingSelected = feedbackForm.querySelector('input[name="rating"]:checked');
            const ratingGroup = feedbackForm.querySelector('.rating-group');
            
            if (!ratingSelected) {
                isValid = false;
                ratingGroup.classList.add('error');
                // Add shake animation
                ratingGroup.classList.add('shake');
                setTimeout(() => {
                    ratingGroup.classList.remove('shake');
                }, 500);
            } else {
                ratingGroup.classList.remove('error');
            }
            
            // If form is valid, submit it
            if (isValid) {
                // Add loading state
                const submitBtn = feedbackForm.querySelector('.submit-feedback');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                
                // Simulate form submission (replace with actual AJAX in production)
                setTimeout(() => {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Submit Feedback';
                    
                    // Show success message
                    if (successMessage) {
                        successMessage.classList.remove('hidden');
                    }
                    
                    // Reset form
                    feedbackForm.reset();
                    
                    // Log the feedback data (for demonstration)
                    console.log('Feedback submitted successfully!');
                }, 1500);
            }
        });
        
        // Close success message
        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', function() {
                successMessage.classList.add('hidden');
            });
        }
        
        // Handle form field animations
        const formFields = feedbackForm.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            // Add focus effect
            field.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            field.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                
                // Validate on blur
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
        });
    }
});

// Enhanced Date Picker and Calendar Functionality
document.addEventListener('DOMContentLoaded', function() {
    const availabilityDateInput = document.getElementById('availability-date');
    const checkAvailabilityBtn = document.getElementById('check-availability-btn');
    const currentMonthElement = document.getElementById('current-month');
    const daysContainer = document.querySelector('.days');
    const prevMonthBtn = document.querySelector('.month-nav.prev');
    const nextMonthBtn = document.querySelector('.month-nav.next');
    const weekdayDivs = document.querySelectorAll('.weekdays div');
    
    let currentDate = new Date();
    let selectedDate = new Date();
    
    // Format date for display and input field
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Format month for header display
    function formatMonthHeader(date) {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    // Update weekday labels based on screen size
    function updateWeekdayLabels() {
        if (weekdayDivs.length > 0) {
            const isMobile = window.innerWidth < 576;
            
            weekdayDivs.forEach(div => {
                const dayIndex = parseInt(div.getAttribute('data-day'));
                if (!isNaN(dayIndex)) {
                    // Set abbreviated or single-letter names based on screen size
                    if (isMobile) {
                        // Single letter for very small screens
                        const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                        div.textContent = dayLetters[dayIndex];
                    } else {
                        // Abbreviated names for larger screens
                        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        div.textContent = dayNames[dayIndex];
                    }
                }
            });
        }
    }
    
    // Render the calendar with improved weekday handling
    function renderCalendar() {
        if (!currentMonthElement || !daysContainer) return;
        
        // Update month header
        currentMonthElement.textContent = formatMonthHeader(currentDate);
        
        // Clear existing days
        daysContainer.innerHTML = '';
        
        // Get first day of month and total days
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const totalDays = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
        
        // Previous month's days to fill the first row
        for (let i = 0; i < startingDayOfWeek; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day inactive';
            
            // Add weekend class if it's a weekend day
            if (i === 0 || i === 6) {
                dayElement.classList.add('weekend');
            }
            
            daysContainer.appendChild(dayElement);
        }
        
        // Current month's days
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayFormatted = formatDate(today);
        const selectedFormatted = formatDate(selectedDate);
        
        for (let i = 1; i <= totalDays; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = i;
            
            // Create date object for this day
            const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const currentDayFormatted = formatDate(currentDayDate);
            
            // Check if it's a weekend
            const dayOfWeek = currentDayDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayElement.classList.add('weekend');
            }
            
            // Add special classes
            if (currentDayFormatted === todayFormatted) {
                dayElement.classList.add('today');
            }
            
            if (currentDayFormatted === selectedFormatted) {
                dayElement.classList.add('selected');
            }
            
            // Mark past days as inactive
            if (currentDayDate < today && currentDayFormatted !== todayFormatted) {
                dayElement.classList.add('inactive');
            } else {
                // Add availability indicator based on day of week and randomness for demo
                // Weekends are more likely to be limited or full
                let rand;
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    // Weekends are busier
                    rand = Math.random();
                    if (rand < 0.4) {
                        dayElement.classList.add('full');
                    } else if (rand < 0.8) {
                        dayElement.classList.add('limited');
                    } else {
                        dayElement.classList.add('available');
                    }
                } else {
                    // Weekdays
                    rand = Math.random();
                    if (rand < 0.1) {
                        dayElement.classList.add('full');
                    } else if (rand < 0.3) {
                        dayElement.classList.add('limited');
                    } else {
                        dayElement.classList.add('available');
                    }
                }
                
                // Add click event for valid days
                dayElement.addEventListener('click', function() {
                    if (!this.classList.contains('inactive')) {
                        // Update selected date
                        selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
                        
                        // Update date input
                        if (availabilityDateInput) {
                            availabilityDateInput.value = formatDate(selectedDate);
                            
                            // Trigger change event to update the time slots
                            const changeEvent = new Event('change');
                            availabilityDateInput.dispatchEvent(changeEvent);
                        }
                        
                        // Rerender calendar to update selected state
                        renderCalendar();
                        
                        // Add animation to the clicked day
                        this.classList.add('pulse');
                        setTimeout(() => {
                            this.classList.remove('pulse');
                        }, 500);
                    }
                });
            }
            
            daysContainer.appendChild(dayElement);
        }
        
        // Fill remaining spaces with next month's days (inactive)
        const totalCells = 42; // 6 rows * 7 days
        const remainingCells = totalCells - (startingDayOfWeek + totalDays);
        
        for (let i = 0; i < remainingCells; i++) {
            if (daysContainer.children.length < 35) { // Only fill up to 5 rows if possible
                const dayElement = document.createElement('div');
                dayElement.className = 'day inactive';
                
                // Calculate the day of week for this cell
                const nextMonthDay = (startingDayOfWeek + totalDays + i) % 7;
                if (nextMonthDay === 0 || nextMonthDay === 6) {
                    dayElement.classList.add('weekend');
                }
                
                daysContainer.appendChild(dayElement);
            }
        }
    }
    
    // Initialize the date picker with today's date
    if (availabilityDateInput) {
        const today = formatDate(new Date());
        availabilityDateInput.value = today;
        availabilityDateInput.min = today;
        
        // Update visual calendar when date input changes
        availabilityDateInput.addEventListener('change', function() {
            if (this.value) {
                selectedDate = new Date(this.value);
                currentDate = new Date(this.value);
                renderCalendar();
                
                // Add animation to the date picker
                this.classList.add('pulse');
                setTimeout(() => {
                    this.classList.remove('pulse');
                }, 500);
                
                // Simulate checking availability
                if (checkAvailabilityBtn) {
                    checkAvailabilityBtn.click();
                }
            }
        });
        
        // Focus animation
        availabilityDateInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        availabilityDateInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // Initial update of weekday labels
        updateWeekdayLabels();
        
        // Update weekday labels when window is resized
        window.addEventListener('resize', function() {
            updateWeekdayLabels();
        });
        
        // Initialize visual calendar
        renderCalendar();
    }
    
    // Previous month button
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Create a date for the first of current month
            const firstOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            
            // Only go to previous month if it's not before current month
            if (firstOfCurrentMonth > today) {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
                
                // Add animation to the month header
                if (currentMonthElement) {
                    currentMonthElement.style.animation = 'none';
                    void currentMonthElement.offsetWidth; // Trigger reflow
                    currentMonthElement.style.animation = 'fadeIn 0.5s';
                }
            } else {
                // Show notification or visual feedback
                this.classList.add('shake');
                setTimeout(() => {
                    this.classList.remove('shake');
                }, 500);
            }
        });
    }
    
    // Next month button
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            // Limit to 3 months in the future
            const threeMonthsLater = new Date();
            threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
            
            // Create a date for the first of the next month
            const firstOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            
            if (firstOfNextMonth < threeMonthsLater) {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
                
                // Add animation to the month header
                if (currentMonthElement) {
                    currentMonthElement.style.animation = 'none';
                    void currentMonthElement.offsetWidth; // Trigger reflow
                    currentMonthElement.style.animation = 'fadeIn 0.5s';
                }
            } else {
                // Show notification or visual feedback
                this.classList.add('shake');
                setTimeout(() => {
                    this.classList.remove('shake');
                }, 500);
            }
        });
    }
    
    // Check button enhancement
    if (checkAvailabilityBtn) {
        checkAvailabilityBtn.addEventListener('mouseenter', function() {
            this.querySelector('i').classList.add('fa-spin');
            setTimeout(() => {
                this.querySelector('i').classList.remove('fa-spin');
            }, 500);
        });
    }
}); 

// Initialize Dish Slider
function initDishSlider() {
    const dishSlider = document.getElementById('dish-slider');
    const sliderItems = dishSlider?.querySelectorAll('.slider-item');
    const prevBtn = dishSlider?.querySelector('.prev-btn');
    const nextBtn = dishSlider?.querySelector('.next-btn');
    
    if (!dishSlider || !sliderItems || sliderItems.length === 0) {
        console.log('Dish slider elements not found');
        return;
    }
    
    console.log('Initializing dish slider with', sliderItems.length, 'items');
    
    const sliderTrack = dishSlider.querySelector('.slider-track');
    const sliderDotsContainer = dishSlider.querySelector('.slider-dots');
    const itemsToShow = window.innerWidth < 768 ? 1 : (window.innerWidth < 1024 ? 2 : 3);
    let currentIndex = 0;
    
    // Create slider dots
    if (sliderDotsContainer) {
        sliderDotsContainer.innerHTML = '';
        for (let i = 0; i < Math.ceil(sliderItems.length / itemsToShow); i++) {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i * itemsToShow;
                if (currentIndex > sliderItems.length - itemsToShow) {
                    currentIndex = sliderItems.length - itemsToShow;
                }
                updateDishSlider();
                updateDots();
            });
            sliderDotsContainer.appendChild(dot);
        }
    }
    
    // Add hover effects to dish items
    sliderItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const content = this.querySelector('.slider-content');
            if (content) {
                content.style.boxShadow = '0 30px 60px rgba(0, 255, 157, 0.3)';
                content.style.transform = 'translateZ(50px) rotateX(-5deg)';
            }
            
            // Zoom image slightly
            const image = this.querySelector('img');
            if (image) {
                image.style.transform = 'scale(1.1) translateZ(30px)';
            }
            
            // Move info up slightly
            const info = this.querySelector('.slider-info');
            if (info) {
                info.style.transform = 'translateZ(50px) translateY(-10px)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const content = this.querySelector('.slider-content');
            if (content) {
                content.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                content.style.transform = '';
            }
            
            // Reset image zoom
            const image = this.querySelector('img');
            if (image) {
                image.style.transform = 'translateZ(10px)';
            }
            
            // Reset info position
            const info = this.querySelector('.slider-info');
            if (info) {
                info.style.transform = 'translateZ(30px)';
            }
        });
    });
    
    // Update the dots to reflect the current index
    function updateDots() {
        if (!sliderDotsContainer) return;
        const dots = sliderDotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
            const startIdx = idx * itemsToShow;
            if (currentIndex >= startIdx && currentIndex < startIdx + itemsToShow) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Navigation controls
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < sliderItems.length - itemsToShow) {
                currentIndex++;
                updateDishSlider();
                updateDots();
            } else {
                // Loop back to start with animation
                currentIndex = 0;
                updateDishSlider();
                updateDots();
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateDishSlider();
                updateDots();
            } else {
                // Loop to end with animation
                currentIndex = Math.max(0, sliderItems.length - itemsToShow);
                updateDishSlider();
                updateDots();
            }
        });
    }
    
    function updateDishSlider() {
        if (!sliderTrack) return;
        
        // Calculate item width based on current view
        const itemWidth = sliderItems[0]?.offsetWidth || 350;
        const gap = 20; // Gap between items
        
        const translateValue = currentIndex * (itemWidth + gap);
        sliderTrack.style.transform = `translateX(-${translateValue}px)`;
        
        // Update visual states for items
        sliderItems.forEach((item, idx) => {
            if (idx >= currentIndex && idx < currentIndex + itemsToShow) {
                item.classList.add('active');
                item.classList.remove('prev', 'next');
            } else if (idx < currentIndex) {
                item.classList.add('prev');
                item.classList.remove('active', 'next');
            } else {
                item.classList.add('next');
                item.classList.remove('active', 'prev');
            }
        });
    }
    
    // Initialize the slider
    updateDishSlider();
    
    // Auto-rotate every 5 seconds
    let autoSlideInterval = setInterval(() => {
        if (currentIndex < sliderItems.length - itemsToShow) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateDishSlider();
        updateDots();
    }, 5000);
    
    // Pause auto-rotation when hovering over slider
    dishSlider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    // Resume auto-rotation when mouse leaves
    dishSlider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            if (currentIndex < sliderItems.length - itemsToShow) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateDishSlider();
            updateDots();
        }, 5000);
    });
    
    // Touch events for mobile swiping
    let touchStartX = 0;
    let touchEndX = 0;
    
    dishSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    dishSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left, go next
            if (currentIndex < sliderItems.length - itemsToShow) {
                currentIndex++;
                updateDishSlider();
                updateDots();
            }
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right, go prev
            if (currentIndex > 0) {
                currentIndex--;
                updateDishSlider();
                updateDots();
            }
        }
    }
    
    // Adjust slider on window resize
    window.addEventListener('resize', () => {
        const newItemsToShow = window.innerWidth < 768 ? 1 : (window.innerWidth < 1024 ? 2 : 3);
        
        // Update slider positioning if display count changed
        if (newItemsToShow !== itemsToShow) {
            // Reset position
            currentIndex = 0;
            updateDishSlider();
            updateDots();
            
            // Recreate dots if needed
            if (sliderDotsContainer) {
                sliderDotsContainer.innerHTML = '';
                for (let i = 0; i < Math.ceil(sliderItems.length / newItemsToShow); i++) {
                    const dot = document.createElement('span');
                    dot.classList.add('slider-dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        currentIndex = i * newItemsToShow;
                        if (currentIndex > sliderItems.length - newItemsToShow) {
                            currentIndex = sliderItems.length - newItemsToShow;
                        }
                        updateDishSlider();
                        updateDots();
                    });
                    sliderDotsContainer.appendChild(dot);
                }
            }
        }
    });
}

// Call dish slider initialization on DOM content load
document.addEventListener('DOMContentLoaded', function() {
    initDishSlider();
    // ... existing code ...
}); 

// Initialize 3D Dessert Slider
document.addEventListener('DOMContentLoaded', function() {
    // Dessert data
    const desserts = [
        {
            title: "Chocolate Lava Cake",
            description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
            recipe: "Melt chocolate, fold in egg whites, bake until edges are set but center is soft",
            imgSrc: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            allergicIngredients: "Dairy (butter, cream), Wheat (flour), Eggs, Chocolate (potential allergen)"
        },
        {
            title: "Tiramisu",
            description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
            recipe: "Layer coffee-soaked ladyfingers with mascarpone mixture, dust with cocoa powder",
            imgSrc: "https://images.unsplash.com/photo-1551059429-99854e8cd219?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            allergicIngredients: "Dairy (mascarpone, cream), Eggs, Gluten (ladyfingers), Alcohol (if using)"
        },
        {
            title: "Crème Brûlée",
            description: "French vanilla custard with a caramelized sugar crust",
            recipe: "Infuse cream with vanilla, mix with egg yolks, bake in water bath, torch sugar topping",
            imgSrc: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            allergicIngredients: "Dairy (cream), Eggs"
        },
        {
            title: "Artisan Gelato",
            description: "Handcrafted Italian gelato in seasonal flavors",
            recipe: "Create custard base, fold in fresh ingredients, churn slowly for dense texture",
            imgSrc: "https://images.unsplash.com/photo-1551106652-a5e4a8c9c7e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            allergicIngredients: "Dairy (milk, cream), Eggs, Nuts (varies by flavor)"
        },
        {
            title: "New York Cheesecake",
            description: "Creamy cheesecake with graham cracker crust and berry compote",
            recipe: "Bake cream cheese mixture over graham cracker base, cool slowly to prevent cracks",
            imgSrc: "https://images.unsplash.com/photo-1514326005837-fb4791d25e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            allergicIngredients: "Dairy (cream cheese, sour cream), Eggs, Gluten (graham crackers)"
        },
        {
            title: "Raspberry Sorbet",
            description: "Refreshing dairy-free sorbet made with fresh raspberries",
            recipe: "Puree fresh raspberries with simple syrup, strain seeds, freeze while churning",
            imgSrc: "https://images.unsplash.com/photo-1488477304112-4944851de03d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            allergicIngredients: "None (naturally free from common allergens)"
        }
    ];

    // Get the slider container element
    const sliderContainer = document.getElementById('dessert-slider-container');
    const banner = document.getElementById('dessert-3d-slider');
    
    if (!sliderContainer || !banner) return;
    
    console.log("Initializing 3D dessert slider");
    
    // Set the initial background image
    banner.style.backgroundImage = `url(${desserts[0].imgSrc})`;
    
    // Generate slider items
    desserts.forEach((dessert, index) => {
        const sliderItem = document.createElement('div');
        sliderItem.className = `slider-item ${index === 0 ? 'active' : ''}`;
        sliderItem.style.transform = `rotateY(calc(${index} * (360 / ${desserts.length}) * 1deg)) translateZ(250px)`;
        sliderItem.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = dessert.imgSrc;
        img.alt = dessert.title;
        
        sliderItem.appendChild(img);
        sliderContainer.appendChild(sliderItem);
    });
    
    // Update description based on current index
    let currentIndex = 0;
    function updateDescription() {
        const dessert = desserts[currentIndex];
        
        document.getElementById('dessert-title').textContent = dessert.title;
        document.getElementById('dessert-description').textContent = dessert.description;
        document.getElementById('dessert-recipe').textContent = dessert.recipe;
        document.getElementById('dessert-allergens').textContent = dessert.allergicIngredients;
        
        // Update background image
        banner.style.backgroundImage = `url(${dessert.imgSrc})`;
        
        // Update active class
        const items = sliderContainer.querySelectorAll('.slider-item');
        items.forEach(item => item.classList.remove('active'));
        items[currentIndex].classList.add('active');
    }
    
    // Initialize slider interaction
    let isDragging = false;
    let startX = 0;
    let currentRotation = 0;
    
    sliderContainer.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        sliderContainer.style.animation = 'none';
    });
    
    window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const rotation = currentRotation + deltaX / 5;
        sliderContainer.style.transform = `perspective(800px) rotateX(-5deg) rotateY(${rotation}deg)`;
        
        // Calculate new index based on rotation
        const newIndex = Math.round((rotation % 360) / (360 / desserts.length)) % desserts.length;
        const normalizedIndex = newIndex >= 0 ? newIndex : desserts.length + newIndex;
        
        if (normalizedIndex !== currentIndex) {
            currentIndex = normalizedIndex;
            updateDescription();
        }
    });
    
    window.addEventListener('mouseup', function() {
        if (!isDragging) return;
        
        isDragging = false;
        const transform = sliderContainer.style.transform;
        const match = transform.match(/rotateY\((-?\d+\.?\d*)deg\)/);
        
        if (match) {
            currentRotation = parseFloat(match[1]);
        }
        
        sliderContainer.style.animation = 'autoRun 20s linear infinite';
    });
    
    // Pause animation on hover
    sliderContainer.addEventListener('mouseenter', function() {
        sliderContainer.style.animationPlayState = 'paused';
    });
    
    sliderContainer.addEventListener('mouseleave', function() {
        sliderContainer.style.animationPlayState = 'running';
    });
    
    // Track animation to update description
    function updateDescriptionOnAnimation() {
        if (isDragging) {
            requestAnimationFrame(updateDescriptionOnAnimation);
            return;
        }
        
        const computedStyle = window.getComputedStyle(sliderContainer);
        const transform = computedStyle.transform;
        
        if (transform !== 'none' && transform.includes('matrix')) {
            try {
                // Extract rotation angle from transform matrix
                const values = transform.split('(')[1].split(')')[0].split(',');
                const a = parseFloat(values[0]);
                const b = parseFloat(values[1]);
                let angle = Math.atan2(b, a) * (180 / Math.PI);
                
                // Normalize angle for our calculations
                angle = (angle < 0) ? 360 + angle : angle;
                
                // Calculate new index based on rotation
                const normalizedAngle = angle % 360;
                const newIndex = Math.round(normalizedAngle / (360 / desserts.length)) % desserts.length;
                const normalizedIndex = newIndex >= 0 ? newIndex : desserts.length + newIndex;
                
                if (normalizedIndex !== currentIndex) {
                    currentIndex = normalizedIndex;
                    updateDescription();
                }
            } catch (e) {
                console.error("Error parsing transform matrix:", e);
            }
        }
        
        requestAnimationFrame(updateDescriptionOnAnimation);
    }
    
    // Start tracking animation
    updateDescriptionOnAnimation();
    
    // Add swipe support for mobile
    let touchStartX = 0;
    
    sliderContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        sliderContainer.style.animation = 'none';
    });
    
    sliderContainer.addEventListener('touchmove', function(e) {
        const touchX = e.touches[0].clientX;
        const deltaX = touchX - touchStartX;
        
        const rotation = currentRotation + deltaX / 5;
        sliderContainer.style.transform = `perspective(800px) rotateX(-5deg) rotateY(${rotation}deg)`;
    });
    
    sliderContainer.addEventListener('touchend', function() {
        sliderContainer.style.animation = 'autoRun 20s linear infinite';
    });
}); 

// Ensure dish slider initializes properly
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing all components');
    
    // Initialize the dish slider
    initDishSlider();
    
    // Initialize other components
    // ... existing code ...
}); 