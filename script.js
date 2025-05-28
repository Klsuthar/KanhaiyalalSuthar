// script.js
console.log("Script.js: Initializing");

document.addEventListener('DOMContentLoaded', () => {
    console.log("Script.js: DOMContentLoaded event fired");
    document.body.classList.add('loading'); // Add class to body for initial overflow control

    const nav = document.querySelector('nav');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li a');
    const burger = document.querySelector('.burger');
    const sections = document.querySelectorAll('main section');
    const loadingOverlay = document.getElementById('loading-overlay');
    const customCursor = document.querySelector('.custom-cursor');

    if (!loadingOverlay) {
        console.error("CRITICAL: Loading overlay element not found on DOMContentLoaded!");
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
        console.warn("Burger or navLinksContainer not found.");
    }

    if (navLinks && navLinksContainer) {
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
        if (!nav || !sections || sections.length === 0) {
            return;
        }
        let currentSectionId = 'home';
        const navHeight = nav.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 70;
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
    handleScroll();

    // --- TYPING EFFECT ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        try {
            const professions = ["A Maths Teacher", "A Web Developer", "A Tech Enthusiast"];
            let professionIndex = 0;
            let charIndex = 0;
            let currentText = "";
            let isDeleting = false;
            let typeTimeout; 

            function type() {
                clearTimeout(typeTimeout); 

                const currentProfession = professions[professionIndex];
                
                if (isDeleting) {
                    currentText = currentProfession.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    currentText = currentProfession.substring(0, charIndex + 1);
                    charIndex++;
                }

                typingTextElement.textContent = currentText;
                let typeSpeed = isDeleting ? 60 : 120;

                if (!isDeleting && charIndex === currentProfession.length) {
                    typeSpeed = 1800; 
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    professionIndex = (professionIndex + 1) % professions.length;
                    currentText = ""; 
                    typeSpeed = 300; 
                }
                typeTimeout = setTimeout(type, typeSpeed);
            }
            typeTimeout = setTimeout(type, 800); 
        } catch (e) {
            console.error("Error in Typing Effect:", e);
            if(typingTextElement) typingTextElement.textContent = "A Maths Teacher"; 
        }
    } else {
        console.warn("Typing text element not found.");
    }

    // --- VANILLA TILT INITIALIZATION ---
    // const tiltElements = document.querySelectorAll('[data-tilt]'); // No longer needed if data-tilt is removed
    // if (tiltElements.length > 0) {
    //     if (typeof VanillaTilt !== 'undefined') {
    //         try {
    //             VanillaTilt.init(tiltElements, { max: 10, speed: 300, glare: true, "max-glare": 0.15 });
    //             console.log("VanillaTilt initialized for", tiltElements.length, "elements.");
    //         } catch (e) {
    //             console.error("Error initializing VanillaTilt:", e);
    //         }
    //     } else {
    //         console.warn("VanillaTilt library not found, but data-tilt attributes are present.");
    //     }
    // } else {
    //    console.log("No elements with data-tilt found for VanillaTilt initialization.");
    // }

    // --- TSPARTICLES INITIALIZATION ---
    const particlesContainer = document.getElementById('tsparticles-background');
    if (particlesContainer) {
        if (typeof tsParticles !== 'undefined' && typeof tsParticles.load === 'function') {
            tsParticles.load("tsparticles-background", {
                fpsLimit: 60, interactivity: {events: {onHover: {enable: true, mode: "repulse"}, onClick: {enable: true, mode: "push"}, resize: true}, modes: {repulse: {distance: 100, duration: 0.4}, push: {particles_nb: 4}}}, particles: {number: {value: 60, density: {enable: true, value_area: 700}}, color: {value: "#ffffff"}, shape: {type: "circle"}, opacity: {value: 0.4}, size: {value: 2.5, random: true}, links: {enable: true, distance: 120, color: "#ffffff", opacity: 0.3, width: 1}, move: {enable: true, speed: 1.5, direction: "none", random: false, straight: false, out_mode: "out"}}, detectRetina: true
            }).then(() => console.log("tsParticles loaded successfully."))
              .catch(error => console.error("tsParticles loading FAILED:", error));
        } else {
            console.warn("tsParticles library or load function not found.");
        }
    }

    // --- CUSTOM CURSOR LOGIC ---
    if (customCursor) {
        try {
            document.addEventListener('mousemove', (e) => {
                customCursor.style.left = e.clientX + 'px';
                customCursor.style.top = e.clientY + 'px';
            });
            document.querySelectorAll('a, button, .burger, input, textarea, select, .contact-item, .social-link') // Removed [data-tilt]
                .forEach(el => {
                    el.addEventListener('mouseenter', () => customCursor.classList.add('pointer'));
                    el.addEventListener('mouseleave', () => customCursor.classList.remove('pointer'));
                });
        } catch (e) {
            console.error("Error in Custom Cursor Logic:", e);
        }
    }

    // --- ON-SCROLL ANIMATION LOGIC ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        try {
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 }; 
            const observerCallback = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            };
            const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
            animatedElements.forEach(el => {
                scrollObserver.observe(el);
            });
            console.log("On-scroll animations initialized for", animatedElements.length, "elements.");
        } catch (e) {
            console.error("Error in On-Scroll Animation Logic:", e);
            animatedElements.forEach(el => el.classList.add('is-visible'));
        }
    }
    console.log("Script.js: DOMContentLoaded initializations finished.");
}); // End DOMContentLoaded


// --- LOADING OVERLAY HIDE ---
function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay && !overlay.classList.contains('hidden')) {
        console.log("Script.js: Attempting to hide loading overlay.");
        setTimeout(() => { 
            overlay.classList.add('hidden');
            document.body.classList.remove('loading'); 
            console.log("Script.js: Loading overlay hidden and body scroll enabled.");
        }, 300); 
    } else if (overlay && overlay.classList.contains('hidden')) {
         document.body.classList.remove('loading'); 
    } else {
        console.error("CRITICAL: Loading overlay element NOT FOUND when trying to hide.");
        document.body.classList.remove('loading'); 
    }
}

window.addEventListener('load', () => {
    console.log("Script.js: Window 'load' event fired.");
    hideLoadingOverlay();
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const overlay = document.getElementById('loading-overlay');
        if (overlay && !overlay.classList.contains('hidden')) {
            console.warn("Script.js Fallback: Loader was still visible. Forcing hide.");
            hideLoadingOverlay();
        }
    }, 3500); 
});

function submitViaEmailClient() {
    const email = "klsuthar0987@gmail.com";
    const subject = "Question from Portfolio Website";
    const body = "Hello Kanhaiya,\n\nI have a question:\n\n";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

console.log("Script.js: Script fully parsed.");