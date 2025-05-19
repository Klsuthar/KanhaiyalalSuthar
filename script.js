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
    if (cursor && !isTouchDevice && !isMobile) {
        window.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
        });
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

        if (!current && scrollY < sections[0].offsetTop - 100) {
            current = 'home';
        } else if (!current && scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
            const lastSectionId = sections.length > 0 ? sections[sections.length - 1].getAttribute('id') : 'contact';
            current = lastSectionId;
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
        const colors = ["#f5c518", "#00c4b4", "#ffffff", "#f5c518", "#00c4b4"]; // Ensure enough colors for words
        let wordIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const currentColor = colors[wordIndex % colors.length]; // Cycle through colors
            typingElement.style.color = currentColor;

            const typeSpeed = 100;    // Faster typing
            const deleteSpeed = 50;   // Faster deleting
            const pauseWord = 1300;   // Shorter pause after word
            const pauseNext = 400;    // Shorter pause before next word

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
        setTimeout(type, 1000); // Slightly shorter initial delay
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
                if (entry.target.id === 'about') {
                    entry.target.querySelectorAll('.skill-progress').forEach((bar) => {
                        // Delay skill bar animation slightly after section is visible
                        setTimeout(() => bar.classList.add('animate'), 300);
                    });
                }
                // observer.unobserve(entry.target); // Uncomment to animate sections only once
            } else if (!entry.target.classList.contains('no-reanimate')) { // Add 'no-reanimate' class to a section to prevent it from hiding
                entry.target.classList.remove('visible');
                if (entry.target.id === 'about') {
                    entry.target.querySelectorAll('.skill-progress.animate').forEach((bar) => {
                        bar.classList.remove('animate');
                    });
                }
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Scroll Animations (Intersection Observer for Mobile Bounce Items) ---
    if (isMobile) {
        const mobileAnimElements = document.querySelectorAll('.card, .contact-item, .skill');
        const mobileObserverOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        const mobileElementObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-bounce');
                    observer.unobserve(entry.target);
                }
            });
        }, mobileObserverOptions);
        mobileAnimElements.forEach(el => {
            mobileElementObserver.observe(el);
        });
    }

    // --- Vanilla Tilt Initialization ---
    const tiltElements = document.querySelectorAll('[data-tilt]');
    if (tiltElements.length > 0 && typeof VanillaTilt !== 'undefined') {
        if (!isTouchDevice && !isMobile) {
            VanillaTilt.init(tiltElements, {
                max: 8,           // Slightly reduced max tilt
                perspective: 1000,
                scale: 1.02,      // Slightly reduced scale
                speed: 300,       // Slightly faster
                glare: true,
                "max-glare": 0.2  // Slightly reduced glare
            });
        }
    } else if (tiltElements.length > 0) {
        console.warn("VanillaTilt script not loaded or failed to initialize.");
    }

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
                    value: 45, // Reduced particle count
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ["#f5c518", "#00c4b4", "#ffffff"]
                },
                shape: { type: "circle" },
                opacity: {
                    value: { min: 0.1, max: 0.5 }, // Slightly reduced max opacity
                    animation: {
                        enable: true,
                        speed: 0.6, // Slightly faster opacity animation
                        minimumValue: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: { min: 1, max: 2.5 }, // Slightly smaller max size
                    random: true,
                    animation: { enable: false }
                },
                links: {
                    enable: true,
                    distance: 130, // Reduced link distance
                    color: "#555555",
                    opacity: 0.35, // Slightly reduced opacity
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1, // Reduced speed
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: { default: "out" },
                    attract: { enable: false }
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
                        distance: 70, // Reduced repulse distance
                        duration: 0.4
                    },
                    push: {
                        quantity: 2 // Reduced push quantity
                    }
                }
            },
            detectRetina: true
        }).catch(error => {
            console.error("tsParticles load error:", error);
        });
    } else if (particlesContainer) {
        console.warn("tsParticles library not loaded or #tsparticles-background not found.");
    }

    // Hide loading overlay after everything is set up
    // The CSS transition handles the actual fade-out timing
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        // Ensure a minimum display time for the loader, then hide
        // The CSS transition delay (0.4s) + transition duration (0.6s) = 1s total for fade
        // JS can just add the class.
         window.addEventListener('load', () => { // Wait for all resources
            setTimeout(() => { // Optional: ensure loader shows for a tiny bit even if load is super fast
                loadingOverlay.classList.add('hidden');
            }, 200); // e.g., 200ms grace period
        });
    }


}); // End DOMContentLoaded

// --- Contact Form Submission ---
function submitForm() {
    const form = document.getElementById('contact-form');
    const name = document.getElementById('name')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const message = document.getElementById('message')?.value?.trim();

    if (!name || !email || !message) {
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
             // Fallback for browsers that block mailto via window.open or if it fails
            window.location.href = mailtoLink;
        }
         // Provide feedback after attempting to open, not contingent on mailWindow success
        alert('Your email application should open shortly. If it doesn\'t, please check your popup/browser settings or manually send an email to ' + recipientEmail);

    } catch (e) {
        console.error("Failed to open mailto link:", e);
        // Fallback if window.open is blocked by very strict policies
        try {
            window.location.href = mailtoLink;
            alert('Your email application should open shortly. If it doesn\'t, please check your popup/browser settings or manually send an email to ' + recipientEmail);
        } catch (finalError) {
            console.error("Fallback to window.location.href also failed:", finalError);
            alert('An error occurred. Please manually send an email to ' + recipientEmail);
        }
    }

    setTimeout(() => {
        if (form) form.reset();
    }, 1000);
}