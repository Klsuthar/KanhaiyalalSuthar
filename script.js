console.log("KLS Portfolio Script Initializing...");

// --- Function to Animate Value Counter (for skill percentages) ---
function animateValueCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue + "%"; // Update text with percentage sign
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end + "%"; // Ensure it ends exactly on the target
        }
    };
    window.requestAnimationFrame(step);
}

// --- Global variable for requestAnimationFrame ID ---
let rAFId = null;

// --- Optimized Scroll Handler ---
function optimizedScrollUpdates() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinkItems = document.querySelectorAll('.nav-links li a');
    const currentNavHeight = navbar.offsetHeight;

    // Navbar style change on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSectionId = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - currentNavHeight - 50;
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
     // Ensure home is active if at top or no other section matches
    if (currentSectionId === '' || (currentSectionId === 'home' && sections.length > 0 && window.scrollY < (sections[0].offsetTop + sections[0].offsetHeight - currentNavHeight - 50))) {
        const homeLink = document.querySelector('.nav-links a[href="#home"]');
        if(homeLink && !homeLink.classList.contains('active')) homeLink.classList.add('active');
    }


    // Parallax effect for home content
    const homeContent = document.querySelector('#home .home-content');
    if (homeContent) {
        const scrollY = window.scrollY;
        // Apply parallax only when home section is roughly in viewport to save performance
        if (scrollY < window.innerHeight * 1.5) { // Adjust 1.5 factor as needed
             // Slower movement for home content, factor (0.2 to 0.4 is good for subtle)
            homeContent.style.transform = `translateY(${scrollY * 0.25}px)`;
        } else {
            // Optional: Reset if you want it to snap back when far out of view
            // homeContent.style.transform = `translateY(0px)`;
        }
    }
    rAFId = null; // Reset ID after execution
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed.");
    const body = document.body;
    body.classList.add('loading');

    // --- Navigation Logic ---
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links li a');
    // Navbar and sections already selected in optimizedScrollUpdates

    burger.addEventListener('click', () => {
        console.log("Burger clicked.");
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        const isExpanded = navLinks.classList.contains('nav-active');
        burger.setAttribute('aria-expanded', isExpanded);

        if (navLinks.classList.contains('nav-active')) {
            navLinkItems.forEach((link, index) => {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            });
        } else {
            navLinkItems.forEach(link => {
                link.style.animation = '';
            });
        }
    });

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                burger.classList.remove('toggle');
                burger.setAttribute('aria-expanded', 'false');
                navLinkItems.forEach(item => item.style.animation = '');
            }
        });
    });

    // --- Scroll Event Listener (Optimized) ---
    window.addEventListener('scroll', () => {
        if (rAFId === null) { // Schedule a new frame if one isn't already pending
            rAFId = requestAnimationFrame(optimizedScrollUpdates);
        }
    });
    optimizedScrollUpdates(); // Initial call to set navbar state and active links


    // --- Typing Effect ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        console.log("Initializing typing effect.");
        const professions = ["Maths Teacher", "Web Developer", "Tech Enthusiast"];
        let typeIndex = 0;
        let charIndex = 0;
        let currentText = '';
        let isDeleting = false;
        const typeSpeed = 120;
        const deleteSpeed = 80;
        const delayBetweenWords = 1500;

        function type() {
            const currentWord = professions[typeIndex];
            if (isDeleting) {
                currentText = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            typingTextElement.textContent = currentText;

            let typeDelay = typeSpeed;
            if (isDeleting) {
                typeDelay = deleteSpeed;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeDelay = delayBetweenWords;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                typeIndex = (typeIndex + 1) % professions.length;
                typeDelay = typeSpeed / 2;
            }
            setTimeout(type, typeDelay);
        }
        type();
    } else {
        console.warn("Typing text element not found.");
    }

    // --- Vanilla Tilt JS Initialization ---
    if (typeof VanillaTilt !== 'undefined') {
        console.log("Initializing VanillaTilt.");
        try {
            VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                max: 8, // Reduced tilt for subtlety
                speed: 400,
                glare: true,
                "max-glare": 0.15 // More subtle glare
            });
        } catch (e) {
            console.error("VanillaTilt initialization error:", e);
        }
    } else {
        console.warn("VanillaTilt library not loaded or no elements with data-tilt.");
    }

    // --- tsParticles Initialization ---
    const particlesContainer = document.getElementById('tsparticles-background');
    if (particlesContainer && typeof tsParticles !== 'undefined') {
        console.log("Initializing tsParticles.");
        try {
            tsParticles.load("tsparticles-background", {
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "grab" },
                        onClick: { enable: true, mode: "push" },
                    },
                    modes: {
                        grab: { distance: 120, links: { opacity: 0.6 } }, // slightly reduced distance
                        push: { quantity: 2 },
                    },
                },
                particles: {
                    color: { value: "#ffffff" },
                    links: { color: "#ffffff", distance: 130, enable: true, opacity: 0.15, width: 1 }, // more subtle links
                    collisions: { enable: false },
                    move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: true, speed: 1, straight: false }, // slower speed
                    number: { density: { enable: true, area: 900 }, value: 40 }, // fewer particles
                    opacity: { value: 0.2 },
                    shape: { type: "circle" },
                    size: { value: { min: 0.5, max: 2 } }, // smaller particles
                },
                detectRetina: true,
            });
        } catch (e) {
            console.error("tsParticles initialization error:", e);
        }
    } else {
        console.warn("tsParticles library or container not found.");
    }


    // --- On-Scroll Animation Logic (IntersectionObserver) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0 && typeof IntersectionObserver !== 'undefined') {
        console.log("Initializing IntersectionObserver for scroll animations.");
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Adjust threshold: 0.1 means 10% visible, 0.2 means 20%
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Apply explicit data-delay if present
                    if (entry.target.dataset.delay && !entry.target.style.transitionDelay) {
                        entry.target.style.transitionDelay = entry.target.dataset.delay;
                    }
                    entry.target.classList.add('is-visible');

                    if (entry.target.classList.contains('skill-item') && !entry.target.dataset.counterAnimated) {
                        const percentageSpan = entry.target.querySelector('.skill-percentage');
                        const progressBar = entry.target.querySelector('.progress-bar'); // Get progress bar
                        if (percentageSpan) {
                            const targetText = percentageSpan.textContent.trim();
                            const targetValue = parseInt(targetText, 10);
                            if (!isNaN(targetValue)) {
                                animateValueCounter(percentageSpan, 0, targetValue, 800 + (targetValue * 8));
                                if (progressBar) { // Animate progress bar width
                                    progressBar.style.width = targetValue + '%';
                                }
                                entry.target.dataset.counterAnimated = 'true';
                            }
                        }
                    }
                    // Optional: Unobserve after first animation to prevent re-animation
                    // observer.unobserve(entry.target); 
                } else {
                    // Optional: To make animations replay if they scroll out and back in
                    // entry.target.classList.remove('is-visible');
                    // entry.target.style.transitionDelay = ''; // Reset delay
                    // if (entry.target.classList.contains('skill-item') && entry.target.dataset.counterAnimated) {
                    //     delete entry.target.dataset.counterAnimated;
                    //     const percentageSpan = entry.target.querySelector('.skill-percentage');
                    //     const progressBar = entry.target.querySelector('.progress-bar');
                    //     if (percentageSpan) percentageSpan.textContent = "0%";
                    //     if (progressBar) progressBar.style.width = '0%';
                    // }
                }
            });
        };

        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        animatedElements.forEach(el => scrollObserver.observe(el));
    } else {
        console.warn("No elements for scroll animation or IntersectionObserver not supported.");
    }
}); // End of DOMContentLoaded


window.addEventListener('load', () => {
    console.log("Window fully loaded (all resources).");
    const loadingOverlay = document.getElementById('loading-overlay');
    const body = document.body;

    function hideLoadingOverlay() {
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            body.classList.remove('loading');
            console.log("Loading overlay hidden.");
        } else {
            console.warn("Loading overlay element not found at window.load.");
            body.classList.remove('loading');
        }
    }

    const maxLoadTime = 3000; // Reduced max load time
    const fallbackTimeout = setTimeout(() => {
        console.warn("Max load time reached, forcing hide of loading overlay.");
        hideLoadingOverlay();
    }, maxLoadTime);

    setTimeout(() => {
        clearTimeout(fallbackTimeout);
        hideLoadingOverlay();
    }, 200); // Reduced delay
});


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

console.log("KLS Portfolio Script Fully Parsed.");