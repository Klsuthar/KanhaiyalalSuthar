// contact.js - Logic specific to the Contact section

document.addEventListener('DOMContentLoaded', () => {
    const contactSection = document.getElementById('contact');
    if (!contactSection) {
        return;
    }

    console.log("Contact section specific JS initializing...");

    const contactForm = document.getElementById('contact-form');
    const modal = document.getElementById('thanks-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {'Accept': 'application/json'}
                });
                
                if (response.ok) {
                    contactForm.reset();
                    if (modal) modal.classList.add('show');
                }
            } catch (error) {
                console.error('Form error:', error);
            }
        });
    }

    if (modalCloseBtn && modal) {
        modalCloseBtn.addEventListener('click', () => modal.classList.remove('show'));
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
    }
});
