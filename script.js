// These gk_ functions seem unrelated to the portfolio's core functionality
// but are kept as they were in the original source.
var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};
function filledCell(cell) {
    return cell !== '' && cell != null;
}
function loadFileData(filename) {
    // Basic check for XLSX library presence if used
    if (gk_isXlsx && gk_xlsxFileLookup[filename] && typeof XLSX !== 'undefined') {
        try {
            var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];
            var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
            var filteredData = jsonData.filter(row => row.some(filledCell));
            var headerRowIndex = filteredData.findIndex((row, index) =>
                index < filteredData.length - 1 && // Ensure there's a next row to compare
                row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
            );
            // Fallback if no clear header found or it's too far down
            if (headerRowIndex === -1 || headerRowIndex > 25 || headerRowIndex >= filteredData.length - 1) {
                // Check if first row looks like a header (more filled cells than second)
                if (filteredData.length > 1 && filteredData[0].filter(filledCell).length >= filteredData[1].filter(filledCell).length) {
                    headerRowIndex = 0;
                } else {
                    // Default to first row if heuristic fails badly
                    headerRowIndex = 0;
                }
                // Simple check if index became negative (shouldn't happen but safety)
                if (headerRowIndex < 0) headerRowIndex = 0;
            }

            var csvSheet = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex));
            var csv = XLSX.utils.sheet_to_csv(csvSheet); // Use default separator
            return csv;
        } catch (e) {
            console.error("Error processing XLSX:", e);
            return "";
        }
    }
    return gk_fileData[filename] || "";
}

// Main Portfolio Script
document.addEventListener('DOMContentLoaded', () => {

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    // Hide on touch AND specific mobile width check
    if (cursor && !isTouchDevice && !isMobile) {
        window.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
        });
        // Apply hover effect only to specified elements
        document.querySelectorAll('a, button, .btn, .card, .contact-item, .social-link, .burger, .logo, .skill').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    } else if (cursor) {
        cursor.style.display = 'none'; // Hide cursor if conditions not met
        document.body.style.cursor = 'auto'; // Ensure default cursor is shown
    }

    // --- Loading Overlay ---
    const hideLoadingOverlay = () => {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            // Start fade out slightly earlier
            setTimeout(() => { overlay.classList.add('hidden'); }, 300);
            // Remove the overlay from DOM after transition to prevent interference
            overlay.addEventListener('transitionend', () => {
                if (overlay.classList.contains('hidden')) {
                    overlay.remove();
                }
            }, { once: true }); // Ensure listener runs only once
        }
    };
    // Use 'load' to wait for all resources, including images and scripts
    window.addEventListener('load', hideLoadingOverlay);
    // Fallback in case load event takes too long
    setTimeout(hideLoadingOverlay, 3000); // Hide after 3 seconds max

    // --- Navigation ---
    const nav = document.querySelector('nav');
    const burger = document.querySelector('.burger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li a');
    const bodyEl = document.body; // Cache body element

    const handleScrollNav = () => {
        // Add/remove 'scrolled' class based on scroll position
        bodyEl.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScrollNav, { passive: true }); // Improve scroll performance
    handleScrollNav(); // Initial check

    if (burger && navLinksContainer) {
        burger.addEventListener('click', () => {
            // Toggle classes for burger animation and menu visibility
            navLinksContainer.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            // Toggle body class to prevent scrolling when menu is open
            bodyEl.classList.toggle('nav-open', navLinksContainer.classList.contains('nav-active'));
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('nav-active')) {
                    navLinksContainer.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    bodyEl.classList.remove('nav-open');
                }
            });
        });
        // Close menu if user clicks outside the nav links area (optional)
        document.addEventListener('click', (event) => {
            if (navLinksContainer.classList.contains('nav-active') && !nav.contains(event.target) && !burger.contains(event.target)) { // Check if click is outside nav AND burger
                navLinksContainer.classList.remove('nav-active');
                burger.classList.remove('toggle');
                bodyEl.classList.remove('nav-open');
            }
        });
    }

    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('section[id]'); // Select sections with IDs
    const highlightSection = () => {
        let current = '';
        const scrollY = window.pageYOffset;

        // Find the section currently in view
        sections.forEach(section => {
            // Adjust offsetTop to trigger highlighting slightly earlier/later
            const sectionTop = section.offsetTop - 100; // Trigger 100px before section top
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // If no section is actively matched (e.g., at the very top/bottom), default to home or contact
        if (!current && scrollY < sections[0].offsetTop - 100) {
            current = 'home';
        } else if (!current && scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
            // Find last section ID dynamically
            const lastSectionId = sections.length > 0 ? sections[sections.length - 1].getAttribute('id') : 'contact';
            current = lastSectionId;
        }


        navLinks.forEach(link => {
            // Check if link's href matches the current section ID
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };
    window.addEventListener('scroll', highlightSection, { passive: true });
    highlightSection(); // Initial highlight check

    // --- Typing Animation ---
    const typeWriter = () => {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;
        const words = ["Maths Teacher", "Tech Enthusiast", "Excel Expert"];
        const colors = ["#f5c518", "#00c4b4", "#ffffff", "#f5c518", "#00c4b4"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const currentColor = colors[wordIndex];
            typingElement.style.color = currentColor;

            // Typing Speeds & Pauses
            const typeSpeed = 120; // Speed of typing characters
            const deleteSpeed = 60; // Speed of deleting characters
            const pauseWord = 1500; // Pause after finishing a word
            const pauseNext = 500;  // Pause before starting next word

            if (isDeleting) {
                // Deleting characters
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    // Finished deleting, move to next word
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    setTimeout(type, pauseNext);
                } else {
                    // Continue deleting
                    setTimeout(type, deleteSpeed);
                }
            } else {
                // Typing characters
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentWord.length) {
                    // Finished typing word, start deleting after pause
                    isDeleting = true;
                    setTimeout(type, pauseWord);
                } else {
                    // Continue typing
                    setTimeout(type, typeSpeed);
                }
            }
        }
        // Start the animation after a short delay
        typingElement.textContent = ''; // Clear initial content
        setTimeout(type, 1200);
    };
    typeWriter();

    // --- Scroll Animations (Intersection Observer for Sections) ---
    const sectionObserverOptions = {
        root: null, // Observe relative to viewport
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate skill bars fill when 'about' section becomes visible (desktop/mobile)
                if (entry.target.id === 'about') {
                    entry.target.querySelectorAll('.skill-progress').forEach((bar) => {
                        setTimeout(() => bar.classList.add('animate'), 500);
                    });
                }
                // Optionally unobserve section after first intersection
                // observer.unobserve(entry.target);
            } else if (!entry.target.classList.contains('no-reanimate')) {
                entry.target.classList.remove('visible');
                if (entry.target.id === 'about') {
                    entry.target.querySelectorAll('.skill-progress.animate').forEach((bar) => {
                        bar.classList.remove('animate');
                    });
                }
            }
        });
    }, sectionObserverOptions);

    // Observe all sections for general visibility fade/transform
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Scroll Animations (Intersection Observer for Mobile Bounce Items) ---
    if (isMobile) {
        const mobileAnimElements = document.querySelectorAll('.card, .contact-item, .skill');

        const mobileObserverOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px', // Trigger slightly before element fully enters viewport bottom
            threshold: 0.1 // Trigger when 10% is visible
        };

        const mobileElementObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-bounce');
                    observer.unobserve(entry.target); // Animate only once
                }
                // No 'else' needed as we unobserve
            });
        }, mobileObserverOptions);

        mobileAnimElements.forEach(el => {
            mobileElementObserver.observe(el);
        });
    }


    // --- Vanilla Tilt Initialization ---
    const tiltElements = document.querySelectorAll('[data-tilt]');
    if (tiltElements.length > 0 && typeof VanillaTilt !== 'undefined') {
        // Initialize tilt only if not touch device AND not mobile width
        if (!isTouchDevice && !isMobile) {
            VanillaTilt.init(tiltElements, {
                max: 10,          // Reduced max tilt angle
                perspective: 1000,
                scale: 1.03,       // Slightly reduced scale
                speed: 400,
                glare: true,
                "max-glare": 0.25  // Reduced glare intensity
            });
        }
    } else if (tiltElements.length > 0) {
        console.warn("VanillaTilt script not loaded or failed to initialize.");
    }

    // --- tsParticles Background Initialization ---
    const particlesContainer = document.getElementById('tsparticles-background');
    if (particlesContainer && typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles-background", {
            // Keep backgroundMode enabled
            backgroundMode: {
                enable: true,
                zIndex: 0
            },
            particles: {
                number: {
                    value: 60, // Slightly fewer particles for potentially better performance
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
                    value: { min: 0.1, max: 0.6 }, // Use range for value
                    animation: { // Corrected structure for v2
                        enable: true,
                        speed: 0.5,
                        minimumValue: 0.1, // Renamed from opacity_min
                        sync: false
                    }
                },
                size: {
                    value: { min: 1, max: 3 }, // Use range for value
                    random: true,
                    animation: {
                        enable: false // Keep size animation disabled
                    }
                },
                links: {
                    enable: true,
                    distance: 150,
                    color: "#555555", // Slightly darker links
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.2, // Slightly slower speed
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: { // Corrected structure for v2
                        default: "out" // Renamed from out_mode
                    },
                    attract: {
                        enable: false
                    }
                }
            },
            interactivity: {
                detectsOn: "canvas", // Renamed from detect_on
                events: {
                    onHover: { // Renamed from onhover
                        enable: true,
                        mode: "repulse"
                    },
                    onClick: { // Renamed from onclick
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    repulse: {
                        distance: 80, // Reduced repulse distance
                        duration: 0.4
                    },
                    push: {
                        quantity: 3 // Renamed from particles_nb, reduced quantity
                    },
                    // Removed grab, bubble, remove modes for simplicity
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
function submitForm() {
    const form = document.getElementById('contact-form');
    // Use optional chaining for safety in case elements don't exist
    const name = document.getElementById('name')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const message = document.getElementById('message')?.value?.trim();

    // Basic Validation
    if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
    }
    // Simple email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Construct mailto link (Ensure the target email is correct)
    const recipientEmail = "klsuthar0987@gmail.com"; // <<<--- CONFIRM YOUR EMAIL HERE
    const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    // Attempt to open mail client
    try {
        // Use window.open for potentially better compatibility than location.href
        const mailWindow = window.open(mailtoLink, '_blank');
        // If window didn't open (popup blocker?), inform user
        if (!mailWindow) {
            alert('Could not open email client automatically. Please copy the details or try again.');
        }
    } catch (e) {
        console.error("Failed to open mailto link:", e);
        alert('An error occurred while trying to open your email client.');
    }

    // Optionally reset the form after a short delay
    setTimeout(() => {
        if (form) form.reset();
    }, 1000); // Reset after 1 second

    // Provide clearer feedback to the user
    alert('Your email application should open shortly to send the message. If it doesn\'t, please check your popup settings or manually send an email to ' + recipientEmail);
}