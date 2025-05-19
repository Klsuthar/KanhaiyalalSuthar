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

    // --- Navigation ---
    const nav = document.querySelector('nav');
    const burger = document.querySelector('.burger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li a');
    const bodyEl = document.body;

    // Function to handle navigation bar style on scroll
    const handleScrollNav = () => {
        bodyEl.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScrollNav, { passive: true });
    handleScrollNav(); // Initial check on page load

    // Toggle mobile navigation
    if (burger && navLinksContainer) {
        burger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            // Prevent body scroll when mobile menu is open
            bodyEl.classList.toggle('nav-open', navLinksContainer.classList.contains('nav-active'));
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('nav-active')) {
                    navLinksContainer.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    bodyEl.classList.remove('nav-open');
                }
            });
        });
        // Close mobile menu if clicked outside of it
        document.addEventListener('click', (event) => {
            if (navLinksContainer.classList.contains('nav-active') && !nav.contains(event.target) && !burger.contains(event.target)) {
                navLinksContainer.classList.remove('nav-active');
                burger.classList.remove('toggle');
                bodyEl.classList.remove('nav-open');
            }
        });
    }

    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const highlightSection = () => {
        let currentSectionId = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjusted offset for better accuracy
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Fallback for top of the page or very bottom
        if (!currentSectionId && scrollY < sections[0].offsetTop - 100) {
            currentSectionId = 'home';
        } else if (!currentSectionId && scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
            currentSectionId = sections.length > 0 ? sections[sections.length - 1].getAttribute('id') : 'contact';
        }

        navLinks.forEach(link => {
            link.classList.remove('active'); // Remove active from all
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active'); // Add active to current
            }
        });
    };
    window.addEventListener('scroll', highlightSection, { passive: true });
    highlightSection(); // Initial check

    // --- Typing Animation for Profession ---
    const typeWriter = () => {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return; // Guard clause if element doesn't exist

        const words = ["Maths Teacher", "Tech Enthusiast", "Excel Expert", "Quick Learner"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const typeSpeed = 120; // Milliseconds per character
            const deleteSpeed = 60; // Milliseconds per character
            const pauseBeforeDelete = 1500; // Pause after word is typed
            const pauseBeforeNextWord = 300; // Pause before typing next word

            if (isDeleting) {
                // Deleting characters
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length; // Move to next word
                    setTimeout(type, pauseBeforeNextWord);
                } else {
                    setTimeout(type, deleteSpeed);
                }
            } else {
                // Typing characters
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentWord.length) {
                    isDeleting = true;
                    setTimeout(type, pauseBeforeDelete);
                } else {
                    setTimeout(type, typeSpeed);
                }
            }
        }
        typingElement.textContent = ''; // Clear initial content
        setTimeout(type, 800); // Initial delay before starting
    };
    typeWriter();

    // --- Scroll Animations (Intersection Observer for Sections simple fade-in and slide-up) ---
    // The CSS handles the actual animation based on the '.visible' class.
    // JavaScript only adds/removes this class.
    const sectionObserverOptions = {
        root: null, // Observes intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is visible for fade-in
                       // For mobile slide-up, this threshold means animation starts when 10% is visible.
    };

    const sectionCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after first animation to prevent re-animation on scroll
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove 'visible' class if you want elements to animate out and then in again
                // This might be desired for some effects, but can also be distracting.
                // entry.target.classList.remove('visible');
            }
        });
    };

    const sectionObserver = new IntersectionObserver(sectionCallback, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

}); // End DOMContentLoaded

// --- Contact Form Submission (Optional - Current HTML uses a mailto link) ---
// This function is designed for a form with specific IDs.
// If you uncomment the form in index.html, this function can be used.
function submitForm() {
    const form = document.getElementById('contact-form');
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');

    // Check if form elements exist (they might not if form is commented out)
    if (form && nameEl && emailEl && messageEl) {
        const name = nameEl.value?.trim();
        const email = emailEl.value?.trim();
        const message = messageEl.value?.trim();

        if (!name || !email || !message) {
            // Using a more modern notification if available, otherwise alert
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // If using a backend service, you would send data here.
        // For now, it uses a mailto link as a fallback.
        const recipientEmail = "klsuthar0987@gmail.com";
        const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

        try {
            const mailWindow = window.open(mailtoLink, '_blank');
            if (!mailWindow) {
                showNotification('Could not open email client. Please copy details or try again.', 'warning');
            } else {
                 showNotification('Your email application should open. Please send the message.', 'success');
            }
        } catch (e) {
            console.error("Failed to open mailto link:", e);
            showNotification('Error opening email client. Please send manually.', 'error');
        }

        setTimeout(() => {
            form.reset();
        }, 1000);

    } else {
        // This will be logged if the form elements are not found in the HTML
        console.warn("Contact form elements (name, email, message) not found. The 'submitForm' function is not fully operational without the corresponding HTML form.");
         // Fallback to direct mailto if button is clicked without form
        const recipientEmail = "klsuthar0987@gmail.com";
        const subject = encodeURIComponent(`Portfolio Inquiry`);
        const body = encodeURIComponent(`Hello Kanhaiya,\n\nI have a question:\n\n`);
        window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    }
}

// Simple notification function (can be replaced with a more sophisticated library)
function showNotification(message, type = 'info') {
    // For demonstration, using alert. Replace with a custom notification UI element.
    alert(`${type.toUpperCase()}: ${message}`);
    // Example of creating a temporary notification div:
    /*
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`; // e.g., notification-success
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
    */
}
