// script.js

document.addEventListener('DOMContentLoaded', () => {

    // Intersection Observer Configuration
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Generic Scroll Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Special handling for counters
                if (entry.target.querySelector('.counter')) {
                    animateCounters(entry.target);
                }

                // Unobserve after animation
                if (!entry.target.classList.contains('counter-container')) {
                    revealObserver.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Elements to observe
    const revealElements = document.querySelectorAll(
        '.scroll-reveal, .scroll-reveal-text, .scroll-reveal-left, .scroll-reveal-right, ' +
        '.scroll-reveal-up, .scroll-reveal-scale, .service-card, .feature-item, .stat-item, ' +
        '.form-field'
    );

    revealElements.forEach(el => revealObserver.observe(el));

    // Counter Animation Function
    function animateCounters(container) {
        const counters = container.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };

            updateCounter();
        });
    }

    // Parallax Effect for Hero Background
    let ticking = false;
    const parallaxBg = document.querySelector('.parallax-bg');

    function updateParallax() {
        if (parallaxBg) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            parallaxBg.style.transform = `translateY(${rate}px)`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('shadow-lg');
            if (currentScroll > lastScroll && currentScroll > 200) {
                // Scrolling down - hide navbar partially
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeMenuBtn && mobileMenu) {
        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
            document.body.style.overflow = '';
        });
    }

    // Close mobile menu when clicking links
    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
            document.body.style.overflow = '';
        });
    });

    // Service Card Interactions
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.fontVariationSettings = "'FILL' 1, 'wght' 400";
            }
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.fontVariationSettings = "'FILL' 0, 'wght' 300";
            }
        });
    });

    // Form Handling
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Add loading state
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="relative z-10">Processing...</span>';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<span class="relative z-10">Request Sent!</span>';
                submitBtn.classList.remove('bg-secondary');
                submitBtn.classList.add('bg-tertiary');

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.add('bg-secondary');
                    submitBtn.classList.remove('bg-tertiary');
                    quoteForm.reset();
                }, 2000);
            }, 1500);
        });
    }

    // Map Marker Interactions
    const mapMarkers = document.querySelectorAll('.map-marker');
    mapMarkers.forEach(marker => {
        marker.addEventListener('mouseenter', () => {
            const label = marker.querySelector('div:last-child');
            if (label) {
                label.style.opacity = '1';
                label.style.transform = 'translateX(-50%) translateY(0)';
            }
        });

        marker.addEventListener('mouseleave', () => {
            const label = marker.querySelector('div:last-child');
            if (label) {
                label.style.opacity = '0';
                label.style.transform = 'translateX(-50%) translateY(8px)';
            }
        });
    });

    // Emergency Button Pulse Effect on Click
    const emergencyBtns = document.querySelectorAll('button');
    emergencyBtns.forEach(btn => {
        if (btn.textContent.toLowerCase().includes('emergency')) {
            btn.addEventListener('click', () => {
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 100);
            });
        }
    });

    // Touch Device Detection for Hover Effects
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');

        // Disable complex hover effects on touch
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('active-touch');
            });
        });
    }

    // Preload Critical Resources
    const preloadImages = () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = img.src;
                document.head.appendChild(preloadLink);
            }
        });
    };

    // Run preload after initial render
    setTimeout(preloadImages, 100);

    // Performance: Pause animations when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.body.classList.add('animations-paused');
        } else {
            document.body.classList.remove('animations-paused');
        }
    });

    console.log('Air Medical India - Emergency Response System Initialized');
});