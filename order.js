// Order Page JavaScript

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    initSeasonalCarousel();
    initBannerSlider();
    initOrderTabs();
    initCartFunctionality();
    initPaymentSection();
    initQuiz();
    
    // Function to show alert messages
    window.showAlert = function(message) {
        const alertMessage = document.getElementById('alertMessage');
        if (alertMessage) {
            alertMessage.textContent = message;
            alertMessage.style.transform = 'translateX(0)';
            
            setTimeout(() => {
                alertMessage.style.transform = 'translateX(120%)';
            }, 3000);
        }
    };
});

// Seasonal Carousel Functionality
function initSeasonalCarousel() {
    const seasonBtns = document.querySelectorAll('.season-btn');
    const seasonalCards = document.querySelectorAll('.seasonal-card');
    
    if (seasonBtns.length === 0 || seasonalCards.length === 0) return;
    
    seasonBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            seasonBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the season data attribute
            const season = this.getAttribute('data-season');
            
            // Hide all cards
            seasonalCards.forEach(card => {
                card.style.display = 'none';
            });
            
            // Show cards for the selected season
            document.querySelectorAll(`.seasonal-card[data-season="${season}"]`).forEach(card => {
                card.style.display = 'block';
            });
        });
    });
}

// Banner Slider Functionality
function initBannerSlider() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current slide
        slides[index].style.display = 'block';
        
        // Add active class to current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        // Update current slide index
        currentSlide = index;
    }
    
    // Show the first slide initially
    showSlide(0);
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
        });
    });
    
    // Add click event to prev button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            let newIndex = currentSlide - 1;
            if (newIndex < 0) {
                newIndex = slides.length - 1;
            }
            showSlide(newIndex);
        });
    }
    
    // Add click event to next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            let newIndex = currentSlide + 1;
            if (newIndex >= slides.length) {
                newIndex = 0;
            }
            showSlide(newIndex);
        });
    }
    
    // Auto slide every 5 seconds
    setInterval(function() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) {
            newIndex = 0;
        }
        showSlide(newIndex);
    }, 5000);
}

// Order Tabs Functionality
function initOrderTabs() {
    const orderTabs = document.querySelectorAll('.order-tab');
    const orderContents = document.querySelectorAll('.order-content');
    
    if (orderTabs.length === 0 || orderContents.length === 0) return;
    
    orderTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            orderTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the tab data attribute
            const tabId = this.getAttribute('data-tab');
            
            // Hide all content
            orderContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show content for the selected tab
            document.getElementById(tabId).style.display = 'block';
        });
    });
}

// Cart Functionality
function initCartFunctionality() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');
    
    if (addToCartBtns.length === 0) return;
    
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count display
    function updateCartCount() {
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }
    
    // Initial cart count update
    updateCartCount();
    
    // Add click event to add to cart buttons
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get item details
            const itemCard = this.closest('.item-card');
            if (!itemCard) return;
            
            const itemId = itemCard.getAttribute('data-id');
            const itemName = itemCard.querySelector('h4').textContent;
            const itemPrice = itemCard.querySelector('.item-price').textContent;
            const itemImage = itemCard.querySelector('img').src;
            
            // Get quantity
            const qtyInput = itemCard.querySelector('.qty-input');
            const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
            
            // Create item object
            const item = {
                id: itemId,
                name: itemName,
                price: itemPrice,
                image: itemImage,
                quantity: quantity
            };
            
            // Add item to cart
            cart.push(item);
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Show success message
            showAlert(`${itemName} added to cart!`);
        });
    });
    
    // Quantity buttons functionality
    const qtyPlusBtns = document.querySelectorAll('.qty-plus');
    const qtyMinusBtns = document.querySelectorAll('.qty-minus');
    
    qtyPlusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.qty-input');
            let value = parseInt(input.value);
            input.value = value + 1;
        });
    });
    
    qtyMinusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.qty-input');
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
            }
        });
    });
}

// Payment Section Functionality
function initPaymentSection() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentForms = document.querySelectorAll('.payment-form');
    
    if (paymentMethods.length === 0 || paymentForms.length === 0) return;
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked method
            this.classList.add('active');
            
            // Get the payment method
            const paymentMethod = this.getAttribute('data-method');
            
            // Hide all forms
            paymentForms.forEach(form => {
                form.style.display = 'none';
            });
            
            // Show form for the selected method
            document.getElementById(`${paymentMethod}-form`).style.display = 'block';
        });
    });
}

// Quiz Functionality
function initQuiz() {
    const startQuizBtn = document.querySelector('.start-quiz-btn');
    const quizIntro = document.getElementById('quiz-intro');
    const quizQuestions = document.getElementById('quiz-questions');
    const quizResult = document.getElementById('quiz-result');
    const questionSlides = document.querySelectorAll('.question-slide');
    const nextBtns = document.querySelectorAll('.next-question');
    const prevBtns = document.querySelectorAll('.prev-question');
    const getRecommendationBtn = document.querySelector('.get-recommendation');
    const answerOptions = document.querySelectorAll('.answer-option');
    const resultLoading = document.querySelector('.result-loading');
    const resultContent = document.querySelector('.result-content');
    const retakeQuizBtn = document.querySelector('.retake-quiz-btn');
    
    if (!startQuizBtn || !quizIntro || !quizQuestions || !quizResult) return;
    
    // Quiz answers storage
    let quizAnswers = {
        flavor: '',
        hunger: '',
        mood: ''
    };
    
    // Start quiz
    startQuizBtn.addEventListener('click', function() {
        quizIntro.classList.remove('active');
        quizQuestions.classList.add('active');
    });
    
    // Handle answer selection
    answerOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Get the question slide
            const questionSlide = this.closest('.question-slide');
            
            // Remove selected class from all options in this question
            questionSlide.querySelectorAll('.answer-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Store the answer
            const questionId = questionSlide.id;
            const answerValue = this.getAttribute('data-value');
            
            if (questionId === 'question-1') {
                quizAnswers.flavor = answerValue;
            } else if (questionId === 'question-2') {
                quizAnswers.hunger = answerValue;
            } else if (questionId === 'question-3') {
                quizAnswers.mood = answerValue;
            }
        });
    });
    
    // Navigate to next question
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const currentSlide = this.closest('.question-slide');
            const nextSlide = currentSlide.nextElementSibling;
            
            if (nextSlide) {
                currentSlide.style.display = 'none';
                nextSlide.style.display = 'block';
            }
        });
    });
    
    // Navigate to previous question
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const currentSlide = this.closest('.question-slide');
            const prevSlide = currentSlide.previousElementSibling;
            
            if (prevSlide) {
                currentSlide.style.display = 'none';
                prevSlide.style.display = 'block';
            }
        });
    });
    
    // Get recommendation
    if (getRecommendationBtn) {
        getRecommendationBtn.addEventListener('click', function() {
            // Show quiz result section
            quizQuestions.classList.remove('active');
            quizResult.classList.add('active');
            
            // Show loading animation
            resultLoading.style.display = 'block';
            resultContent.style.display = 'none';
            
            // Simulate loading time (3 seconds)
            setTimeout(function() {
                // Hide loading animation
                resultLoading.style.display = 'none';
                resultContent.style.display = 'block';
                
                // Generate recommendation based on answers
                const recommendation = getRecommendationBasedOnAnswers(quizAnswers);
                
                // Update recommendation details
                document.getElementById('recommendation-img').src = recommendation.image;
                document.getElementById('recommendation-name').textContent = recommendation.name;
                document.getElementById('recommendation-desc').textContent = recommendation.description;
                document.getElementById('recommendation-price').textContent = recommendation.price;
                document.getElementById('recommendation-calories').textContent = recommendation.calories;
            }, 3000);
        });
    }
    
    // Retake quiz
    if (retakeQuizBtn) {
        retakeQuizBtn.addEventListener('click', function() {
            // Reset quiz answers
            quizAnswers = {
                flavor: '',
                hunger: '',
                mood: ''
            };
            
            // Reset selected options
            answerOptions.forEach(option => {
                option.classList.remove('selected');
            });
            
            // Reset question slides
            questionSlides.forEach((slide, index) => {
                slide.style.display = index === 0 ? 'block' : 'none';
            });
            
            // Show intro section
            quizResult.classList.remove('active');
            quizIntro.classList.add('active');
        });
    }
    
    // Function to get recommendation based on answers
    function getRecommendationBasedOnAnswers(answers) {
        // Sample recommendations based on combinations
        const recommendations = {
            'spicy-large-adventurous': {
                name: 'Fiery Dragon Bowl',
                description: 'A bold and spicy rice bowl with grilled chicken, vegetables, and our signature hot sauce.',
                image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                price: '₹450',
                calories: '650 cal'
            },
            'sweet-medium-comfort': {
                name: 'Chocolate Lava Cake',
                description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.',
                image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                price: '₹350',
                calories: '450 cal'
            },
            'fresh-small-health': {
                name: 'Mediterranean Salad',
                description: 'Fresh greens, feta cheese, olives, and grilled vegetables with a light vinaigrette.',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                price: '₹320',
                calories: '280 cal'
            },
            'savory-feast-indulgent': {
                name: 'Truffle Mushroom Risotto',
                description: 'Creamy Arborio rice with wild mushrooms, truffle oil, and Parmesan cheese.',
                image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                price: '₹550',
                calories: '720 cal'
            }
        };
        
        // Default recommendation
        const defaultRecommendation = {
            name: 'Chef\'s Special',
            description: 'Our chef\'s daily special, crafted with the finest seasonal ingredients.',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: '₹480',
            calories: '550 cal'
        };
        
        // Try to find a matching recommendation
        const key = `${answers.flavor}-${answers.hunger}-${answers.mood}`;
        
        // Return matching recommendation or default
        return recommendations[key] || defaultRecommendation;
    }
}