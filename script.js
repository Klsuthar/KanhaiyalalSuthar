// script.js - Global Portfolio Logic

console.log("KLS Portfolio Script Initializing...");

// --- Global variable for requestAnimationFrame ID for scroll ---
let rAFId = null;

// --- Optimized Scroll Handler (for top navbar and active links on top navbar) ---
function optimizedScrollUpdates() {
    const navbar = document.getElementById('navbar'); // The top navigation bar

    if (navbar && getComputedStyle(navbar).display !== 'none') {
        const sections = document.querySelectorAll('main section[id]');
        const navLinkItems = document.querySelectorAll('#navbar .nav-links li a'); // Links in the top bar
        const currentNavHeight = navbar.offsetHeight;

        // Navbar style change on scroll (e.g., transparent to opaque)
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting for top navbar (if it has links shown on desktop)
        if (navLinkItems.length > 0 && getComputedStyle(navLinkItems[0].closest('ul')).display !== 'none') {
            let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - currentNavHeight - 50; // Adjusted for navbar height
                if (window.scrollY >= sectionTop) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navLinkItems.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href');
                if (linkHref && linkHref.substring(1) === currentSectionId) {
                    link.classList.add('active');
                }
            });

            // Ensure 'Home' link is active at the very top or if no other section matches
            if (currentSectionId === '' || (currentSectionId === 'home' && sections.length > 0 && window.scrollY < (sections[0].offsetTop + sections[0].offsetHeight - currentNavHeight - 50))) {
                const homeLink = document.querySelector('#navbar .nav-links a[href="#home"]');
                if (homeLink && !homeLink.classList.contains('active')) {
                    homeLink.classList.add('active');
                }
            }
        }
    }
    rAFId = null; // Reset RAF ID
}


// --- DOMContentLoaded Listener for initial setup ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed.");
    const body = document.body;
    body.classList.add('loading'); // For loading overlay

    // --- Top Navigation Burger Logic (for original overlay menu) ---
    const burger = document.querySelector('#navbar .burger');
    const topNavLinksUl = document.querySelector('#navbar .nav-links');
    
    if (burger && topNavLinksUl) {
        const topNavLinkItems = topNavLinksUl.querySelectorAll('li a');

        burger.addEventListener('click', () => {
            if (getComputedStyle(burger).display !== 'none') {
                console.log("Top Navbar Burger clicked (if visible).");
                topNavLinksUl.classList.toggle('nav-active');
                burger.classList.toggle('toggle');
                const isExpanded = topNavLinksUl.classList.contains('nav-active');
                burger.setAttribute('aria-expanded', isExpanded.toString());

                if (topNavLinksUl.classList.contains('nav-active')) {
                    topNavLinkItems.forEach((link, index) => {
                        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                    });
                } else {
                    topNavLinkItems.forEach(link => {
                        link.style.animation = '';
                    });
                }
            }
        });

        topNavLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                if (topNavLinksUl.classList.contains('nav-active')) {
                    topNavLinksUl.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    burger.setAttribute('aria-expanded', 'false');
                    topNavLinkItems.forEach(item => item.style.animation = '');
                }
            });
        });
    }


    // --- Scroll Event Listener (Optimized for top navbar) ---
    window.addEventListener('scroll', () => {
        if (rAFId === null) {
            rAFId = requestAnimationFrame(optimizedScrollUpdates);
        }
    }, { passive: true });
    optimizedScrollUpdates(); // Initial call


    // --- Vanilla Tilt JS Initialization ---
    if (typeof VanillaTilt !== 'undefined') {
        const tiltElements = document.querySelectorAll(".project-card, .skill-item.hover-lift");
        if (tiltElements.length > 0) {
            console.log("Initializing VanillaTilt.");
            try {
                VanillaTilt.init(tiltElements, {
                    max: 5,
                    speed: 300,
                    glare: true,
                    "max-glare": 0.1
                });
            } catch (e) {
                console.error("VanillaTilt initialization error:", e);
            }
        } else {
            // console.warn("No elements found for VanillaTilt with current selectors.");
        }
    } else {
        // console.warn("VanillaTilt library not loaded or no elements with data-tilt.");
    }


    // --- tsParticles Initialization - COMMENTED OUT ---
    /*
    const particlesContainer = document.getElementById('tsparticles-background');
    if (particlesContainer && typeof tsParticles !== 'undefined') {
        console.log("Initializing tsParticles.");
        try {
            tsParticles.load("tsparticles-background", {
                fpsLimit: 60,
                interactivity: { events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "push" } }, modes: { grab: { distance: 120, links: { opacity: 0.6 } }, push: { quantity: 2 }}},
                particles: { color: { value: "#ffffff" }, links: { color: "#ffffff", distance: 130, enable: true, opacity: 0.15, width: 1 }, collisions: { enable: false }, move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: true, speed: 1, straight: false }, number: { density: { enable: true, area: 900 }, value: 40 }, opacity: { value: 0.2 }, shape: { type: "circle" }, size: { value: { min: 0.5, max: 2 }}},
                detectRetina: true,
            });
        } catch (e) { console.error("tsParticles initialization error:", e); }
    } else { console.warn("tsParticles library or #tsparticles-background container not found (this is expected if particles are removed)."); }
    */
    // --- END OF tsParticles COMMENTED OUT BLOCK ---


    // --- On-Scroll Animation Logic (IntersectionObserver for generic .animate-on-scroll) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0 && typeof IntersectionObserver !== 'undefined') {
        console.log("Initializing IntersectionObserver for scroll animations.");
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.dataset.delay && !entry.target.style.transitionDelay) {
                        entry.target.style.transitionDelay = entry.target.dataset.delay;
                    }
                    entry.target.classList.add('is-visible');

                    if (entry.target.classList.contains('skill-item') && !entry.target.dataset.counterAnimated) {
                        const percentageSpan = entry.target.querySelector('.skill-percentage');
                        const progressBar = entry.target.querySelector('.progress-bar');
                        if (percentageSpan && progressBar) {
                            let targetValue = parseInt(percentageSpan.textContent.trim(), 10);
                            if (isNaN(targetValue) || targetValue === 0) {
                                targetValue = parseInt(progressBar.style.width, 10);
                            }
                            if (!isNaN(targetValue) && targetValue > 0) {
                                progressBar.style.width = '0%';
                                percentageSpan.textContent = '0%';
                                animateValueCounter(percentageSpan, progressBar, 0, targetValue, 1000 + (targetValue * 15));
                                entry.target.dataset.counterAnimated = 'true';
                            } else if (targetValue === 0) {
                                percentageSpan.textContent = "0%";
                                progressBar.style.width = "0%";
                                entry.target.dataset.counterAnimated = 'true';
                            }
                        }
                    }
                    // observer.unobserve(entry.target);
                }
            });
        };

        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        animatedElements.forEach(el => scrollObserver.observe(el));
    } else {
        console.warn("No elements for scroll animation or IntersectionObserver not supported.");
        if (typeof IntersectionObserver === 'undefined') {
            document.querySelectorAll('.skill-item').forEach(skillItem => {
                if (!skillItem.dataset.counterAnimated) {
                     const percentageSpan = skillItem.querySelector('.skill-percentage');
                     const progressBar = skillItem.querySelector('.progress-bar');
                     if (percentageSpan && progressBar) {
                        let targetValue = parseInt(percentageSpan.textContent.trim(), 10);
                        if (isNaN(targetValue) || targetValue === 0) {
                            targetValue = parseInt(progressBar.style.width, 10);
                        }
                        if (!isNaN(targetValue) && targetValue > 0) {
                            progressBar.style.width = '0%'; percentageSpan.textContent = '0%';
                            animateValueCounter(percentageSpan, progressBar, 0, targetValue, 1000 + (targetValue * 15));
                            skillItem.dataset.counterAnimated = 'true';
                        }
                    }
                }
            });
        }
    }
}); // End of DOMContentLoaded


// --- Window Load Event for Hiding Loading Overlay ---
window.addEventListener('load', () => {
    console.log("Window fully loaded (all resources).");
    const loadingOverlay = document.getElementById('loading-overlay');
    const body = document.body;

    function hideLoadingOverlay() {
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            body.classList.remove('loading');
        } else {
            body.classList.remove('loading');
        }
    }

    const maxLoadTime = 2500;
    const minDisplayTime = 300;
    const loadStartTime = Date.now();
    const elapsedTimeOnLoad = Date.now() - loadStartTime;
    let hideDelay = 0;

    if (elapsedTimeOnLoad < minDisplayTime) {
        hideDelay = minDisplayTime - elapsedTimeOnLoad;
    }

    const effectiveMaxLoadTime = Math.max(maxLoadTime, minDisplayTime);
    const fallbackTimeout = setTimeout(() => {
        hideLoadingOverlay();
    }, effectiveMaxLoadTime - elapsedTimeOnLoad + hideDelay);

    if (hideDelay > 0) {
        setTimeout(() => {
            clearTimeout(fallbackTimeout);
            hideLoadingOverlay();
        }, hideDelay);
    } else {
        clearTimeout(fallbackTimeout);
        hideLoadingOverlay();
    }
});


// --- Helper Function: Animate Value Counter ---
function animateValueCounter(percentageElement, progressBarElement, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);

        if(percentageElement) percentageElement.textContent = currentValue + "%";
        if (progressBarElement) progressBarElement.style.width = currentValue + "%";

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            if(percentageElement) percentageElement.textContent = end + "%";
            if (progressBarElement) progressBarElement.style.width = end + "%";
        }
    };
    window.requestAnimationFrame(step);
}

// --- Helper Function: Submit Via Email Client (Global) ---
function submitViaEmailClient(subject = 'General Inquiry') {
    console.log(`Preparing mailto link with subject: ${subject}`);
    const email = 'klsuthar0987@gmail.com';
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Hello Kanhaiya,\n\nI would like to discuss...\n\nBest regards,\n[Your Name]')}`;
    try {
        window.location.href = mailtoLink;
    } catch (e) {
        console.error("Error opening mail client:", e);
        alert("Could not open your email client. Please copy the email address: " + email);
    }
}

console.log("KLS Global Portfolio Script Fully Parsed.");