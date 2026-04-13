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

    // Mobile Menu logic removed - Navigation simplified to single button
    
    // Testimonial Carousel Logic
    const carousel = document.getElementById('testimonial-carousel');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const dots = document.querySelectorAll('.carousel-dot');

    if (carousel && nextBtn && prevBtn) {
        const scrollAmount = 400;

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // Sync dots on scroll
        carousel.addEventListener('scroll', () => {
            const index = Math.round(carousel.scrollLeft / carousel.offsetWidth);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        });
    }

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

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const button = item.querySelector('button');
        const answer = item.querySelector('.faq-answer');

        button.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer')?.classList.add('hidden');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                answer?.classList.remove('hidden');
            }
        });
    });

    // Map section removed - marker logic deleted

    // Form Handling - Reverted to Custom Form with Redirect
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Add loading state
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="relative z-10">Processing...</span>';
            submitBtn.disabled = true;

            // Simulate form submission and redirect
            setTimeout(() => {
                // Redirect to Thank You page
                window.location.href = 'thank-you.html';
            }, 1000);
        });
    }

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

    // Counter Animation for Global Network Section
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const speed = 100; // Lower is faster
            
            const updateCount = () => {
                const count = +stat.innerText;
                const increment = target / speed;

                if (count < target) {
                    stat.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 15);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stat-number')?.closest('section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Automatic Carousel Auto-Slide Logic
    function initAutoSlide(carouselId, intervalTime = 5000) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        let isPaused = false;
        
        const autoSlide = () => {
            if (isPaused || document.hidden) return;
            
            const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
            const firstCard = carousel.querySelector(':scope > div');
            if (!firstCard) return;
            
            const cardWidth = firstCard.offsetWidth + 24; // Width + gap
            
            if (carousel.scrollLeft >= maxScrollLeft - 20) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        };

        setInterval(autoSlide, intervalTime);

        // Pause on interaction
        carousel.addEventListener('mouseenter', () => isPaused = true);
        carousel.addEventListener('mouseleave', () => isPaused = false);
        carousel.addEventListener('touchstart', () => isPaused = true);
        carousel.addEventListener('touchend', () => {
            setTimeout(() => isPaused = false, 3000);
        });
    }

    // Initialize auto-sliding - High speed, endless loop
    setTimeout(() => {
        initAutoSlide('testimonial-carousel', 3000); // 3 seconds
        initAutoSlide('services-carousel', 3000);    // 3 seconds
    }, 2000);

    console.log('Air Medical India - Emergency Response System Initialized');
});