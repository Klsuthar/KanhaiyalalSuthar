// nav_bar.js - Logic for the bottom mobile navigation bar

document.addEventListener('DOMContentLoaded', () => {
    const bottomNavContainer = document.getElementById('bottom-navbar-container');
    if (!bottomNavContainer) return;

    const isMobileView = () => window.innerWidth <= 768 && getComputedStyle(bottomNavContainer).display !== 'none';

    if (!isMobileView()) { // Initial check
        // return; // Or let resize handle it if starting in desktop and shrinking
    }

    const navItems = document.querySelectorAll('.bottom-nav-item');
    const indicator = document.querySelector('.bottom-nav-indicator');
    const sections = document.querySelectorAll('main section[id]'); // More specific selector for sections

    if (!navItems.length || !indicator || !sections.length) {
        console.warn('Bottom navbar elements (items, indicator, or sections) not found. Initialization skipped.');
        return;
    }

    function updateIndicator(activeIndex) {
        if (!isMobileView()) { // Don't do anything if not in mobile view
            indicator.innerHTML = ''; // Clear indicator if view changes to desktop
            navItems.forEach(item => item.classList.remove('active'));
            return;
        }

        const activeNavItem = navItems[activeIndex];
        if (!activeNavItem) return;

        navItems.forEach(item => item.classList.remove('active'));
        activeNavItem.classList.add('active');

        const indicatorOffsetLeft = activeNavItem.offsetLeft + (activeNavItem.offsetWidth / 2) - (indicator.offsetWidth / 2);
        indicator.style.left = `${indicatorOffsetLeft}px`;

        // Update icon in indicator
        const activeIconElement = activeNavItem.querySelector('.bottom-nav-icon'); // The static icon container
        if (activeIconElement) {
            const newIconHTML = activeIconElement.innerHTML; // Get the actual <i> tag

            // Only update DOM if the icon content is different to prevent flicker/reflow
            if (indicator.innerHTML !== newIconHTML) {
                const currentIconInIndicator = indicator.querySelector('i');
                if (currentIconInIndicator) {
                    currentIconInIndicator.style.opacity = '0'; // Start fade out
                    setTimeout(() => {
                        indicator.innerHTML = newIconHTML; // Replace after fade
                        const newIconInIndicator = indicator.querySelector('i');
                        if (newIconInIndicator) {
                             // Force reflow for transition to apply correctly
                            void newIconInIndicator.offsetWidth;
                            newIconInIndicator.style.opacity = '1'; // Fade in
                        }
                    }, 100); // Duration for fade out, should be less than CSS transition for indicator icon
                } else {
                    indicator.innerHTML = newIconHTML; // First time, just set it
                     const newIconInIndicator = indicator.querySelector('i');
                        if (newIconInIndicator) {
                            newIconInIndicator.style.opacity = '1';
                        }
                }
            }
        }
    }

    navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            if (!isMobileView()) return;
            // The href will handle scrolling due to `scroll-behavior: smooth`
            updateIndicator(index);
        });
    });

    let scrollTimeout;
    function onScroll() {
        if (!isMobileView()) return;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => { // Debounce scroll handler slightly
            let currentSectionId = '';
            const viewportMiddle = window.scrollY + (window.innerHeight / 2);
            let closestSection = { id: '', distance: Infinity, index: -1 };

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionMidPoint = sectionTop + (section.offsetHeight / 2);
                const distanceToViewportMiddle = Math.abs(sectionMidPoint - viewportMiddle);

                // Check if section is generally in view
                if (sectionTop < viewportMiddle + (window.innerHeight / 3) && sectionBottom > viewportMiddle - (window.innerHeight / 3)) {
                    if (distanceToViewportMiddle < closestSection.distance) {
                        closestSection.distance = distanceToViewportMiddle;
                        closestSection.id = section.getAttribute('id');
                        closestSection.index = index; // Store index related to sections array
                    }
                }
            });
            
            currentSectionId = closestSection.id;

            // Handle very top of page
            if (window.scrollY < sections[0].offsetTop * 0.5 && sections.length > 0) { // If very close to top
                 currentSectionId = sections[0].getAttribute('id');
            }
            // Handle very bottom of page
            else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 30 && sections.length > 0) {
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }


            let activeNavIndex = 0; // Default to first item
            navItems.forEach((navItem, index) => {
                const navLinkHref = navItem.querySelector('a')?.getAttribute('href');
                const sectionIdFromLink = navLinkHref ? navLinkHref.substring(1) : null;
                if (sectionIdFromLink === currentSectionId) {
                    activeNavIndex = index;
                }
            });
            updateIndicator(activeNavIndex);
        }, 50); // Debounce time
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    function initializeOrUpdateNav() {
        if (isMobileView()) {
            let initialActiveIndex = 0;
            const currentHash = window.location.hash;
            if (currentHash) {
                navItems.forEach((item, index) => {
                    if (item.querySelector('a')?.getAttribute('href') === currentHash) {
                        initialActiveIndex = index;
                    }
                });
                updateIndicator(initialActiveIndex);
            } else {
                onScroll(); // Determine active section from scroll position
            }
        } else {
            // Clear active states if transitioning to desktop view
            indicator.innerHTML = '';
            navItems.forEach(item => item.classList.remove('active'));
        }
    }
    
    // Initial setup
    setTimeout(initializeOrUpdateNav, 100); // Delay to ensure layout is complete

    window.addEventListener('resize', () => {
        // Re-initialize or clear based on new view
        initializeOrUpdateNav();
    });
});