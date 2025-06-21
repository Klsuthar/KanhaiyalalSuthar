// nav_bar.js - Logic for the bottom mobile navigation bar (Lottie Icons with active play)

document.addEventListener('DOMContentLoaded', () => {
    const bottomNavContainer = document.getElementById('bottom-navbar-container');
    if (!bottomNavContainer) return;

    const isMobileView = () => window.innerWidth <= 768 && getComputedStyle(bottomNavContainer).display !== 'none';

    const navItems = document.querySelectorAll('.bottom-nav-item');
    const sections = document.querySelectorAll('main section[id]');
    const lineIndicator = document.querySelector('.bottom-nav-line-indicator');
    // We'll get individual Lottie players inside the loop

    if (!navItems.length || !sections.length || !lineIndicator) {
        console.warn('Bottom navbar elements (items, sections, or line indicator) not found. Initialization skipped.');
        return;
    }

    // Function to set Lottie players to their final frame (or a specific static frame)
    function setLottieToStaticFrame(player) {
        if (player && player.getLottie && typeof player.goToAndStop === 'function') {
            const lottieInstance = player.getLottie(); // Get the underlying Lottie instance
            if (lottieInstance) {
                // Go to the last frame and stop.
                // lottieInstance.totalFrames gives the count of frames (e.g., 60 for a 2-sec anim at 30fps)
                // Frames are 0-indexed, so last frame is totalFrames - 1.
                player.goToAndStop(lottieInstance.totalFrames - 1, true);
            } else {
                // Fallback if getLottie() isn't ready or doesn't return instance
                player.seek('100%'); // Seek to the end percentage
                player.stop();
            }
        }
    }

    // Initialize all Lottie players to their static (final) frame
    // Wait for Lottie player to be ready
    navItems.forEach(item => {
        const player = item.querySelector('lottie-player');
        if (player) {
            player.addEventListener('ready', () => { // Or 'load' or 'instanceReady'
                setLottieToStaticFrame(player);
            });
            // If 'ready' event doesn't fire reliably, try a small timeout
            // setTimeout(() => setLottieToStaticFrame(player), 200);
        }
    });


    function updateActiveState(activeIndex) {
        if (!isMobileView()) {
            navItems.forEach(item => {
                item.classList.remove('active');
                const player = item.querySelector('lottie-player');
                setLottieToStaticFrame(player); // Reset to static frame on desktop
            });
            if (lineIndicator) {
                lineIndicator.style.width = '0px';
            }
            return;
        }

        navItems.forEach((item, index) => {
            const player = item.querySelector('lottie-player');
            if (index === activeIndex) {
                item.classList.add('active');
                if (player && typeof player.goToAndPlay === 'function') {
                    player.setLoop(false); // Play once when activated
                    player.goToAndPlay(0, true); // Play from the beginning
                }
            } else {
                item.classList.remove('active');
                setLottieToStaticFrame(player); // Set inactive to static final frame
            }
        });

        const activeNavItem = navItems[activeIndex];
        if (activeNavItem && lineIndicator) {
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
            // ... (scroll detection logic remains the same as before) ...
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
            // ... (initial active index detection logic remains the same as before) ...
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
            updateActiveState(initialActiveIndex); // This will also set initial Lottie states
        } else {
            navItems.forEach(item => {
                item.classList.remove('active');
                const player = item.querySelector('lottie-player');
                setLottieToStaticFrame(player);
            });
            if (lineIndicator) {
                lineIndicator.style.width = '0px';
            }
        }
    }

    // Delay initialization slightly to ensure Lottie players might be ready
    // and have their totalFrames property available.
    setTimeout(initializeOrUpdateNav, 250); // Increased delay slightly

    window.addEventListener('resize', initializeOrUpdateNav);
});