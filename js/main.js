/**
 * Main JavaScript - Interactive functionality
 * @description Handles navigation, scroll effects, and animations
 */

(function() {
    'use strict';

    // Current section tracking
    let currentSection = 'hero';
    let isScrolling = false;
    let scrollTimeout = null;

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
                    smoothScrollTo(targetElement);
                }
            });
        });
    }

    /**
     * Smooth scroll to target element
     * @function smoothScrollTo
     * @param {HTMLElement} targetElement - Target element to scroll to
     */
    function smoothScrollTo(targetElement) {
        isScrolling = true;
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Reset scrolling flag after animation
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
        }, 1000);
    }

    /**
     * Initialize page navigation (side index)
     * @function initPageNav
     */
    function initPageNav() {
        const pageNav = document.querySelector('.page-nav');
        const pageNavItems = document.querySelectorAll('.page-nav-item');
        const heroSection = document.querySelector('.hero');
        const featuresSection = document.querySelector('.features');
        const downloadSection = document.querySelector('.download');
        const footer = document.querySelector('.footer');

        if (!pageNav) return;

        // Click handlers for navigation items
        pageNavItems.forEach(function(item) {
            item.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                const targetSection = document.querySelector('.' + sectionId) || 
                                      document.querySelector('#' + sectionId);
                
                if (targetSection) {
                    // Update active state immediately on click
                    updatePageNavActive(pageNavItems, sectionId);
                    smoothScrollTo(targetSection);
                }
            });
        });

        // Intersection observer for sections
        const sectionObserverOptions = {
            root: null,
            rootMargin: '-50% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let sectionClass = 'hero';
                    if (entry.target.classList.contains('features')) {
                        sectionClass = 'features';
                    } else if (entry.target.classList.contains('download')) {
                        sectionClass = 'download';
                    }
                    currentSection = sectionClass;
                    updatePageNavActive(pageNavItems, sectionClass);
                }
            });
        }, sectionObserverOptions);

        if (heroSection) sectionObserver.observe(heroSection);
        if (featuresSection) sectionObserver.observe(featuresSection);
        if (downloadSection) sectionObserver.observe(downloadSection);

        // Observer for showing/hiding page nav
        const visibilityObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const heroVisibilityObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                // Show nav when hero is not visible (we're past it)
                if (!entry.isIntersecting) {
                    // Check if footer is visible
                    const footerRect = footer.getBoundingClientRect();
                    const footerVisible = footerRect.top < window.innerHeight;
                    
                    if (!footerVisible) {
                        pageNav.classList.add('visible');
                        // Update nav state when scrolling back from footer
                        updatePageNavActive(pageNavItems, currentSection);
                    } else {
                        pageNav.classList.remove('visible');
                    }
                } else {
                    pageNav.classList.remove('visible');
                }
            });
        }, visibilityObserverOptions);

        if (heroSection) heroVisibilityObserver.observe(heroSection);

        // Observer for footer to hide nav
        const footerObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    pageNav.classList.remove('visible');
                } else {
                    // When footer is not visible, show nav and update state
                    pageNav.classList.add('visible');
                    updatePageNavActive(pageNavItems, currentSection);
                }
            });
        }, { threshold: 0.1 });

        if (footer) footerObserver.observe(footer);

        // Initialize line positions on load
        updatePageNavActive(pageNavItems, currentSection);
    }

    /**
     * Update page navigation active state
     * @function updatePageNavActive
     * @param {NodeList} items - Navigation items
     * @param {string} activeSection - Active section identifier
     */
    function updatePageNavActive(items, activeSection) {
        const itemsArray = Array.from(items);
        const activeIndex = itemsArray.findIndex(function(item) {
            return item.getAttribute('data-section') === activeSection;
        });

        // Update active states
        items.forEach(function(item) {
            const sectionId = item.getAttribute('data-section');
            if (sectionId === activeSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update line thickness
        updateNavLines(itemsArray, activeIndex);
    }

    /**
     * Update navigation line positions
     * @function updateNavLines
     * @param {Array} items - Navigation items array
     * @param {number} activeIndex - Index of active item
     */
    function updateNavLines(items, activeIndex) {
        const lineBase = document.querySelector('.page-nav-line');
        const lineThick = document.querySelector('.page-nav-line-thick');
        const lineMedium = document.querySelector('.page-nav-line-medium');
        
        if (!lineBase || !lineThick || !lineMedium || items.length < 2) return;

        const firstDot = items[0].querySelector('.page-nav-dot');
        const lastDot = items[items.length - 1].querySelector('.page-nav-dot');
        
        if (!firstDot || !lastDot) return;

        // Get container position
        const container = document.querySelector('.page-nav-dots');
        const containerRect = container.getBoundingClientRect();
        
        // Calculate positions relative to container
        const firstRect = firstDot.getBoundingClientRect();
        const lastRect = lastDot.getBoundingClientRect();
        
        const startY = firstRect.top - containerRect.top + firstRect.height / 2;
        const endY = lastRect.top - containerRect.top + lastRect.height / 2;
        const totalHeight = endY - startY;

        // Base line: connects all dots
        lineBase.style.top = startY + 'px';
        lineBase.style.height = totalHeight + 'px';

        // Thick line: from first dot to active dot
        if (activeIndex > 0) {
            const activeDot = items[activeIndex].querySelector('.page-nav-dot');
            const activeRect = activeDot.getBoundingClientRect();
            const activeY = activeRect.top - containerRect.top + activeRect.height / 2;
            const thickHeight = activeY - startY;
            
            lineThick.style.top = startY + 'px';
            lineThick.style.height = thickHeight + 'px';
            lineThick.style.display = 'block';
        } else {
            lineThick.style.display = 'none';
        }

        // Medium line: near active dot (next segment)
        if (activeIndex < items.length - 1) {
            const activeDot = items[activeIndex].querySelector('.page-nav-dot');
            const nextDot = items[activeIndex + 1].querySelector('.page-nav-dot');
            const activeRect = activeDot.getBoundingClientRect();
            const nextRect = nextDot.getBoundingClientRect();
            
            const mediumStartY = activeRect.top - containerRect.top + activeRect.height / 2;
            const mediumEndY = nextRect.top - containerRect.top + nextRect.height / 2;
            const mediumHeight = mediumEndY - mediumStartY;
            
            lineMedium.style.top = mediumStartY + 'px';
            lineMedium.style.height = mediumHeight + 'px';
            lineMedium.style.display = 'block';
        } else {
            lineMedium.style.display = 'none';
        }
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
     * Initialize features carousel (card stack)
     * @function initFeaturesCarousel
     */
    function initFeaturesCarousel() {
        const carousel = document.querySelector('.features-carousel');
        const cards = document.querySelectorAll('.feature-card-stack');
        const dots = document.querySelectorAll('.carousel-dot');
        
        if (!carousel || cards.length === 0) return;
        
        // Fix data-index for all cards
        cards.forEach(function(card, index) {
            card.setAttribute('data-index', index);
        });
        
        const totalCards = cards.length;
        let currentIndex = 0;
        let autoRotateInterval = null;
        
        /**
         * Calculate relative position with circular wrapping
         * @function getRelativePosition
         * @param {number} cardIndex - Card index
         * @param {number} centerIndex - Center card index
         * @returns {number} Relative position (-2 to 2 for visible, others for hidden)
         */
        function getRelativePosition(cardIndex, centerIndex) {
            // Calculate relative position with circular wrapping
            let relativePos = cardIndex - centerIndex;
            
            // Wrap around for circular effect
            if (relativePos > totalCards / 2) {
                relativePos -= totalCards;
            } else if (relativePos < -totalCards / 2) {
                relativePos += totalCards;
            }
            
            return relativePos;
        }
        
        /**
         * Update carousel position
         * @function updateCarousel
         * @param {number} centerIndex - Center card index
         */
        function updateCarousel(centerIndex) {
            cards.forEach(function(card, index) {
                // Remove all visibility classes
                card.classList.remove('visible-1', 'visible-2', 'visible-3', 'visible-4', 'visible-5');
                card.classList.remove('hidden-left', 'hidden-right');
                
                // Calculate relative position with circular wrapping
                const relativePos = getRelativePosition(index, centerIndex);
                
                // Assign visibility classes based on position
                if (relativePos === -2) {
                    card.classList.add('visible-1');
                } else if (relativePos === -1) {
                    card.classList.add('visible-2');
                } else if (relativePos === 0) {
                    card.classList.add('visible-3');
                } else if (relativePos === 1) {
                    card.classList.add('visible-4');
                } else if (relativePos === 2) {
                    card.classList.add('visible-5');
                } else if (relativePos < -2) {
                    card.classList.add('hidden-left');
                } else {
                    card.classList.add('hidden-right');
                }
            });
            
            // Update dots
            dots.forEach(function(dot, index) {
                if (index === centerIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            currentIndex = centerIndex;
        }
        
        /**
         * Rotate to next card (circular)
         * @function rotateNext
         */
        function rotateNext() {
            const nextIndex = (currentIndex + 1) % totalCards;
            updateCarousel(nextIndex);
        }
        
        /**
         * Start auto rotation
         * @function startAutoRotate
         */
        function startAutoRotate() {
            if (autoRotateInterval) clearInterval(autoRotateInterval);
            autoRotateInterval = setInterval(rotateNext, 4000);
        }
        
        /**
         * Stop auto rotation
         * @function stopAutoRotate
         */
        function stopAutoRotate() {
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
                autoRotateInterval = null;
            }
        }
        
        // Initialize carousel
        updateCarousel(0);
        startAutoRotate();
        
        // Click handlers for dots
        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                const targetIndex = parseInt(this.getAttribute('data-index'));
                updateCarousel(targetIndex);
                stopAutoRotate();
                startAutoRotate();
            });
        });
        
        // Click handlers for cards
        cards.forEach(function(card) {
            card.addEventListener('click', function() {
                const cardIndex = parseInt(this.getAttribute('data-index'));
                updateCarousel(cardIndex);
                stopAutoRotate();
                startAutoRotate();
            });
        });
        
        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoRotate);
        carousel.addEventListener('mouseleave', startAutoRotate);
    }

    /**
     * Initialize all functionality when DOM is ready
     */
    function init() {
        initNavigation();
        initScrollEffects();
        initFadeAnimations();
        initSmoothScroll();
        initPageNav();
        initCodeCopy();
        initLanguageManager();
        initFeaturesCarousel();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();