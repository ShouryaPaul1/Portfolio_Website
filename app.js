// Animation and interaction system for portfolio website
class PortfolioAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Initialize after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.setupScrollAnimations();
        this.setupNavbarShrink();
        this.setupParallaxEffects();
        this.setupHoverEffects();
        this.splitHeroText();
        this.handleReducedMotion();
    }

    // Intersection Observer for scroll-triggered animations
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-anim]');
        
        if (!animatedElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add stagger delay based on position in group
                    const delay = entry.target.dataset.delay || index * 100;
                    entry.target.style.setProperty('--delay', `${delay}ms`);
                    
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    
                    // Only trigger once
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });

        // Observe all animated elements
        animatedElements.forEach((el, index) => {
            el.style.setProperty('--i', index);
            observer.observe(el);
        });
    }

    // Navbar shrink effect on scroll
    setupNavbarShrink() {
        const navbar = document.querySelector('.main-nav');
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNavbar = () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }

            lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }, { passive: true });
    }

    // Parallax effects for background elements
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (!parallaxElements.length) return;

        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // Enhanced hover effects
    setupHoverEffects() {
        // Floating profile image
        const profileImage = document.querySelector('.profile-photo');
        if (profileImage) {
            profileImage.classList.add('floating');
        }

        // Work cards tilt effect
        const workCards = document.querySelectorAll('.work-card');
        workCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover);
            card.addEventListener('mouseleave', this.handleCardLeave);
            card.addEventListener('mousemove', this.handleCardMove);
        });

        // Button effects
        const buttons = document.querySelectorAll('.btn-primary, .card-link');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', this.handleButtonHover);
            btn.addEventListener('mouseleave', this.handleButtonLeave);
        });
    }

    // Card hover effects with 3D tilt
    handleCardHover = (e) => {
        e.currentTarget.classList.add('card-hovered');
    }

    handleCardLeave = (e) => {
        e.currentTarget.classList.remove('card-hovered');
        e.currentTarget.style.transform = '';
    }

    handleCardMove = (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    // Button hover effects
    handleButtonHover = (e) => {
        e.currentTarget.classList.add('btn-hovered');
    }

    handleButtonLeave = (e) => {
        e.currentTarget.classList.remove('btn-hovered');
    }

    // Split hero text for line-by-line animation
    splitHeroText() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroIntro = document.querySelector('.hero-intro');

        [heroTitle, heroSubtitle, heroIntro].forEach(el => {
            if (el) {
                this.wrapTextLines(el);
            }
        });
    }

    wrapTextLines(element) {
        const text = element.innerHTML;
        const words = text.split(' ');
        const wrappedWords = words.map((word, index) => 
            `<span class="word" style="--word-delay: ${index * 50}ms">${word}</span>`
        ).join(' ');
        
        element.innerHTML = wrappedWords;
        element.classList.add('split-text');
    }

    // Handle reduced motion preferences
    handleReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Add reduced-motion class to body
            document.body.classList.add('reduced-motion');
            
            // Show all animated elements immediately
            const animatedElements = document.querySelectorAll('[data-anim]');
            animatedElements.forEach(el => {
                el.classList.add('is-visible');
            });
        }
    }
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Initialize animations
new PortfolioAnimations();

// Form handling for contact page
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Floating label effects
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Sending...';
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        submitBtn.textContent = 'Message Sent!';
        
        // Reset after 3 seconds
        setTimeout(() => {
            submitBtn.classList.remove('success');
            submitBtn.textContent = originalText;
            e.target.reset();
        }, 3000);
    }, 2000);
}