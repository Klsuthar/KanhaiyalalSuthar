document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the item is visible
    };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const progressBar = skillItem.querySelector('.progress-bar');
                const targetProgress = progressBar.dataset.progress; // Get data-progress value

                if (progressBar && targetProgress) {
                    // Set the CSS custom property for the animation
                    progressBar.style.setProperty('--target-width', `${targetProgress}%`);
                    // Add a class to trigger the CSS animation
                    skillItem.classList.add('is-visible');
                }
                // Stop observing once animated
                observer.unobserve(skillItem);
            }
        });
    }, observerOptions);

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
});
