// nav_bar.js - Logic for the bottom mobile navigation bar (Lottie Icons)

document.addEventListener('DOMContentLoaded', () => {
    const bottomNavContainer = document.getElementById('bottom-navbar-container');
    if (!bottomNavContainer) return;

    const isMobileView = () => window.innerWidth <= 768 && getComputedStyle(bottomNavContainer).display !== 'none';

    const navItems = document.querySelectorAll('.bottom-nav-item');
    const sections = document.querySelectorAll('main section[id]');
    const lineIndicator = document.querySelector('.bottom-nav-line-indicator');
    const lottiePlayers = document.querySelectorAll('.bottom-nav-icon lottie-player'); // Get all Lottie players

    if (!navItems.length || !sections.length || !lineIndicator || !lottiePlayers.length) {
        console.warn('Bottom navbar elements (items, sections, line indicator, or Lottie players) not found. Initialization skipped.');
        return;
    }

    function updateActiveState(activeIndex) {
        if (!isMobileView()) {
            navItems.forEach(item => item.classList.remove('active'));
            if (lineIndicator) {
                lineIndicator.style.width = '0px';
            }
            // Stop all Lottie players if not in mobile view
            lottiePlayers.forEach(player => {
                if (player && typeof player.stop === 'function') {
                    player.stop();
                }
            });
            return;
        }

        navItems.forEach((item, index) => {
            const player = item.querySelector('lottie-player'); // Get player for this item
            if (index === activeIndex) {
                item.classList.add('active');
                if (player && typeof player.play === 'function') {
                    // To ensure it plays from the beginning if it was stopped
                    if (typeof player.goToAndPlay === 'function') {
                        player.goToAndPlay(0, true); // Go to frame 0 and play
                    } else {
                        player.stop(); // Stop first then play, can help some players
                        player.play();
                    }
                }
            } else {
                item.classList.remove('active');
                if (player && typeof player.stop === 'function') {
                    // player.stop(); // Or reset to first frame
                    if (typeof player.goToAndStop === 'function') {
                        player.goToAndStop(0, true); // Go to frame 0 and stop
                    } else {
                        player.stop();
                    }
                }
            }
        });

        // Update line indicator position and width
        const activeNavItem = navItems[activeIndex];
        if (activeNavItem && lineIndicator) {
            const navItemText = activeNavItem.querySelector('.bottom-nav-text');
            let indicatorWidth = activeNavItem.offsetWidth * 0.5;
            let indicatorLeft = activeNavItem.offsetLeft + (activeNavItem.offsetWidth - indicatorWidth) / 2;

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
            
            if (!currentSectionId && scrollY < sections[0].offsetTop && sections.length > 0) {
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
            } else if (sections.length > 0) {
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
            lottiePlayers.forEach(player => {
                if (player && typeof player.stop === 'function') {
                    player.stop();
                }
            });
        }
    }

    setTimeout(initializeOrUpdateNav, 150);
    window.addEventListener('resize', initializeOrUpdateNav);
});