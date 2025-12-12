/* ==========================================================================
   Sistema de Agendamento - SEE/PB
   Landing Page Scripts
   ========================================================================== */

(function() {
    'use strict';

    /* --------------------------------------------------------------------------
       DOM Elements
       -------------------------------------------------------------------------- */
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    /* --------------------------------------------------------------------------
       Header Scroll Effect
       -------------------------------------------------------------------------- */
    let lastScroll = 0;
    const scrollThreshold = 100;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        // Add/remove shadow based on scroll
        if (currentScroll > 10) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }

        // Hide/show header on scroll (optional - commented out)
        // if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        //     header.style.transform = 'translateY(-100%)';
        // } else {
        //     header.style.transform = 'translateY(0)';
        // }

        lastScroll = currentScroll;
    }

    /* --------------------------------------------------------------------------
       Mobile Menu Toggle
       -------------------------------------------------------------------------- */
    function toggleMobileMenu() {
        const isOpen = mobileMenuBtn.classList.contains('active');

        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        // Update accessibility
        mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
        mobileMenu.setAttribute('aria-hidden', isOpen);

        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    /* --------------------------------------------------------------------------
       Smooth Scroll for Nav Links
       -------------------------------------------------------------------------- */
    function handleNavClick(event) {
        const href = event.currentTarget.getAttribute('href');

        if (href.startsWith('#')) {
            event.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        }
    }

    /* --------------------------------------------------------------------------
       Intersection Observer for Animations
       -------------------------------------------------------------------------- */
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe feature cards
        document.querySelectorAll('.feature-card').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.5s ease ${index * 0.1}s`;
            observer.observe(el);
        });

        // Observe steps
        document.querySelectorAll('.step').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.5s ease ${index * 0.15}s`;
            observer.observe(el);
        });

        // Observe stats
        document.querySelectorAll('.stat').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `all 0.4s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    /* --------------------------------------------------------------------------
       Add animation class styles
       -------------------------------------------------------------------------- */
    function injectAnimationStyles() {
        if (document.getElementById('landing-js-styles')) return;

        const style = document.createElement('style');
        style.id = 'landing-js-styles';
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /* --------------------------------------------------------------------------
       Counter Animation for Stats
       -------------------------------------------------------------------------- */
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const text = target.textContent;
                    const number = parseInt(text.replace(/[^\d]/g, ''));
                    const suffix = text.replace(/[\d]/g, '');
                    const duration = 2000;
                    const steps = 60;
                    const increment = number / steps;
                    let current = 0;
                    let step = 0;

                    const timer = setInterval(() => {
                        step++;
                        current = Math.min(Math.round(increment * step), number);

                        if (current >= 1000) {
                            target.textContent = (current / 1000).toFixed(current >= 10000 ? 0 : 1) + 'k' + suffix.replace('k', '').replace('+', '') + (text.includes('+') ? '+' : '');
                        } else {
                            target.textContent = current + suffix;
                        }

                        if (step >= steps) {
                            target.textContent = text; // Restore original text
                            clearInterval(timer);
                        }
                    }, duration / steps);

                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    /* --------------------------------------------------------------------------
       Active Nav Link on Scroll
       -------------------------------------------------------------------------- */
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + header.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* --------------------------------------------------------------------------
       Keyboard Navigation
       -------------------------------------------------------------------------- */
    function handleKeyboard(event) {
        // Close mobile menu on Escape
        if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }

    /* --------------------------------------------------------------------------
       Event Listeners
       -------------------------------------------------------------------------- */
    function init() {
        // Inject animation styles
        injectAnimationStyles();

        // Scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('scroll', updateActiveNav, { passive: true });

        // Mobile menu
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }

        // Nav links
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        // Keyboard
        document.addEventListener('keydown', handleKeyboard);

        // Close mobile menu on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Initialize animations (check for reduced motion preference)
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            initScrollAnimations();
            animateCounters();
        }

        // Initial scroll check
        handleScroll();
        updateActiveNav();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
