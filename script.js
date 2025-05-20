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
        // Apply hover effect only to specified elements
        // Note: .card is still here, but its primary animations are CSS-driven or were from VanillaTilt
        document.querySelectorAll('a, button, .btn, .card, .contact-item, .social-link, .burger, .logo, .skill').forEach(el => {
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
        bodyEl.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScrollNav, { passive: true });
    handleScrollNav();

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
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (!current && sections.length > 0 && scrollY < sections[0].offsetTop - 100) {
            current = 'home';
        } else if (!current && sections.length > 0 && scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
            const lastSectionId = sections[sections.length - 1].getAttribute('id');
            current = lastSectionId;
        } else if (!current && sections.length === 0) { // Fallback if no sections
             current = 'home';
        }


        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };
    window.addEventListener('scroll', highlightSection, { passive: true });
    highlightSection();

    // --- Typing Animation ---
    const typeWriter = () => {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;
        const words = ["Maths Teacher", "Tech Enthusiast", "Excel Expert"];
        const colors = ["#f5c518", "#00c4b4", "#ffffff", "#f5c518", "#00c4b4"]; // Ensure enough colors
        let wordIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const currentColor = colors[wordIndex % colors.length]; // Use modulo for safety
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
        typingElement.textContent = '';
        setTimeout(type, 1200);
    };
    typeWriter();

    // --- Scroll Animations (Intersection Observer for Sections) ---
    const sectionObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate OLD skill bars fill when 'about' section becomes visible
                if (entry.target.id === 'about') {
                    // This targets the OLD skill bar structure if it exists.
                    // The new Tailwind skill bars animate via CSS keyframes and are not directly controlled here.
                    entry.target.querySelectorAll('.skill-progress').forEach((bar) => {
                         // Check if it's the old skill bar structure before animating
                        if (!bar.closest('.animated-skills-container')) { // Avoid animating new skill bars here
                            setTimeout(() => bar.classList.add('animate'), 500);
                        }
                    });
                }
                // observer.unobserve(entry.target); // Optional: unobserve after first intersection
            } else if (!entry.target.classList.contains('no-reanimate')) {
                entry.target.classList.remove('visible');
                if (entry.target.id === 'about') {
                    entry.target.querySelectorAll('.skill-progress.animate').forEach((bar) => {
                        if (!bar.closest('.animated-skills-container')) {
                           bar.classList.remove('animate');
                        }
                    });
                }
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Scroll Animations (Intersection Observer for Mobile Bounce Items) ---
    // Card bounce animation was removed as per request. This observer is kept for other elements if needed.
    if (isMobile) {
        // Only selecting .contact-item and .skill for potential mobile animations now.
        // .card was removed from this selector.
        const mobileAnimElements = document.querySelectorAll('.contact-item, .skill'); // .card removed

        const mobileObserverOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const mobileElementObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // entry.target.classList.add('animate-bounce'); // Bounce animation was previously here
                    // If you want a different animation for .contact-item or .skill on mobile, add it here.
                    // For example: entry.target.classList.add('some-mobile-animation');
                    observer.unobserve(entry.target);
                }
            });
        }, mobileObserverOptions);

        mobileAnimElements.forEach(el => {
            mobileElementObserver.observe(el);
        });
    }


    // --- Vanilla Tilt Initialization ---
    // REMOVED: Tilt initialization for cards is no longer needed.
    // const tiltElements = document.querySelectorAll('[data-tilt]'); // Select ALL data-tilt elements
    // if (tiltElements.length > 0 && typeof VanillaTilt !== 'undefined') {
    //     if (!isTouchDevice && !isMobile) {
    //         // Filter out cards if we only want tilt on non-card elements
    //         const nonCardTiltElements = Array.from(tiltElements).filter(el => !el.classList.contains('card'));
    //         if (nonCardTiltElements.length > 0) {
    //            VanillaTilt.init(nonCardTiltElements, { // Initialize only for non-card elements
    //                 max: 10,
    //                 perspective: 1000,
    //                 scale: 1.03,
    //                 speed: 400,
    //                 glare: true,
    //                 "max-glare": 0.25
    //             });
    //         }
    //          // If you still want tilt on .home-image and .contact-item specifically:
            const specificTiltElements = document.querySelectorAll('.home-image, .contact-item');
            if (specificTiltElements.length > 0 && typeof VanillaTilt !== 'undefined') {
                if (!isTouchDevice && !isMobile) {
                     VanillaTilt.init(specificTiltElements, {
                        max: 10,
                        perspective: 1000,
                        scale: 1.03,
                        speed: 400,
                        glare: true,
                        "max-glare": 0.25
                    });
                }
            } else if (specificTiltElements.length > 0) {
                 console.warn("VanillaTilt script not loaded or failed to initialize for specific elements.");
            }
    //     }
    // } else if (tiltElements.length > 0) {
    //     console.warn("VanillaTilt script not loaded or failed to initialize.");
    // }


    // --- tsParticles Background Initialization ---
    const particlesContainer = document.getElementById('tsparticles-background');
    if (particlesContainer && typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles-background", {
            backgroundMode: {
                enable: true,
                zIndex: 0
            },
            particles: {
                number: {
                    value: 60,
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
                    animation: {
                        enable: false
                    }
                },
                links: {
                    enable: true,
                    distance: 150,
                    color: "#555555",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.2,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: {
                        default: "out"
                    },
                    attract: {
                        enable: false
                    }
                }
            },
            interactivity: {
                detectsOn: "canvas",
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse"
                    },
                    onClick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    repulse: {
                        distance: 80,
                        duration: 0.4
                    },
                    push: {
                        quantity: 3
                    },
                }
            },
            detectRetina: true
        }).catch(error => {
            console.error("tsParticles load error:", error);
        });
    } else if (particlesContainer) {
        console.warn("tsParticles library not loaded or #tsparticles-background not found.");
    }

}); // End DOMContentLoaded

// --- Contact Form Submission ---
// This function remains as it's not related to card animations or unnecessary code.
function submitForm() {
    const form = document.getElementById('contact-form'); // Assuming a form with this ID exists
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');

    // Use optional chaining for safety in case elements don't exist
    const name = nameEl?.value?.trim();
    const email = emailEl?.value?.trim();
    const message = messageEl?.value?.trim();

    if (!name || !email || !message) {
        // Consider using a less obtrusive notification than alert if possible
        alert('Please fill in all required fields.');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    const recipientEmail = "klsuthar0987@gmail.com";
    const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    try {
        const mailWindow = window.open(mailtoLink, '_blank');
        if (!mailWindow) {
            alert('Could not open email client automatically. Please copy the details or try again.');
        }
    } catch (e) {
        console.error("Failed to open mailto link:", e);
        alert('An error occurred while trying to open your email client.');
    }

    setTimeout(() => {
        if (form) form.reset(); // Reset form if it exists
    }, 1000);

    alert('Your email application should open shortly to send the message. If it doesn\'t, please check your popup settings or manually send an email to ' + recipientEmail);
}