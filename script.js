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
        let current = 'home';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
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
    highlightSection();

    // --- Typing Animation ---
    const typeWriter = () => {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;
        const words = ["Maths Teacher", "Tech Enthusiast", "Excel Expert", "Quick Learner"];
        // Light Theme Colors for typing animation (darker accents and grays)
        const colors = ["#c87f0a", "#008d80", "#4a5568", "#d97706", "#007567", "#718096"]; 
        let wordIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const currentColor = colors[wordIndex % colors.length];
            typingElement.style.color = currentColor; // This ensures dynamic color change

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

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('uiverse-style') || entry.target.classList.contains('skill-card-item') || entry.target.classList.contains('contact-item')) {
                    const delay = (entry.target.dataset.cardIndex || index) * 100;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
                if (entry.target.id === 'about') {
                    entry.target.querySelectorAll('.skill-progress').forEach((bar) => {
                        if (!bar.closest('.animated-skills-container')) {
                            setTimeout(() => bar.classList.add('animate'), 500 + index * 100);
                        }
                    });
                }
            } else if (!entry.target.classList.contains('no-reanimate')) {
                entry.target.classList.remove('visible');
                entry.target.style.transitionDelay = '0ms';
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
        section.querySelectorAll('.card.uiverse-style, .skill-card-item, .contact-item').forEach((card, cardIndex) => {
            card.dataset.cardIndex = cardIndex;
            sectionObserver.observe(card);
        });
    });

    // --- Vanilla Tilt Initialization ---
    if (typeof VanillaTilt !== 'undefined') {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        if (!isTouchDevice && !isMobile && tiltElements.length > 0) {
            VanillaTilt.init(tiltElements, {
                max: 8,
                perspective: 1000,
                scale: 1.02,
                speed: 400,
                glare: true,
                "max-glare": 0.1 // Reduced glare for light theme
            });
        }
    } else {
        console.warn("VanillaTilt script not loaded or failed to initialize.");
    }

    // --- tsParticles Background Initialization (Light Theme) ---
    const particlesContainer = document.getElementById('tsparticles-background');
    if (particlesContainer && typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles-background", {
            backgroundMode: {
                enable: true,
                zIndex: 0
            },
            particles: {
                number: {
                    value: isMobile ? 25 : 50, // Fewer particles for light theme, can be distracting
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    // Darker, more subtle colors for particles on light background
                    value: ["#a0aec0", "#718096", "#4a5568"] // Shades of gray/blue-gray
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: { min: 0.2, max: 0.6 }, // Slightly more opaque to be visible
                    animation: {
                        enable: true,
                        speed: 0.6,
                        minimumValue: 0.2,
                        sync: false
                    }
                },
                size: {
                    value: { min: 1, max: 2.5 }, // Slightly smaller
                    random: true,
                },
                links: {
                    enable: true,
                    distance: 160,
                    color: "#cbd5e0", // Light gray links
                    opacity: 0.3,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 0.8, // Slower speed
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: {
                        default: "out"
                    }
                }
            },
            interactivity: {
                detectsOn: "canvas",
                events: {
                    onHover: {
                        enable: !isTouchDevice,
                        mode: "grab" // Changed from repulse to grab for a softer effect
                    },
                    onClick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: { // Grab mode configuration
                        distance: 100,
                        links: {
                           opacity: 0.5 // Links become slightly more visible on grab
                        }
                    },
                    repulse: { // Kept if needed, but grab is used for hover
                        distance: 60,
                        duration: 0.4
                    },
                    push: {
                        quantity: 2
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

    // --- Loading Overlay ---
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
         setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 1500);
        window.addEventListener('load', () => { // Fallback for hiding if above timeout is too short
             loadingOverlay.classList.add('hidden');
        });
    }

    // --- Function to change profile image on mobile ---
    const adaptProfileImage = () => {
        const profileImgElement = document.getElementById('profileImage');
        if (!profileImgElement) {
            // console.warn('Profile image element with ID "profileImage" not found.'); // Optional: uncomment for debugging
            return;
        }

        const mobileImagePath = 'images/profile_small.png';
        const desktopImagePath = 'images/profile.png'; // Your default large image

        if (window.matchMedia("(max-width: 768px)").matches) {
            // Only change if the current src is not already the mobile one
            if (profileImgElement.src.endsWith(desktopImagePath) || !profileImgElement.src.endsWith(mobileImagePath)) {
                const tempImg = new Image();
                tempImg.onload = () => { 
                    profileImgElement.src = mobileImagePath;
                };
                tempImg.onerror = () => { 
                    console.warn(`Mobile profile image not found at: ${mobileImagePath}. Keeping default or current.`);
                    // If small image fails, and current is not desktop, set to desktop as a fallback
                    if (!profileImgElement.src.endsWith(desktopImagePath)) {
                        profileImgElement.src = desktopImagePath;
                    }
                };
                tempImg.src = mobileImagePath; 
            }
        } else {
            // On larger screens, ensure the desktop image is shown
            // Only change if it's not already the desktop one
            if (!profileImgElement.src.endsWith(desktopImagePath)) {
                const tempDesktopImg = new Image();
                tempDesktopImg.onload = () => {
                    profileImgElement.src = desktopImagePath;
                };
                tempDesktopImg.onerror = () => {
                    console.warn(`Desktop profile image not found at: ${desktopImagePath}.`);
                    // If desktop image fails (unlikely if it's the default), what to do?
                    // For now, it will just keep whatever src it had.
                };
                tempDesktopImg.src = desktopImagePath;
            }
        }
    };

    // Call the function on initial load
    adaptProfileImage();

    // Optional: Call it also on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            adaptProfileImage();
        }, 250); // Debounce for 250ms
    });

}); // End DOMContentLoaded


// --- Contact Form Submission (using mailto, no actual form submission to server) ---
function submitViaEmailClient() {
    const nameEl = document.getElementById('form-name');
    const emailEl = document.getElementById('form-email');
    const messageEl = document.getElementById('form-message');
    const name = nameEl?.value?.trim();
    const email = emailEl?.value?.trim();
    const message = messageEl?.value?.trim();

    // Basic validation if elements exist
    if (nameEl && emailEl && messageEl) {
        if (!name || !email || !message) {
            alert('Please fill in all required fields if using a form.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address if using a form.');
            return;
        }
    }

    const recipientEmail = "klsuthar0987@gmail.com";
    const subject = name ? encodeURIComponent(`Portfolio Contact: ${name}`) : encodeURIComponent("Portfolio Inquiry");
    const body = (name && email && message)
        ? encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
        : encodeURIComponent("I'd like to get in touch regarding your portfolio.");
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    try {
        const mailWindow = window.open(mailtoLink, '_blank');
        const isMobileCheck = window.matchMedia("(max-width: 768px)").matches; // Re-check for mobile here if not globally available
        if (!mailWindow && !isMobileCheck) { 
            alert('Could not open email client automatically. Please copy the email address: ' + recipientEmail);
        }
    } catch (e) {
        console.error("Failed to open mailto link:", e);
        const isMobileCheck = window.matchMedia("(max-width: 768px)").matches;
        if (!isMobileCheck) {
            alert('An error occurred. Please manually send an email to ' + recipientEmail);
        }
    }
}