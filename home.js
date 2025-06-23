// home.js - Logic specific to the Home section

document.addEventListener('DOMContentLoaded', () => {
    const homeSection = document.getElementById('home');
    if (!homeSection) {
        // console.log("Home section not found on this page, home.js will not run.");
        return; // Only run if home section exists
    }

    console.log("Home section specific JS initializing...");

    // --- Typing Effect (Moved from global script.js) ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        // Check if the element is actually visible before starting
        // This can be useful if CSS hides it on certain conditions initially
        const isTypingElementVisible = getComputedStyle(typingTextElement).display !== 'none' && typingTextElement.offsetHeight > 0;

        if (isTypingElementVisible) {
            console.log("Initializing typing effect for home section.");
            const professions = ["Maths Teacher", "Web Developer", "Tech Enthusiast"];
            let typeIndex = 0;
            let charIndex = 0;
            let currentText = '';
            let isDeleting = false;
            const typeSpeed = 120;
            const deleteSpeed = 80;
            const delayBetweenWords = 1500;
            let typeTimeoutId = null; // To potentially clear timeout if needed

            function type() {
                // Ensure element still exists and is part of the document
                if (!document.body.contains(typingTextElement)) {
                    if (typeTimeoutId) clearTimeout(typeTimeoutId);
                    return;
                }

                const currentWord = professions[typeIndex];
                if (isDeleting) {
                    currentText = currentWord.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    currentText = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                }

                typingTextElement.textContent = currentText;

                let typeDelay = typeSpeed;
                if (isDeleting) { typeDelay = deleteSpeed; }

                if (!isDeleting && charIndex === currentWord.length) {
                    isDeleting = true; typeDelay = delayBetweenWords;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false; typeIndex = (typeIndex + 1) % professions.length; typeDelay = typeSpeed / 2;
                }
                typeTimeoutId = setTimeout(type, typeDelay);
            }
            type(); // Start the typing effect
        } else {
            // console.log("Typing text element is present but not visible, typing effect not started.");
        }

    } else {
        // console.warn("Typing text element (#typing-text) not found in home section.");
    }

    // --- Parallax effect for home content (Moved from global script.js) ---
    // This assumes parallax is ONLY for the home section's content.
    // If other sections need similar parallax, this might need a more generic solution or duplication.
    const homeContentForParallax = homeSection.querySelector('.home-content');
    let homeParallaxRAFId = null;

    function handleHomeParallax() {
        if (homeContentForParallax && getComputedStyle(homeSection).display !== 'none') {
            const scrollY = window.scrollY;
            // Apply parallax only when home section is roughly in viewport
            if (scrollY < window.innerHeight * 1.5) {
                homeContentForParallax.style.transform = `translateY(${scrollY * 0.25}px)`;
            }
        }
        homeParallaxRAFId = null;
    }

    // This scroll listener is specific to home.js for home parallax
    // Ensure it doesn't conflict with the global one if both try to control the same element.
    // The global optimizedScrollUpdates was also doing this; choose one place or make sure they don't conflict.
    // For this refactor, let's assume home.js handles ITS OWN parallax.
    // The global scroll handler in script.js should NOT do home parallax anymore.

    if (homeContentForParallax) {
        window.addEventListener('scroll', () => {
            if (homeParallaxRAFId === null) {
                homeParallaxRAFId = requestAnimationFrame(handleHomeParallax);
            }
        }, { passive: true });
        handleHomeParallax(); // Initial call
    }


    // Add any other home-section specific JS here.
    // For example, specific button interactions or initial animations for elements
    // within the home section that aren't covered by the global IntersectionObserver.

});