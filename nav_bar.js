// nav_bar.js - Logic for the bottom mobile navigation bar (Lottie Icons)

document.addEventListener('DOMContentLoaded', () => {
    const bottomNavContainer = document.getElementById('bottom-navbar-container');
    if (!bottomNavContainer) return;

    const isMobileView = () => window.innerWidth <= 768 && getComputedStyle(bottomNavContainer).display !== 'none';

    const navItems = document.querySelectorAll('.bottom-nav-item');
    const sections = document.querySelectorAll('main section[id]');
    const lineIndicator = document.querySelector('.bottom-nav-line-indicator');
    // It's good practice to wait for Lottie players to be ready, especially for initial interaction
    const lottiePlayers = Array.from(document.querySelectorAll('.bottom-nav-icon lottie-player'));
    let playersReady = 0;
    const totalPlayers = lottiePlayers.length;

    if (!navItems.length || !sections.length || !lineIndicator || !totalPlayers) {
        console.warn('Bottom navbar elements (items, sections, line indicator, or Lottie players) not found. Initialization skipped.');
        return;
    }

    function updateActiveState(activeIndex) {
        if (!isMobileView()) {
            navItems.forEach(item => item.classList.remove('active'));
            if (lineIndicator) {
                lineIndicator.style.width = '0px';
            }
            lottiePlayers.forEach(player => {
                if (player && typeof player.stop === 'function') {
                    player.loop = false;
                    player.goToAndStop(0, true); // Go to frame 0 and stop
                }
            });
            return;
        }

        navItems.forEach((item, index) => {
            const player = item.querySelector('lottie-player');
            if (!player || typeof player.play !== 'function') return; // Ensure player and methods exist

            if (index === activeIndex) {
                item.classList.add('active');
                player.loop = true; // Enable looping for active icon
                player.goToAndPlay(0, true); // Play from the beginning
            } else {
                item.classList.remove('active');
                player.loop = false; // Disable looping for inactive icons
                player.goToAndStop(0, true); // Go to frame 0 and stop (shows static logo)
            }
        });

        const activeNavItem = navItems[activeIndex];
        if (activeNavItem && lineIndicator) {
            const indicatorWidth = activeNavItem.offsetWidth * 0.5;
            const indicatorLeft = activeNavItem.offsetLeft + (activeNavItem.offsetWidth - indicatorWidth) / 2;
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
            // ... (scroll logic to determine activeNavIndex remains the same) ...
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
            
            if (!currentSectionId && sections.length > 0 && scrollY < sections[0].offsetTop) {
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

    function initializeNavOnReady() {
        playersReady++;
        if (playersReady === totalPlayers) { // All players are ready
            initializeOrUpdateNav();
        }
    }

    function initializeOrUpdateNav() {
        if (isMobileView()) {
            let initialActiveIndex = 0;
            const currentHash = window.location.hash;
            // Determine initial active index (same logic as before)
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
            // Set all to static frame initially THEN activate the correct one
            lottiePlayers.forEach(player => {
                if (player && typeof player.goToAndStop === 'function') {
                    player.loop = false;
                    player.goToAndStop(0, true); // Ensure all start at frame 0 and stopped
                }
            });
            updateActiveState(initialActiveIndex); // Then activate the correct one
        } else {
            // Desktop view or navbar hidden
            navItems.forEach(item => item.classList.remove('active'));
            if (lineIndicator) {
                lineIndicator.style.width = '0px';
            }
            lottiePlayers.forEach(player => {
                if (player && typeof player.goToAndStop === 'function') {
                    player.loop = false;
                    player.goToAndStop(0, true);
                }
            });
        }
    }

    // Wait for all Lottie players to be ready before initializing
    if (totalPlayers > 0) {
        lottiePlayers.forEach(player => {
            if (player.getLottie) { // Check if getLottie method exists (player might already be "ready" in some cases)
                 // If the player is already loaded (e.g. from cache), 'load' event might not fire
                if (player.animationLoaded) {
                     initializeNavOnReady();
                } else {
                    player.addEventListener('load', initializeNavOnReady); // 'load' event for lottie-player
                }
            } else { // Fallback for very quick loads or if API is different
                console.warn("Lottie player API might not be fully available yet for direct 'load' event listener. Trying to initialize.");
                playersReady++; // Assume ready for this simple case, might need more robust handling
                 if (playersReady === totalPlayers) {
                    setTimeout(initializeOrUpdateNav, 50); // Short delay as a fallback
                }
            }
        });
    } else {
        // If no lottie players, proceed with normal init if other elements are present
        if (navItems.length && sections.length && lineIndicator) {
            setTimeout(initializeOrUpdateNav, 150);
        }
    }

    window.addEventListener('resize', initializeOrUpdateNav);
});