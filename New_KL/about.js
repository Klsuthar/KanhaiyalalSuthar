/* About Section Script */

document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target + "+"; // Add + sign
                }
            };
            updateCount();
        });
    };

    // Trigger animation when section is in view
    let animated = false;
    const section = document.querySelector('.about-section');

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
            animateCounters();
            animated = true;
        }
    });

    if (section) {
        observer.observe(section);
    }
});
