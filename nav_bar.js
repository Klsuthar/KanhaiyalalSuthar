// nav_bar.js - Logic for the bottom mobile navigation bar (LinkedIn Style)

document.addEventListener('DOMContentLoaded', () => {
    const bottomNavContainer = document.getElementById('bottom-navbar-container');
    if (!bottomNavContainer) return;

    const isMobileView = () => window.innerWidth <= 768 && getComputedStyle(bottomNavContainer).display !== 'none';

    const navItems = document.querySelectorAll('.bottom-nav-item');
    const sections = document.querySelectorAll('main section[id]');

    if (!navItems.length || !sections.length) {
        console.warn('Bottom navbar items or content sections not found. Initialization skipped.');
        return;
    }

    function updateActiveState(activeIndex) {
        if (!isMobileView()) { // Don't do anything if not in mobile view
            navItems.forEach(item => item.classList.remove('active'));
            return;
        }

        navItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            // Let the browser handle scroll for #hash links
            // The active state will be updated by the scroll listener,
            // or we can force it here for immediate feedback if desired.
            if (isMobileView()) {
                 updateActiveState(index); // Immediate feedback on click
            }
        });
    });

    let scrollTimeout;
    function onScroll() {
        if (!isMobileView()) return;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            let currentSectionId = '';
            // Determine the "current" section based on what's most visible.
            // A common approach is to find the section whose top is closest to,
            // and above, a certain offset from the top of the viewport.
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            // Consider a section active if its top is within the top 40% of the viewport,
            // or if it's the last section and we're near the bottom.
            const offset = viewportHeight * 0.4;

            let activeNavIndex = 0; // Default to first item (Home)

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - offset) {
                    currentSectionId = section.getAttribute('id');
                    break;
                }
            }
            
            // If no section is found (e.g., scrolled above the first section),
            // or if explicitly at the very top.
            if (!currentSectionId && scrollY < sections[0].offsetTop) {
                currentSectionId = sections[0].getAttribute('id');
            }
            // If scrolled to the very bottom, make last section active.
            if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 30 && sections.length > 0) {
                 currentSectionId = sections[sections.length - 1].getAttribute('id');
            }


            navItems.forEach((navItem, index) => {
                const navLinkHref = navItem.querySelector('a')?.getAttribute('href');
                const sectionIdFromLink = navLinkHref ? navLinkHref.substring(1) : null;
                if (sectionIdFromLink === currentSectionId) {
                    activeNavIndex = index;
                }
            });
            updateActiveState(activeNavIndex);
        }, 50);
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
                updateActiveState(initialActiveIndex);
            } else {
                onScroll(); // Determine active section from scroll position on load
            }
        } else {
            navItems.forEach(item => item.classList.remove('active'));
        }
    }

    setTimeout(initializeOrUpdateNav, 100);

    window.addEventListener('resize', initializeOrUpdateNav);
});