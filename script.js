// Global consistency function - ensures all pages follow same behavior
function initializeGlobalConsistency() {
    console.log('Initializing global consistency framework');
    
    // Set appropriate active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Ensure header is fixed across all pages
    const header = document.querySelector('header');
    if (header) {
        // Apply critical styling to header
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.left = '0';
        header.style.right = '0';
        header.style.width = '100%';
        header.style.zIndex = '9999';
        
        // Add appropriate padding to body based on header height
        const headerHeight = header.offsetHeight;
        document.body.style.paddingTop = headerHeight + 'px';
        
        // Listen for scroll to add scrolled class
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Check initial scroll position
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
    }
    
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && 
                !mobileMenuToggle.contains(e.target) && 
                navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
            }
        });
        
        // Close menu on window resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992 && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
            }
        });
    }
    
    // Apply saved site mode
    const savedMode = localStorage.getItem('siteMode');
    if (savedMode === 'restaurant') {
        applyRestaurantMode();
    } else {
        applyCafeMode();
    }
    
    // Mode toggle functionality
    const modeToggle = document.getElementById('mode-toggle');
    if (modeToggle) {
        // Set toggle based on saved mode
        modeToggle.checked = savedMode === 'restaurant';
        
        // Add change event listener
        modeToggle.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem('siteMode', 'restaurant');
                applyRestaurantMode();
            } else {
                localStorage.setItem('siteMode', 'cafe');
                applyCafeMode();
            }
        });
    }
}

// Run global consistency on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeGlobalConsistency);

// Also run on load to catch any late-loading elements
window.addEventListener('load', initializeGlobalConsistency);

// Immediate self-executing function to fix header issues
(function() {
    console.log("Immediate header fix running");
    
    function fixHeader() {
        var header = document.querySelector('header');
        if (!header) return;
        
        // Apply critical inline styles with !important flags
        header.style.cssText = 
            "position: fixed !important;" + 
            "top: 0 !important;" + 
            "left: 0 !important;" + 
            "right: 0 !important;" + 
            "width: 100% !important;" + 
            "max-width: 100vw !important;" +
            "z-index: 9999 !important;" +
            "box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important";
        
        // Calculate header height
        var headerHeight = header.offsetHeight || 80;
        console.log("Header height detected:", headerHeight);
        
        // Add body padding
        document.body.style.paddingTop = headerHeight + "px";
        console.log("Body padding set to:", headerHeight + "px");
        
        // Apply scrolled class if needed
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Identify hero sections that need adjustment
        const heroSections = [
            document.querySelector('#menu-hero'),
            document.querySelector('#hero'),
            document.querySelector('.hero-content'),
            document.querySelector('section:first-of-type')
        ];
        
        // Apply correct spacing to hero sections if they exist
        heroSections.forEach(section => {
            if (section) {
                // Remove any direct margin-top that would push content down too much
                section.style.marginTop = '0';
                
                // Check if the section already has adequate spacing
                const sectionStyles = getComputedStyle(section);
                const currentPadding = parseInt(sectionStyles.paddingTop);
                if (currentPadding < 80) { // Ensure a minimum padding
                    section.style.paddingTop = '80px';
                }
            }
        });
    }
    
    // Run immediately
    if (document.readyState === 'loading') {
        // If document still loading, set up event listeners
        document.addEventListener('DOMContentLoaded', fixHeader);
        window.addEventListener('load', fixHeader);
    } else {
        // Document already loaded, run now
        fixHeader();
    }
    
    // Run after short delay to catch any races
    setTimeout(fixHeader, 50);
    setTimeout(fixHeader, 200);
    setTimeout(fixHeader, 500);
    
    // Also fix header on resize
    window.addEventListener('resize', fixHeader);
    
    // Add scroll handler to apply scrolled class for visual changes
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Periodically reapply the header fix on scroll
            if (window.scrollY % 100 === 0) {
                fixHeader();
            }
        }
    });
    
    // Apply header fix on any DOM mutation (for dynamic content)
    if ('MutationObserver' in window) {
        const observer = new MutationObserver(function(mutations) {
            fixHeader();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();

// Mode Switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');
    const brandLogo = document.getElementById('brand-logo');
    
    // Initialize mode based on localStorage
    function initializeMode() {
        const savedMode = localStorage.getItem('siteMode') || 'cafe';
        if (savedMode === 'restaurant') {
            applyRestaurantMode(false);
            if (modeToggle) modeToggle.checked = true;
        } else {
            applyCafeMode(false);
            if (modeToggle) modeToggle.checked = false;
        }
    }

    function applyRestaurantMode(animate = true) {
        if (animate) animateModeSwitching();
        
        body.classList.remove('cafe-mode');
        body.classList.add('restaurant-mode');
        if (brandLogo) brandLogo.textContent = 'Restaurant Elegance';

        // Update content visibility
        toggleContent('cafe', false);
        toggleContent('restaurant', true);
        
        // Update theme colors
        updateThemeColors('restaurant');
        
        // Save preference
        localStorage.setItem('siteMode', 'restaurant');
    }

    function applyCafeMode(animate = true) {
        if (animate) animateModeSwitching();
        
        body.classList.remove('restaurant-mode');
        body.classList.add('cafe-mode');
        if (brandLogo) brandLogo.textContent = 'Café Delight';

        // Update content visibility
        toggleContent('restaurant', false);
        toggleContent('cafe', true);
        
        // Update theme colors
        updateThemeColors('cafe');
        
        // Save preference
        localStorage.setItem('siteMode', 'cafe');
    }

    function toggleContent(mode, show) {
        const elements = {
            video: document.querySelector(`.${mode}-video`),
            heroContent: document.getElementById(`${mode}-hero-content`),
            features: document.querySelector(`.${mode}-features`),
            gallery: document.querySelector(`.${mode}-gallery`),
            menu: document.getElementById(`${mode}-menu`),
            hours: document.getElementById(`${mode}-hours`),
            headings: document.querySelectorAll(`.${mode}-heading`),
            descriptions: document.querySelectorAll(`.${mode}-description`)
        };

        const display = show ? 'block' : 'none';
        
        for (let key in elements) {
            const element = elements[key];
            if (!element) continue;
            
            if (NodeList.prototype.isPrototypeOf(element)) {
                element.forEach(el => el.style.display = display);
            } else {
                if (key === 'features' || key === 'gallery') {
                    element.style.display = show ? 'flex' : 'none';
                } else {
                    element.style.display = display;
                }
            }
        }
    }

    function updateThemeColors(mode) {
        const colors = {
            cafe: {
                primary: 'var(--cafe-primary)',
                dark: 'var(--cafe-dark)',
                accent: 'var(--cafe-accent)',
                bg: 'var(--cafe-bg)'
            },
            restaurant: {
                primary: 'var(--restaurant-primary)',
                dark: 'var(--restaurant-dark)',
                accent: 'var(--restaurant-accent)',
                bg: 'var(--restaurant-bg)'
            }
        };

        const selected = colors[mode];
        document.documentElement.style.setProperty('--primary-color', selected.primary);
        document.documentElement.style.setProperty('--primary-dark', selected.dark);
        document.documentElement.style.setProperty('--accent-color', selected.accent);
        document.documentElement.style.setProperty('--dark-bg', selected.bg);
    }

    function animateModeSwitching() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Trigger fade in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            
            // Fade out and remove
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            }, 300);
        });
    }

    // Initialize mode
    initializeMode();

    // Add event listener for mode toggle
    if (modeToggle) {
        modeToggle.addEventListener('change', function() {
            if (this.checked) {
                applyRestaurantMode();
            } else {
                applyCafeMode();
            }
        });
    }
});

// Seasonal Menu Carousel
document.addEventListener('DOMContentLoaded', function() {
    // Seasonal Menu Functionality
    const seasonBtns = document.querySelectorAll('.season-btn');
    const seasonalCards = document.querySelectorAll('.seasonal-card');
    const seasonalSlider = document.querySelector('.seasonal-slider');
    const prevBtn = document.querySelector('.seasonal-nav .prev');
    const nextBtn = document.querySelector('.seasonal-nav .next');

    seasonBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const season = btn.dataset.season;
            // Update active button
            seasonBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show relevant cards with animation
            seasonalCards.forEach(card => {
                if (card.dataset.season === season) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Slider Navigation
    let scrollAmount = 0;
    const cardWidth = 320; // card width + gap

    prevBtn.addEventListener('click', () => {
        scrollAmount = Math.max(scrollAmount - cardWidth, 0);
        seasonalSlider.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        scrollAmount = Math.min(scrollAmount + cardWidth, seasonalSlider.scrollWidth - seasonalSlider.clientWidth);
        seasonalSlider.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Promotional Banner Slider
    const bannerSlider = document.querySelector('.banner-slider');
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideCount = slides.length;

    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Auto-advance slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlides();
    }, 5000);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlides();
        });
    });

    // Arrow navigation for banner slider
    document.querySelector('.banner-slider-container .prev-arrow').addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlides();
    });

    document.querySelector('.banner-slider-container .next-arrow').addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlides();
    });

    // Add smooth hover effects
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px)';
            item.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        });
    });

    // Initialize Animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.menu-category-section, .featured-slider-section, .seasonal-carousel');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Add initial styles for animation
    document.querySelectorAll('.menu-category-section, .featured-slider-section, .seasonal-carousel').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
    });

    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    // Initial check for elements in view
    animateOnScroll();
});

// Slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.food-slider');
    
    sliders.forEach(slider => {
        const container = slider.closest('.slider-container');
        const prevBtn = container.querySelector('.prev-arrow');
        const nextBtn = container.querySelector('.next-arrow');
        
        let scrollAmount = 0;
        const slideWidth = 320; // Width of slide + gap
        
        prevBtn.addEventListener('click', () => {
            scrollAmount = Math.max(scrollAmount - slideWidth, 0);
            slider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', () => {
            scrollAmount = Math.min(scrollAmount + slideWidth, slider.scrollWidth - slider.clientWidth);
            slider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    });

    // Mode switcher functionality
    const modeToggle = document.getElementById('mode-toggle');
    const body = document.body;
    const brandLogo = document.getElementById('brand-logo');
    
    modeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.remove('cafe-mode');
            body.classList.add('restaurant-mode');
            brandLogo.textContent = 'Restaurant Delight';
            document.querySelector('.cafe-heading').style.display = 'none';
            document.querySelector('.restaurant-heading').style.display = 'block';
            document.querySelector('.cafe-description').style.display = 'none';
            document.querySelector('.restaurant-description').style.display = 'block';
        } else {
            body.classList.remove('restaurant-mode');
            body.classList.add('cafe-mode');
            brandLogo.textContent = 'Café Delight';
            document.querySelector('.cafe-heading').style.display = 'block';
            document.querySelector('.restaurant-heading').style.display = 'none';
            document.querySelector('.cafe-description').style.display = 'block';
            document.querySelector('.restaurant-description').style.display = 'none';
        }
    });

    // Promotional banner slider
    const bannerSlider = document.querySelector('.banner-slider');
    const bannerSlides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 5000; // Change slide every 5 seconds

    function updateSlide(index) {
        bannerSlides.forEach((slide, i) => {
            slide.style.transform = `translateX(${100 * (i - index)}%)`;
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Initialize first slide
    updateSlide(0);

    // Auto advance slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % bannerSlides.length;
        updateSlide(currentSlide);
    }, slideInterval);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlide(currentSlide);
        });
    });
});

// Mode Switching Functionality 
function initializeModeSwitcher() {
    const menuModeContainer = document.querySelector('.menu-experience-switcher');
    const toggleSlider = document.querySelector('.toggle-slider');
    const menuSections = {
        cafe: document.querySelector('.cafe-menu'),
        restaurant: document.querySelector('.restaurant-menu')
    };
    
    function switchMode(mode) {
        const body = document.body;
        const overlay = document.querySelector('.menu-transition-overlay');
        
        // Add transition overlay with enhanced blur
        overlay.style.backdropFilter = 'blur(12px)';
        overlay.classList.add('menu-transition-active');
        
        // Save mode preference
        localStorage.setItem('menuMode', mode);
        
        // Prepare content transition
        Object.keys(menuSections).forEach(key => {
            if (menuSections[key]) {
                menuSections[key].style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                if (key !== mode) {
                    menuSections[key].style.opacity = '0';
                    menuSections[key].style.transform = 'translateY(20px)';
                }
            }
        });
        
        setTimeout(() => {
            // Update body classes
            body.classList.remove('body-cafe', 'body-restaurant');
            body.classList.add(`body-${mode}`);
            
            // Update active state on mode options with smooth transition
            document.querySelectorAll('.mode-option').forEach(option => {
                option.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                option.classList.toggle('active', option.dataset.mode === mode);
            });
            
            // Animate toggle slider
            toggleSlider.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            toggleSlider.querySelector('i').className = mode === 'cafe' ? 'fas fa-coffee' : 'fas fa-utensils';
            
            // Update menu sections visibility with smooth transition
            Object.keys(menuSections).forEach(key => {
                if (menuSections[key]) {
                    menuSections[key].style.display = key === mode ? 'block' : 'none';
                    if (key === mode) {
                        // Trigger reflow for animation
                        void menuSections[key].offsetWidth;
                        menuSections[key].style.opacity = '1';
                        menuSections[key].style.transform = 'translateY(0)';
                    }
                }
            });
            
            // Update section titles with fade effect
            const sectionTitle = document.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.style.transition = 'opacity 0.3s ease';
                sectionTitle.style.opacity = '0';
                setTimeout(() => {
                    sectionTitle.textContent = mode === 'cafe' ? 'Café Menu' : 'Restaurant Menu';
                    sectionTitle.style.opacity = '1';
                }, 300);
            }
            
            // Initialize appropriate sliders after transition
            setTimeout(() => {
                overlay.classList.remove('menu-transition-active');
                if (mode === 'restaurant') {
                    initializeRestaurantSliders();
                } else {
                    initializeCafeSliders();
                }
            }, 500);
        }, 300);
    }
    
    // Add click handlers to mode options
    document.querySelectorAll('.mode-option').forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.dataset.mode;
            if (!option.classList.contains('active')) {
                switchMode(mode);
            }
        });
    });
    
    // Initialize with saved mode or default to cafe
    const savedMode = localStorage.getItem('menuMode') || 'cafe';
    switchMode(savedMode);
}

// Initialize cafe sliders
function initializeCafeSliders() {
    const sliders = document.querySelectorAll('.cafe-menu .menu-slider');
    initializeSliders(sliders);
}

// Initialize restaurant sliders
function initializeRestaurantSliders() {
    const sliders = document.querySelectorAll('.restaurant-menu .menu-slider');
    initializeSliders(sliders);
}

// Generic slider initialization
function initializeSliders(sliders) {
    sliders.forEach(slider => {
        const container = slider.querySelector('.slider-container');
        const items = slider.querySelectorAll('.slider-item');
        if (!container || !items.length) return;
        
        // Reset any existing transforms
        container.style.transform = 'translateX(0)';
        
        // Update item widths based on viewport
        updateSliderLayout(slider);
    });
}

// Update slider layout on viewport changes
function updateSliderLayout(slider) {
    const items = slider.querySelectorAll('.slider-item');
    const visibleItems = calculateVisibleItems();
    const itemWidth = 100 / visibleItems;
    
    items.forEach(item => {
        item.style.width = `${itemWidth}%`;
    });
}

// Calculate visible items based on viewport
function calculateVisibleItems() {
    if (window.innerWidth < 576) return 1;
    if (window.innerWidth < 768) return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', initializeModeSwitcher);

// Mode Switching Initialization
function initializeModeSwitching() {
    const body = document.body;
    const menuModeContainer = document.querySelector('.menu-experience-switcher');
    const toggleSlider = document.querySelector('.toggle-slider');
    const menuSections = {
        cafe: document.querySelector('.cafe-menu'),
        restaurant: document.querySelector('.restaurant-menu')
    };
    
    function switchMode(mode) {
        const overlay = document.querySelector('.menu-transition-overlay');
        
        // Add transition overlay
        overlay.classList.add('menu-transition-active');
        
        // Save mode preference
        localStorage.setItem('menuMode', mode);
        
        setTimeout(() => {
            // Update body classes
            body.classList.remove('body-cafe', 'body-restaurant');
            body.classList.add(`body-${mode}`);
            
            // Update active state on mode options
            document.querySelectorAll('.mode-option').forEach(option => {
                option.classList.toggle('active', option.dataset.mode === mode);
            });
            
            // Update toggle slider icon
            toggleSlider.querySelector('i').className = mode === 'cafe' ? 'fas fa-coffee' : 'fas fa-utensils';
            
            // Update menu sections visibility
            Object.keys(menuSections).forEach(key => {
                if (menuSections[key]) {
                    menuSections[key].style.display = key === mode ? 'block' : 'none';
                    menuSections[key].style.opacity = key === mode ? '1' : '0';
                    menuSections[key].style.transform = key === mode ? 'translateY(0)' : 'translateY(20px)';
                }
            });
            
            // Update section titles
            const sectionTitle = document.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.textContent = mode === 'cafe' ? 'Café Menu' : 'Restaurant Menu';
            }
            
            // Remove transition overlay
            setTimeout(() => {
                overlay.classList.remove('menu-transition-active');
                
                // Reinitialize appropriate sliders after mode switch
                if (mode === 'restaurant') {
                    if (typeof initializeRestaurantSliders === 'function') {
                        initializeRestaurantSliders();
                    }
                } else {
                    if (typeof initializeSliders === 'function') {
                        initializeSliders();
                    }
                }
            }, 500);
        }, 300);
    }
    
    // Add click handlers to mode options
    document.querySelectorAll('.mode-option').forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.dataset.mode;
            switchMode(mode);
        });
    });
    
    // Initialize with saved mode or default to cafe
    const savedMode = localStorage.getItem('menuMode') || 'cafe';
    switchMode(savedMode);
}

// Initialize mode switching when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeModeSwitching);