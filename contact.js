/* Contact Section Script */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('thankYouModal');
    const closeModal = document.querySelector('.close-modal');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Basic Validation
            if (!data.name || !data.phone || !data.message) {
                alert('Please fill in all fields.');
                return;
            }

            const button = form.querySelector('button');
            const originalText = button.innerHTML;
            button.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    modal.style.display = 'flex';
                    form.reset();
                } else {
                    alert('Oops! There was a problem submitting your form');
                }
            } catch (error) {
                alert('Oops! There was a problem submitting your form');
            } finally {
                button.innerHTML = originalText;
                button.disabled = false;
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });
});
