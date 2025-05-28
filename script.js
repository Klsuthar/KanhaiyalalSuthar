console.log("KLS Portfolio Script Initializing...");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed.");
    const body = document.body;
    body.classList.add('loading'); 

    // --- Navigation Logic ---
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links li a');
    const navbar = document.getElementById('navbar');
    const navHeight = navbar.offsetHeight;

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

    // --- Scroll Handling for Navbar and Active Links ---
    const sections = document.querySelectorAll('section[id]');
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 50; 
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
        if (currentSection === '' || (currentSection === 'home' && sections.length > 1 && window.scrollY < sections[1].offsetTop - navHeight - 50)) {
             const homeLink = document.querySelector('.nav-links a[href="#home"]');
             if(homeLink) homeLink.classList.add('active');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

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
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.3,
                scale: 1.03 // Tilt still provides a slight scale, can be set to 1 if no scale is desired
            });
        } catch (e) {
            console.error("VanillaTilt initialization error:", e);
        }
    } else {
        console.warn("VanillaTilt library not loaded.");
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
                            mode: "grab",
                        },
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                    },
                    modes: {
                        grab: {
                            distance: 140,
                             line_linked: { 
                                opacity: 0.7,
                            }
                        },
                        push: {
                            quantity: 2,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: { 
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.2,
                        width: 1,
                    },
                    collisions: {
                        enable: false,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: true,
                        speed: 1.5,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 60,
                    },
                    opacity: {
                        value: 0.3,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 3 },
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

    // --- Custom Cursor Logic Removed ---
    /*
    const customCursor = document.querySelector('.custom-cursor');
    if (customCursor) {
        // ... (rest of the custom cursor logic was here)
    } else {
        console.warn("Custom cursor element not found.");
    }
    */
    console.log("Custom cursor logic has been removed.");


    // --- On-Scroll Animation Logic ---
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
                    entry.target.classList.add('is-visible');
                }
            });
        };

        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        animatedElements.forEach(el => scrollObserver.observe(el));
    } else {
        console.warn("No elements for scroll animation or IntersectionObserver not supported.");
    }
});


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

    const maxLoadTime = 5000; 
    const fallbackTimeout = setTimeout(() => {
        console.warn("Max load time reached, forcing hide of loading overlay.");
        hideLoadingOverlay();
    }, maxLoadTime);

    setTimeout(() => {
        clearTimeout(fallbackTimeout); 
        hideLoadingOverlay();
    }, 300); 
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