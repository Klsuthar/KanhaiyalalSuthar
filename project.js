// project.js - Logic specific to the Projects section

document.addEventListener('DOMContentLoaded', () => {
    const projectsSection = document.getElementById('projects'); // Matches the section ID
    if (!projectsSection) {
        // console.log("Projects section not found on this page, project.js will not run.");
        return;
    }

    console.log("Projects section specific JS initializing...");

    // Add any projects-section specific JS interactions here.
    // For example:
    // - If you had filters for project categories.
    // - If clicking a project card opened a modal with more details.
    // - Specific hover interactions on project images or text not covered by CSS.

    // The VanillaTilt effect, if applied to .project-card, is initialized globally in script.js.
    // The generic .animate-on-scroll and .hover-lift effects are CSS-driven.
});