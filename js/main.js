/**
 * Main JavaScript - Interactive functionality
 * @description Handles navigation, scroll effects, and animations
 */

(function() {
    'use strict';

    /**
     * Initialize navigation toggle for mobile
     * @function initNavigation
     */
    function initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });

            document.querySelectorAll('.nav-link').forEach(function(link) {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    /**
     * Initialize scroll effects for header
     * @function initScrollEffects
     */
    function initScrollEffects() {
        const header = document.querySelector('.header');
        let lastScrollY = 0;

        if (header) {
            window.addEventListener('scroll', function() {
                const currentScrollY = window.scrollY;

                if (currentScrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                lastScrollY = currentScrollY;
            }, { passive: true });
        }
    }

    /**
     * Initialize fade-in animations on scroll
     * @function initFadeAnimations
     */
    function initFadeAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(function(element) {
            observer.observe(element);
        });

        document.querySelectorAll('.feature-card').forEach(function(card, index) {
            card.classList.add('fade-in');
            card.classList.add('fade-in-delay-' + (index % 6 + 1));
            observer.observe(card);
        });

        document.querySelectorAll('.tech-item').forEach(function(item, index) {
            item.classList.add('fade-in');
            item.classList.add('fade-in-delay-' + (index % 6 + 1));
            observer.observe(item);
        });

        document.querySelectorAll('.step').forEach(function(step, index) {
            step.classList.add('fade-in');
            step.classList.add('fade-in-delay-' + (index % 6 + 1));
            observer.observe(step);
        });
    }

    /**
     * Initialize smooth scroll for anchor links
     * @function initSmoothScroll
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Initialize copy functionality for code blocks
     * @function initCodeCopy
     */
    function initCodeCopy() {
        document.querySelectorAll('.step-code').forEach(function(codeBlock) {
            codeBlock.style.cursor = 'pointer';
            codeBlock.title = 'Click to copy';

            codeBlock.addEventListener('click', function() {
                const code = this.querySelector('code').textContent;
                navigator.clipboard.writeText(code).then(function() {
                    const originalBg = codeBlock.style.background;
                    codeBlock.style.background = 'rgba(0, 153, 255, 0.2)';
                    setTimeout(function() {
                        codeBlock.style.background = originalBg;
                    }, 200);
                });
            });
        });
    }

    /**
     * Initialize language manager
     * @async
     * @function initLanguageManager
     */
    async function initLanguageManager() {
        if (window.LanguageManager) {
            const langManager = new window.LanguageManager();
            await langManager.init();
            window.langManager = langManager;
        }
    }

    /**
     * Initialize all functionality when DOM is ready
     */
    function init() {
        initNavigation();
        initScrollEffects();
        initFadeAnimations();
        initSmoothScroll();
        initCodeCopy();
        initLanguageManager();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();