// contact.js - Logic specific to the Contact section

document.addEventListener('DOMContentLoaded', () => {
    const contactSection = document.getElementById('contact');
    if (!contactSection) {
        // console.log("Contact section not found on this page, contact.js will not run.");
        return;
    }

    console.log("Contact section specific JS initializing...");

    // The "Send me an Email" button's onclick attribute in HTML directly calls
    // the submitViaEmailClient() function, which is globally defined in script.js.
    // If you wanted to attach that event listener here instead:
    /*
    const emailButton = contactSection.querySelector('.question-section .btn-primary');
    if (emailButton) {
        emailButton.addEventListener('click', () => {
            // Ensure submitViaEmailClient is accessible, e.g., by not wrapping it in DOMContentLoaded in script.js
            // or by re-defining it here if it's truly only for this section.
            if (typeof submitViaEmailClient === 'function') {
                submitViaEmailClient('Inquiry from Portfolio Contact Section');
            } else {
                console.error('submitViaEmailClient function not found.');
            }
        });
    }
    */

    // Add any other contact-section specific JS interactions here.
    // For example:
    // - Form validation if you were to add an actual contact form.
    // - Interactive map features if you embedded a more complex map.
    // - Specific animations for social links on interaction.
});