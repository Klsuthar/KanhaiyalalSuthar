// Main Portfolio Script
document.addEventListener('DOMContentLoaded', () => {

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    if (cursor && !isTouchDevice && !isMobile) {
        window.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
        });
        // Apply hover effect to specified elements
        document.querySelectorAll('a, button, .btn, .card.uiverse-style, .skill-card-item, .contact-item, .social-link, .burger, .logo, .about-image, .home-image').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    } else if (cursor) {
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // --- Navigation ---
    const nav = document.querySelector('nav');
    const burger = document.querySelector('.burger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li a');
    const bodyEl = document.body;

    const handleScrollNav = () => {
        if (window.scrollY > 50) {
            bodyEl.classList.add('scrolled');
        } else {
            bodyEl.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScrollNav, { passive: true });
    handleScrollNav(); // Initial check

    if (burger && navLinksContainer) {
        burger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            bodyEl.classList.toggle('nav-open', navLinksContainer.classList.contains('nav-active'));
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('nav-active')) {
                    navLinksContainer.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    bodyEl.classList.remove('nav-open');
                }
            });
        });
        // Close nav if clicked outside on mobile
        document.addEventListener('click', (event) => {
            if (navLinksContainer.classList.contains('nav-active') && !nav.contains(event.target) && !burger.contains(event.target)) {
                navLinksContainer.classList.remove('nav-active');
                burger.classList.remove('toggle');
                bodyEl.classList.remove('nav-open');
            }
        });
    }

    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const highlightSection = () => {
        let current = 'home'; // Default to home
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjusted offset
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Check if at the very bottom of the page
        if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 100 && sections.length > 0) {
             current = sections[sections.length - 1].getAttribute('id');
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', highlightSection, { passive: true });
    highlightSection(); // Initial check

    // --- Typing Animation ---
    const typeWriter = () => {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;
        const words = ["Maths Teacher", "Tech Enthusiast", "Excel Expert", "Quick Learner"];
        const colors = ["#f5c518", "#00c4b4", "#ffffff", "#f5c518", "#00c4b4", "#e0e0e0"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const currentColor = colors[wordIndex % colors.length];
            typingElement.style.color = currentColor;

            const typeSpeed = 120;
            const deleteSpeed = 60;
            const pauseWord = 1500;
            const pauseNext = 500;

            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    setTimeout(type, pauseNext);
                } else {
                    setTimeout(type, deleteSpeed);
                }
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentWord.length) {
                    isDeleting = true;
                    setTimeout(type, pauseWord);
                } else {
                    setTimeout(type, typeSpeed);
                }
            }
        }
        typingElement.textContent = ''; // Clear initial content
        setTimeout(type, 1200); // Initial delay
    };
    typeWriter();

    // --- Scroll Animations (Intersection Observer for Sections & Elements) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Lower threshold for earlier trigger
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Staggered animation for resume cards
                if (entry.target.classList.contains('uiverse-style') || entry.target.classList.contains('skill-card-item') || entry.target.classList.contains('contact-item')) {
                    // Calculate delay based on its position in the grid or list
                    // This is a simple way; for complex grids, you might need more specific indexing
                    const delay = (entry.target.dataset.cardIndex || index) * 100; // 100ms stagger
                    entry.target.style.transitionDelay = `${delay}ms`;
                }

                // Animate OLD skill bars (if they exist and are not the new Tailwind ones)
                if (entry.target.id === 'about') {
                    entry.target.querySelectorAll('.skill-progress').forEach((bar) => {
                        if (!bar.closest('.animated-skills-container')) { // Exclude new skill bars
                            setTimeout(() => bar.classList.add('animate'), 500 + index * 100); // Stagger old skill bars too
                        }
                    });
                }
                 // observer.unobserve(entry.target); // Optional: unobserve after first intersection if no re-animation needed
            } else if (!entry.target.classList.contains('no-reanimate')) { // For re-animation on scroll up
                entry.target.classList.remove('visible');
                entry.target.style.transitionDelay = '0ms'; // Reset delay
                if (entry.target.id === 'about') {
                    entry.target.querySelectorAll('.skill-progress.animate').forEach((bar) => {
                        if (!bar.closest('.animated-skills-container')) {
                           bar.classList.remove('animate');
                        }
                    });
                }
            }
        });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
        sectionObserver.observe(section);
        // Observe individual cards within sections for staggered animation
        section.querySelectorAll('.card.uiverse-style, .skill-card-item, .contact-item').forEach((card, cardIndex) => {
            card.dataset.cardIndex = cardIndex; // Add an index for staggering
            sectionObserver.observe(card);
        });
    });


    // --- Vanilla Tilt Initialization ---
    // Initialize tilt for elements with data-tilt attribute
    // Ensure VanillaTilt is loaded before this script or use a load event listener for it
    if (typeof VanillaTilt !== 'undefined') {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        if (!isTouchDevice && !isMobile && tiltElements.length > 0) {
            VanillaTilt.init(tiltElements, {
                max: 8, // Reduced max tilt
                perspective: 1000,
                scale: 1.02, // Reduced scale
                speed: 400,
                glare: true,
                "max-glare": 0.15 // Reduced glare
            });
        }
    } else {
        console.warn("VanillaTilt script not loaded or failed to initialize.");
    }


    // --- tsParticles Background Initialization ---
    const particlesContainer = document.getElementById('tsparticles-background');
    if (particlesContainer && typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles-background", {
            backgroundMode: {
                enable: true,
                zIndex: 0 // Ensure it's behind content
            },
            particles: {
                number: {
                    value: isMobile ? 30 : 60, // Fewer particles on mobile
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ["#f5c518", "#00c4b4", "#ffffff"]
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: { min: 0.1, max: 0.6 },
                    animation: {
                        enable: true,
                        speed: 0.5,
                        minimumValue: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: { min: 1, max: 3 },
                    random: true,
                },
                links: {
                    enable: true,
                    distance: 150,
                    color: "#555555", // Darker link color
                    opacity: 0.3, // More subtle links
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.0, // Slightly slower particle speed
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: {
                        default: "out" // Particles disappear when they go out of bounds
                    }
                }
            },
            interactivity: {
                detectsOn: "canvas",
                events: {
                    onHover: {
                        enable: !isTouchDevice, // Disable hover on touch devices
                        mode: "repulse"
                    },
                    onClick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true // Ensure particles adapt to resize
                },
                modes: {
                    repulse: {
                        distance: 70, // Smaller repulse distance
                        duration: 0.4
                    },
                    push: {
                        quantity: 2 // Push fewer particles
                    },
                }
            },
            detectRetina: true // For sharper particles on high-DPI screens
        }).catch(error => {
            console.error("tsParticles load error:", error);
        });
    } else if (particlesContainer) {
        console.warn("tsParticles library not loaded or #tsparticles-background not found.");
    }

    // --- Loading Overlay ---
    // Hide loading overlay after a delay or when content is loaded
    // This is a simple timeout, for more robust loading, listen to window.onload or specific asset loads
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        // Fallback if other load events are not reliable
         setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 1500); // Adjust time as needed

        window.addEventListener('load', () => {
             loadingOverlay.classList.add('hidden');
        });
    }


}); // End DOMContentLoaded


// --- Contact Form Submission (using mailto, no actual form submission to server) ---
// This function is designed to open the user's default email client.
// It's not actually submitting a form via HTTP.
// If you had a <form id="contact-form">, this function would be attached to its submit event.
// Since there's no form in the HTML, this function is currently not directly used by an event listener.
// It's kept here for completeness if a form were to be added.
function submitViaEmailClient() { // Renamed for clarity
    // Assuming you have input fields with these IDs if you were to add a form:
    const nameEl = document.getElementById('form-name'); // Example ID
    const emailEl = document.getElementById('form-email'); // Example ID
    const messageEl = document.getElementById('form-message'); // Example ID

    // Use optional chaining for safety in case elements don't exist
    const name = nameEl?.value?.trim();
    const email = emailEl?.value?.trim();
    const message = messageEl?.value?.trim();

    // Basic validation if elements exist
    if (nameEl && emailEl && messageEl) { // Check if form elements are actually present
        if (!name || !email || !message) {
            alert('Please fill in all required fields if using a form.'); // User-friendly message
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address if using a form.');
            return;
        }
    }


    const recipientEmail = "klsuthar0987@gmail.com";
    // If form fields are present and filled, use them, otherwise use a generic subject/body
    const subject = name ? encodeURIComponent(`Portfolio Contact: ${name}`) : encodeURIComponent("Portfolio Inquiry");
    const body = (name && email && message)
        ? encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
        : encodeURIComponent("I'd like to get in touch regarding your portfolio.");

    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    try {
        const mailWindow = window.open(mailtoLink, '_blank');
        if (!mailWindow && !isMobile) { // On desktop, if it fails, provide feedback
            alert('Could not open email client automatically. Please copy the email address: ' + recipientEmail);
        }
        // On mobile, window.open for mailto often works seamlessly or the OS handles it.
    } catch (e) {
        console.error("Failed to open mailto link:", e);
        if (!isMobile) {
            alert('An error occurred. Please manually send an email to ' + recipientEmail);
        }
    }

    // If there was a form, you might reset it:
    // const form = document.getElementById('contact-form');
    // if (form) setTimeout(() => form.reset(), 1000);

    // The "CLICK HERE TO EMAIL ME" button already uses a direct mailto link, so this JS function
    // is more for a scenario where you have an actual <form> element.
}
