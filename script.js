// These gk_ functions seem unrelated to the portfolio's core functionality
// but are kept as they were in the original source if needed elsewhere.
var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};
function filledCell(cell) {
    return cell !== '' && cell != null;
}
function loadFileData(filename) {
    if (gk_isXlsx && gk_xlsxFileLookup[filename] && typeof XLSX !== 'undefined') {
        try {
            var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];
            var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
            var filteredData = jsonData.filter(row => row.some(filledCell));
            var headerRowIndex = filteredData.findIndex((row, index) =>
                index < filteredData.length - 1 &&
                row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
            );
            if (headerRowIndex === -1 || headerRowIndex > 25 || headerRowIndex >= filteredData.length - 1) {
                if (filteredData.length > 1 && filteredData[0].filter(filledCell).length >= filteredData[1].filter(filledCell).length) {
                    headerRowIndex = 0;
                } else {
                    headerRowIndex = 0;
                }
                if (headerRowIndex < 0) headerRowIndex = 0;
            }
            var csvSheet = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex));
            var csv = XLSX.utils.sheet_to_csv(csvSheet);
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
    // const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0); // Kept if other touch-specific logic is added later

    // --- Removed Custom Cursor Logic ---

    // --- Removed Loading Overlay Logic ---
    // The loading overlay HTML and its CSS are removed, so no JS needed.
    // Body fadeInBody animation is also removed from CSS for faster perceived load.

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
        // Colors can be simplified or removed if not desired
        const colors = ["#f5c518", "#00c4b4", "#ffffff"]; // Ensure this matches CSS if styles are applied there
        let wordIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            // typingElement.style.color = colors[wordIndex % colors.length]; // Apply color if needed

            // Typing Speeds & Pauses - can be made faster
            const typeSpeed = 100; // Faster typing
            const deleteSpeed = 50;  // Faster deleting
            const pauseWord = 1200; // Shorter pause
            const pauseNext = 300;   // Shorter pause

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
        setTimeout(type, 800); // Start a bit sooner
    };
    typeWriter();

    // --- Scroll Animations (Intersection Observer for Sections simple fade-in) ---
    const sectionObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is visible for fade-in
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Skill bars animation is removed from JS, width set directly in HTML or via CSS if preferred
                // observer.unobserve(entry.target); // Uncomment to animate only once
            } else {
                // Optional: remove 'visible' class if you want elements to fade out when scrolled out of view
                // entry.target.classList.remove('visible');
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Removed Mobile Bounce Animation Logic ---
    // The .animate-bounce class and its keyframes are removed from CSS.

    // --- Removed Vanilla Tilt Initialization ---
    // VanillaTilt script is removed from HTML.

    // --- Removed tsParticles Background Initialization ---
    // tsParticles script and its container are removed from HTML.

}); // End DOMContentLoaded

// --- Contact Form Submission (Kept as is, uses mailto link) ---
// This function does not involve animations and is part of core functionality.
function submitForm() {
    const form = document.getElementById('contact-form'); // This ID is not in the provided HTML.
                                                            // If there's no actual form, this function might not be fully utilized
                                                            // or is intended for a future form.
                                                            // The current contact method is a direct mailto link.
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');

    // This part of the function will only work if a form with these input IDs exists.
    // Based on the provided HTML, there isn't such a form.
    // The "CLICK HERE TO EMAIL ME" button is a direct mailto link.
    // If you intend to add a form, ensure the IDs match.

    if (nameEl && emailEl && messageEl) { // Check if form elements exist
        const name = nameEl.value?.trim();
        const email = emailEl.value?.trim();
        const message = messageEl.value?.trim();

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
                alert('Could not open email client automatically. Please copy the details or try again.');
            }
        } catch (e) {
            console.error("Failed to open mailto link:", e);
            alert('An error occurred while trying to open your email client.');
        }

        setTimeout(() => {
            if (form) form.reset();
        }, 1000);

        alert('Your email application should open shortly to send the message. If it doesn\'t, please check your popup settings or manually send an email to ' + recipientEmail);
    } else {
        // This part will be executed if the form elements are not found.
        // console.log("Contact form elements (name, email, message) not found. The 'submitForm' function is likely not tied to an existing form in the HTML.");
    }
}
