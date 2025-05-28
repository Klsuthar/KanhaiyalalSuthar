// script.js

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li a');
    const burger = document.querySelector('.burger');
    const sections = document.querySelectorAll('main section');
    const loadingOverlay = document.getElementById('loading-overlay');
    const customCursor = document.querySelector('.custom-cursor');

    // --- LOADING OVERLAY ---
    window.addEventListener('load', () => {
        setTimeout(() => { // Ensure a minimum display time for the loader
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.visibility = 'hidden';
        }, 500); // Adjust time as needed
    });

    // --- NAVIGATION ---
    // Burger menu toggle
    if (burger) {
        burger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            // ARIA expanded state
            const isExpanded = navLinksContainer.classList.contains('nav-active');
            burger.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Close mobile nav on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('nav-active')) {
                navLinksContainer.classList.remove('nav-active');
                burger.classList.remove('toggle');
                burger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Sticky Nav & Active Link Highlighting
    function updateActiveLink() {
        let currentSectionId = 'home'; // Default to home
        const navHeight = nav.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 50; // Adjusted offset
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Add scrolled class to nav
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call

    // --- TYPING EFFECT ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const professions = ["A Maths Teacher", "A Web Developer", "A Tech Enthusiast"];
        let professionIndex = 0;
        let charIndex = 0;
        let currentText = '';
        let isDeleting = false;

        function type() {
            const currentProfession = professions[professionIndex];
            if (isDeleting) {
                currentText = currentProfession.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = currentProfession.substring(0, charIndex + 1);
                charIndex++;
            }

            typingTextElement.textContent = currentText;

            let typeSpeed = isDeleting ? 75 : 150;

            if (!isDeleting && charIndex === currentProfession.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                professionIndex = (professionIndex + 1) % professions.length;
                typeSpeed = 500; // Pause before typing new
            }

            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 1000); // Initial delay before starting
    }


    // --- VANILLA TILT INITIALIZATION ---
    const tiltElements = document.querySelectorAll('[data-tilt]');
    if (tiltElements.length > 0 && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(tiltElements, {
            max: 15,       // Max tilt rotation (degrees)
            speed: 400,    // Speed of the enter/exit transition
            glare: true,   // If glare should be shown
            "max-glare": 0.2 // Glare opacity (0.1 = 10%)
        });
    } else if (tiltElements.length > 0) {
        console.warn("VanillaTilt library not found, but data-tilt attributes are present.");
    }

    // --- TSPARTICLES INITIALIZATION ---
    const particlesContainer = document.getElementById('tsparticles-background');
    if (particlesContainer && typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles-background", {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse", // grab, bubble, repulse
                    },
                    onClick: {
                        enable: true,
                        mode: "push", // push, remove, bubble
                    },
                    resize: true,
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 200,
                        size: 40,
                        duration: 2,
                        opacity: 0.8,
                        speed: 3
                    },
                    repulse: {
                        distance: 100,
                        duration: 0.4,
                    },
                    push: {
                        particles_nb: 4,
                    },
                    remove: {
                        particles_nb: 2
                    }
                },
            },
            particles: {
                number: {
                    value: 80, // Number of particles
                    density: {
                        enable: true,
                        value_area: 800, // Area where particles will be distributed
                    },
                },
                color: {
                    value: "#ffffff", // Particle color
                },
                shape: {
                    type: "circle", // "circle", "edge", "triangle", "polygon", "star", "image"
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3, // Base size of particles
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                links: {
                    enable: true,
                    distance: 150, // Maximum distance for linking particles
                    color: "#ffffff", // Link color
                    opacity: 0.4,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: 2, // Speed of particle movement
                    direction: "none", // "none", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left"
                    random: false,
                    straight: false,
                    out_mode: "out", // "out", "bounce"
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                },
            },
            detectRetina: true,
        });
    } else if (particlesContainer) {
        console.warn("tsParticles library not found, but 'tsparticles-background' element exists.");
    }

    // --- CUSTOM CURSOR LOGIC ---
    if (customCursor) {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .burger, [data-tilt], .contact-item, .social-link')
            .forEach(el => {
                el.addEventListener('mouseenter', () => customCursor.classList.add('pointer'));
                el.addEventListener('mouseleave', () => customCursor.classList.remove('pointer'));
            });
    }

}); // End DOMContentLoaded

// --- EMAIL CLIENT FUNCTION (Global Scope) ---
function submitViaEmailClient() {
    const email = "klsuthar0987@gmail.com";
    const subject = "Question from Portfolio Website";
    const body = "Hello Kanhaiya,\n\nI have a question:\n\n";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}