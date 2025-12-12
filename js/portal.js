/* ==========================================================================
   Portal de Sistemas - SEE/PB
   Main Portal Scripts
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
    function handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 10) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }

    /* --------------------------------------------------------------------------
       Mobile Menu Toggle
       -------------------------------------------------------------------------- */
    function toggleMobileMenu() {
        const isOpen = mobileMenuBtn.classList.contains('active');

        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
        mobileMenu.setAttribute('aria-hidden', isOpen);

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
       Smooth Scroll
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

                closeMobileMenu();
            }
        }
    }

    /* --------------------------------------------------------------------------
       Keyboard Navigation
       -------------------------------------------------------------------------- */
    function handleKeyboard(event) {
        if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
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

        // Observe system cards
        document.querySelectorAll('.system-card').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `all 0.4s ease ${index * 0.05}s`;
            observer.observe(el);
        });

        // Observe stats
        document.querySelectorAll('.about-stat').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `all 0.4s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    /* --------------------------------------------------------------------------
       Inject Animation Styles
       -------------------------------------------------------------------------- */
    function injectAnimationStyles() {
        if (document.getElementById('portal-js-styles')) return;

        const style = document.createElement('style');
        style.id = 'portal-js-styles';
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /* --------------------------------------------------------------------------
       Event Listeners
       -------------------------------------------------------------------------- */
    function init() {
        injectAnimationStyles();

        window.addEventListener('scroll', handleScroll, { passive: true });

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }

        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        document.addEventListener('keydown', handleKeyboard);

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            initScrollAnimations();
        }

        handleScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
