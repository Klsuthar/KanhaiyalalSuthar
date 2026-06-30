/* ============================================
   CONTACT.JS — Contact Form Submission & Validation
   Modern, Clean, Simple, Smooth
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const modal = document.getElementById('thanks-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!form) return;

  // --- Utility: Clear All Errors ---
  const clearErrors = () => {
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
      group.classList.remove('error');
      const errorMsg = group.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();
    });
  };

  // --- Utility: Show Error ---
  const showError = (inputEl, message) => {
    const group = inputEl.closest('.form-group');
    if (!group) return;
    
    group.classList.add('error');
    
    // Check if error message already exists
    let errorMsg = group.querySelector('.error-message');
    if (!errorMsg) {
      errorMsg = document.createElement('span');
      errorMsg.className = 'error-message';
      group.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
  };

  // --- Form Validation Logic ---
  const validateForm = () => {
    clearErrors();
    let isValid = true;

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const message = form.querySelector('#message');

    // Name Validation
    if (!name.value.trim()) {
      showError(name, 'Name is required');
      isValid = false;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showError(email, 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address');
      isValid = false;
    }

    // Phone Validation
    const phoneRegex = /^[+]?[0-9\s-]{10,15}$/;
    if (!phone.value.trim()) {
      showError(phone, 'Phone number is required');
      isValid = false;
    } else if (!phoneRegex.test(phone.value.trim().replace(/[-\s]/g, ''))) {
      showError(phone, 'Please enter a valid phone number (min 10 digits)');
      isValid = false;
    }

    // Message Validation
    if (!message.value.trim()) {
      showError(message, 'Message is required');
      isValid = false;
    }

    return isValid;
  };

  // --- AJAX Form Submission ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData(form);
    const action = form.getAttribute('action');

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Reset form and show thank-you modal
        form.reset();
        clearErrors();
        if (modal) {
          modal.classList.add('active');
        }
      } else {
        throw new Error('Server responded with an error');
      }
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      alert('Oops! There was a problem sending your message. Please try again.');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    });
  });

  // --- Modal Event Listeners ---
  if (modal && closeBtn) {
    // Close on close button click
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Close on overlay click (outside modal content)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
});
