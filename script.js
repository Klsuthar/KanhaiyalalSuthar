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


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed.");
    const body = document.body;
    body.classList.add('loading');

    // --- Navigation Logic ---
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links li a');
    const navbar = document.getElementById('navbar');
    const navHeight = navbar.offsetHeight; // Get initial height

    burger.addEventListener('click', () => {
        console.log("Burger clicked.");
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        const isExpanded = navLinks.classList.contains('nav-active');
        burger.setAttribute('aria-expanded', isExpanded);

        // Animate links
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

    // Close mobile nav on link click
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                burger.classList.remove('toggle');
                burger.setAttribute('aria-expanded', 'false');
                navLinkItems.forEach(item => item.style.animation = ''); // Clear animation
            }
        });
    });

    // --- Scroll Handling for Navbar and Active Links ---
    const sections = document.querySelectorAll('section[id]');
    function handleScroll() {
        const currentNavHeight = navbar.offsetHeight; // Get current height, as it might change

        // Navbar style change on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - currentNavHeight - 50; // Adjust offset for better accuracy
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
        // Ensure home is active if at top or no other section matches
        if (currentSection === '' || (currentSection === 'home' && sections.length > 0 && window.scrollY < (sections[0].offsetTop + sections[0].offsetHeight - currentNavHeight - 50))) {
             const homeLink = document.querySelector('.nav-links a[href="#home"]');
             if(homeLink) homeLink.classList.add('active');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call to set active link

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
                typeDelay = typeSpeed / 2; // Speed up start of next word
            }
            setTimeout(type, typeDelay);
        }
        type(); // Start the typing effect
    } else {
        console.warn("Typing text element not found.");
    }

    // --- Vanilla Tilt JS Initialization (Optional, if you use data-tilt) ---
    if (typeof VanillaTilt !== 'undefined') {
        console.log("Initializing VanillaTilt.");
        try {
            // Make sure your HTML elements have the data-tilt attribute
            // e.g., <div class="project-card" data-tilt>...</div>
            VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                max: 10,     // Max tilt rotation (degrees)
                speed: 300,  // Speed of the enter/exit transition
                glare: true, // If possible use glare effect
                "max-glare": 0.2 // Glare opacity (0.1 - 1)
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
                        onHover: {
                            enable: true,
                            mode: "grab", // Changed from "repulse" to "grab" for a common effect
                        },
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                    },
                    modes: {
                        grab: { // Renamed from "repulse"
                            distance: 140,
                            links: { // Renamed from line_linked for tsParticles v2
                                opacity: 0.7, // Corrected property name
                            }
                        },
                        push: {
                            quantity: 2, // Reduced for subtlety
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: { // Updated from line_linked
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.2, // Reduced for subtlety
                        width: 1,
                    },
                    collisions: {
                        enable: false, // Usually false for background particles
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: { // Updated from out_mode
                            default: "bounce",
                        },
                        random: true,
                        speed: 1.2, // Slightly reduced speed
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800, // Corrected from value_area
                        },
                        value: 50, // Reduced particle count for subtlety
                    },
                    opacity: {
                        value: 0.25, // Reduced opacity
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 2.5 }, // Slightly adjusted size
                    },
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
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of the element is visible
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // Check if the intersecting element is a skill-item and if its counter hasn't been animated yet
                    if (entry.target.classList.contains('skill-item') && !entry.target.dataset.counterAnimated) {
                        const percentageSpan = entry.target.querySelector('.skill-percentage');
                        if (percentageSpan) {
                            const targetText = percentageSpan.textContent.trim(); // e.g., "90%"
                            const targetValue = parseInt(targetText, 10); // e.g., 90

                            if (!isNaN(targetValue)) {
                                // Start animation from 0 up to the targetValue
                                // Duration can be adjusted; here it varies slightly with value.
                                animateValueCounter(percentageSpan, 0, targetValue, 800 + (targetValue * 8));
                                entry.target.dataset.counterAnimated = 'true'; // Mark as animated
                            }
                        }
                    }
                    // If you want general animations to only happen once, unobserve after first intersection.
                    // However, for skill items, we've handled one-time animation with dataset.counterAnimated.
                    // To make general scroll animations only occur once:
                    // if (!entry.target.classList.contains('skill-item')) {
                    //    observer.unobserve(entry.target);
                    // }

                } else {
                    // Optional: To make animations replay if they scroll out and back in (remove 'is-visible').
                    // entry.target.classList.remove('is-visible');
                    //
                    // // Optional: Reset counter animation if replaying
                    // if (entry.target.classList.contains('skill-item') && entry.target.dataset.counterAnimated) {
                    //     delete entry.target.dataset.counterAnimated;
                    //     const percentageSpan = entry.target.querySelector('.skill-percentage');
                    //     if (percentageSpan) {
                    //         percentageSpan.textContent = "0%"; // Reset to initial text
                    //     }
                    //     // Also reset progress bar width if you reset this (requires removing inline style from HTML and managing via JS or more complex CSS)
                    //     // const progressBar = entry.target.querySelector('.progress-bar');
                    //     // if(progressBar) progressBar.style.width = '0%';
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
            body.classList.remove('loading'); // Still remove loading class from body
        }
    }

    // Fallback in case something goes wrong or load is extremely long
    const maxLoadTime = 4000; // 4 seconds
    const fallbackTimeout = setTimeout(() => {
        console.warn("Max load time reached, forcing hide of loading overlay.");
        hideLoadingOverlay();
    }, maxLoadTime);

    // Normal hide after a short delay (e.g., 300ms after all resources are loaded)
    // This gives time for initial paints and avoids abrupt transitions
    setTimeout(() => {
        clearTimeout(fallbackTimeout); // Clear the safety fallback
        hideLoadingOverlay();
    }, 300);
});


function submitViaEmailClient(subject = 'General Inquiry') {
    console.log(`Preparing mailto link with subject: ${subject}`);
    const email = 'klsuthar0987@gmail.com'; // Ensure this email is correct
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Hello Kanhaiya,\n\nI would like to discuss...\n\nBest regards,\n[Your Name]')}`;
    try {
        window.location.href = mailtoLink;
    } catch (e) {
        console.error("Error opening mail client:", e);
        // Provide a fallback or copy-to-clipboard option if mailto fails often
        alert("Could not open your email client. Please copy the email address: " + email);
    }
}

console.log("KLS Portfolio Script Fully Parsed.");