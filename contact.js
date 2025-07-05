// contact.js - Logic for asynchronous form submission and "Thank You" modal

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const modal = document.getElementById('thanks-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Ensure all required elements exist
    if (!contactForm || !modal || !modalCloseBtn) {
        console.warn("Contact form or modal elements not found. Pop-up will not function.");
        return;
    }

    // Function to show the modal
    function showModal() {
        modal.classList.add('is-visible');
    }

    // Function to hide the modal
    function hideModal() {
        modal.classList.remove('is-visible');
    }

    // Event listener for form submission
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form redirect

        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json' // Important for AJAX submission
            }
        }).then(response => {
            if (response.ok) {
                contactForm.reset(); // Clear the form fields
                showModal(); // Show the "Thank You" pop-up
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('Oops! There was a problem submitting your form.');
                    }
                })
            }
        }).catch(error => {
            alert('Oops! There was a problem submitting your form.');
            console.error('Form submission error:', error);
        }).finally(() => {
            // Re-enable the button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    });

    // Close modal when the 'X' button is clicked
    modalCloseBtn.addEventListener('click', hideModal);

    // Close modal when clicking on the overlay background
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });
});