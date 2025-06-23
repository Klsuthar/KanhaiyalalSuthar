// about.js - Logic specific to the About section

document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) {
        // console.log("About section not found on this page, about.js will not run.");
        return;
    }

    console.log("About section specific JS initializing...");

    // Add any about-section specific JS interactions here.
    // For example:
    // - If you had filters for skills.
    // - If "My Interests" tags had complex click behaviors.
    // - If the about image had a special gallery or zoom feature.

    // The skill bar percentage animation is currently handled globally in script.js
    // by the IntersectionObserver targeting '.skill-item'. If you wanted that logic
    // to be *only* for skill items within the #about section, you'd move that part
    // of the IntersectionObserver callback here and re-scope the observer.
    // For now, it remains global.
});