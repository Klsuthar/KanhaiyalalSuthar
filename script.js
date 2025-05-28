// script.js
console.log("script.js started");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired");

    const nav = document.querySelector('nav');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li a');
    const burger = document.querySelector('.burger');
    const sections = document.querySelectorAll('main section');
    const loadingOverlay = document.getElementById('loading-overlay'); // Defined here
    const customCursor = document.querySelector('.custom-cursor');

    if (!loadingOverlay) {
        console.error("CRITICAL: Loading overlay element not found on DOMContentLoaded!");
        // Attempt to hide body's potential overflow if loader was meant to cover it
        // document.body.style.overflow = 'auto'; // Or 'visible'
    } else {
        console.log("Loading overlay found in DOMContentLoaded:", loadingOverlay);
    }

    // --- NAVIGATION ---
    if (burger && navLinksContainer) {
        burger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            const isExpanded = navLinksContainer.classList.contains('nav-active');
            burger.setAttribute('aria-expanded', isExpanded);
        });
    } else {
        console.warn("Burger or navLinksContainer not found for navigation.");
    }

    if (navLinks && navLinksContainer) { // Check navLinksContainer again for safety
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('nav-active')) {
                    navLinksContainer.classList.remove('nav-active');
                    if (burger) burger.classList.remove('toggle');
                    if (burger) burger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }


    // --- SCROLL HANDLING (NAV & ACTIVE LINKS) ---
    function handleScroll() {
        if (!nav || !sections || sections.length === 0) return;

        let currentSectionId = 'home';
        const navHeight = nav.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 50;
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

        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    // --- TYPING EFFECT ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        try {
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
                    typeSpeed = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    professionIndex = (professionIndex + 1) % professions.length;
                    typeSpeed = 500;
                }
                setTimeout(type, typeSpeed);
            }
            setTimeout(type, 1000);
        } catch (e) {
            console.error("Error in Typing Effect:", e);
        }
    } else {
        console.warn("Typing text element not found.");
    }

    // --- VANILLA TILT INITIALIZATION ---
    const tiltElements = document.querySelectorAll('[data-tilt]');
    if (tiltElements.length > 0) {
        if (typeof VanillaTilt !== 'undefined') {
            try {
                VanillaTilt.init(tiltElements, { max: 15, speed: 400, glare: true, "max-glare": 0.2 });
                console.log("VanillaTilt initialized for", tiltElements.length, "elements.");
            } catch (e) {
                console.error("Error initializing VanillaTilt:", e);
            }
        } else {
            console.warn("VanillaTilt library not found, but data-tilt attributes are present.");
        }
    }

    // --- TSPARTICLES INITIALIZATION ---
    const particlesContainer = document.getElementById('tsparticles-background');
    if (particlesContainer) {
        if (typeof tsParticles !== 'undefined' && typeof tsParticles.load === 'function') {
            tsParticles.load("tsparticles-background", {
                fpsLimit: 60,
                interactivity: {
                    events: { onHover: { enable: true, mode: "repulse" }, onClick: { enable: true, mode: "push" }, resize: true },
                    modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
                },
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: "#ffffff" },
                    shape: { type: "circle" },
                    opacity: { value: 0.5 },
                    size: { value: 3, random: true },
                    links: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
                    move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out" }
                },
                detectRetina: true,
            }).then(() => {
                console.log("tsParticles loaded successfully.");
            }).catch(error => {
                console.error("tsParticles loading FAILED:", error);
            });
        } else {
            console.warn("tsParticles library or load function not found, but 'tsparticles-background' element exists.");
        }
    }

    // --- CUSTOM CURSOR LOGIC ---
    if (customCursor) {
        try {
            document.addEventListener('mousemove', (e) => {
                customCursor.style.left = e.clientX + 'px';
                customCursor.style.top = e.clientY + 'px';
            });
            document.querySelectorAll('a, button, .burger, [data-tilt], .contact-item, .social-link')
                .forEach(el => {
                    el.addEventListener('mouseenter', () => customCursor.classList.add('pointer'));
                    el.addEventListener('mouseleave', () => customCursor.classList.remove('pointer'));
                });
        } catch (e) {
            console.error("Error in Custom Cursor Logic:", e);
        }
    } else {
        console.warn("Custom cursor element not found.");
    }

    // --- ON-SCROLL ANIMATION LOGIC ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        try {
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
            const observerCallback = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            };
            const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
            animatedElements.forEach(el => scrollObserver.observe(el));
            console.log("On-scroll animations initialized for", animatedElements.length, "elements.");
        } catch (e) {
            console.error("Error in On-Scroll Animation Logic:", e);
        }
    }
    console.log("DOMContentLoaded event listener finished executing all initializations.");
}); // End DOMContentLoaded


// --- LOADING OVERLAY HIDE ---
// This needs to be robust.
function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        console.log("Attempting to hide loading overlay.");
        // Check if it's already hidden to prevent issues if called multiple times
        if (overlay.style.opacity === '0') {
            console.log("Loading overlay already seems hidden.");
            return;
        }
        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.display = 'none'; // Crucial for removing it from layout
            document.body.style.overflow = 'auto'; // Ensure body is scrollable
            console.log("Loading overlay hidden and body scroll enabled.");
        }, 500); // Minimum display time, adjust as needed
    } else {
        console.error("CRITICAL: Loading overlay element NOT FOUND when trying to hide it via hideLoadingOverlay function.");
        // If overlay isn't found, still try to enable body scroll
        document.body.style.overflow = 'auto';
    }
}

// Call hideLoadingOverlay on window.load
window.addEventListener('load', () => {
    console.log("Window 'load' event fired. All resources should be loaded.");
    hideLoadingOverlay();
});

// Fallback: If 'load' event is unusually delayed or fails for some reason,
// try to hide the loader after a longer timeout from DOMContentLoaded.
// This is a safety net.
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log("Fallback timeout: attempting to hide loader if still visible after 3 seconds.");
        const overlay = document.getElementById('loading-overlay');
        // Check if it's still visible (opacity not 0 or display not none)
        if (overlay && (overlay.style.opacity !== '0' || overlay.style.display !== 'none')) {
            console.warn("Fallback: Loader was still visible. Forcing hide.");
            hideLoadingOverlay();
        }
    }, 3000); // 3 seconds fallback
});


// --- EMAIL CLIENT FUNCTION (Global Scope) ---
function submitViaEmailClient() {
    const email = "klsuthar0987@gmail.com";
    const subject = "Question from Portfolio Website";
    const body = "Hello Kanhaiya,\n\nI have a question:\n\n";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

console.log("script.js finished parsing all code.");