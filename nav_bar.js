// nav_bar.js - Logic for the bottom mobile navigation bar (LinkedIn Style with Line Indicator)

document.addEventListener('DOMContentLoaded', () => {
    const bottomNavContainer = document.getElementById('bottom-navbar-container');
    if (!bottomNavContainer) return;

    const isMobileView = () => window.innerWidth <= 768 && getComputedStyle(bottomNavContainer).display !== 'none';

    const navItems = document.querySelectorAll('.bottom-nav-item');
    const sections = document.querySelectorAll('main section[id]');
    const lineIndicator = document.querySelector('.bottom-nav-line-indicator'); // Get the line indicator

    if (!navItems.length || !sections.length || !lineIndicator) { // Check for lineIndicator too
        console.warn('Bottom navbar elements (items, sections, or line indicator) not found. Initialization skipped.');
        return;
    }

    function updateActiveState(activeIndex) {
        if (!isMobileView()) {
            navItems.forEach(item => item.classList.remove('active'));
            if (lineIndicator) { // Hide line indicator on desktop
                lineIndicator.style.width = '0px';
            }
            return;
        }

        navItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update line indicator position and width
        const activeNavItem = navItems[activeIndex];
        if (activeNavItem && lineIndicator) {
            // The line should be as wide as the text label or a fixed reasonable width.
            // For simplicity, let's make it a percentage of the nav item's width, or match the text.
            const navItemText = activeNavItem.querySelector('.bottom-nav-text');
            let indicatorWidth = 0;
            let indicatorLeft = 0;

            if (navItemText) {
                // Option 1: Match the text width
                // indicatorWidth = navItemText.offsetWidth;
                // indicatorLeft = activeNavItem.offsetLeft + (activeNavItem.offsetWidth / 2) - (navItemText.offsetWidth / 2);

                // Option 2: A fixed percentage of the item width, centered
                // This is often more visually consistent if text lengths vary a lot.
                indicatorWidth = activeNavItem.offsetWidth * 0.5; // e.g., 50% of the item's width
                indicatorLeft = activeNavItem.offsetLeft + (activeNavItem.offsetWidth - indicatorWidth) / 2;
            } else {
                // Fallback if no text, use a portion of the item width
                indicatorWidth = activeNavItem.offsetWidth * 0.4; // 40%
                indicatorLeft = activeNavItem.offsetLeft + (activeNavItem.offsetWidth - indicatorWidth) / 2;
            }


            lineIndicator.style.width = `${indicatorWidth}px`;
            lineIndicator.style.left = `${indicatorLeft}px`;
        }
    }

    navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            if (isMobileView()) {
                updateActiveState(index);
            }
        });
    });

    let scrollTimeout;
    function onScroll() {
        if (!isMobileView()) return;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            let currentSectionId = '';
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const offset = viewportHeight * 0.4;
            let activeNavIndex = 0;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - offset) {
                    currentSectionId = section.getAttribute('id');
                    break;
                }
            }
            
            if (!currentSectionId && scrollY < sections[0].offsetTop) {
                currentSectionId = sections[0].getAttribute('id');
            }
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
            } else if (sections.length > 0) { // If no hash, determine from scroll only if sections exist
                // Determine initial active index from scroll position
                 let currentSectionIdOnLoad = '';
                 const scrollY = window.scrollY;
                 const viewportHeight = window.innerHeight;
                 const offset = viewportHeight * 0.4;

                 for (let i = sections.length - 1; i >= 0; i--) {
                     const section = sections[i];
                     const sectionTop = section.offsetTop;
                     if (scrollY >= sectionTop - offset) {
                         currentSectionIdOnLoad = section.getAttribute('id');
                         break;
                     }
                 }
                  if (!currentSectionIdOnLoad && scrollY < sections[0].offsetTop && sections.length > 0) {
                        currentSectionIdOnLoad = sections[0].getAttribute('id');
                  }
                 navItems.forEach((navItem, index) => {
                     const navLinkHref = navItem.querySelector('a')?.getAttribute('href');
                     const sectionIdFromLink = navLinkHref ? navLinkHref.substring(1) : null;
                     if (sectionIdFromLink === currentSectionIdOnLoad) {
                         initialActiveIndex = index;
                     }
                 });
            }
            updateActiveState(initialActiveIndex);
        } else {
            navItems.forEach(item => item.classList.remove('active'));
            if (lineIndicator) {
                lineIndicator.style.width = '0px';
            }
        }
    }

    // Delay initialization slightly to ensure all elements are rendered and sized
    setTimeout(initializeOrUpdateNav, 150); 

    window.addEventListener('resize', initializeOrUpdateNav);
});