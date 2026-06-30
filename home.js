/* ============================================
   HOME.JS — Hero Section Typing & Parallax Effects
   Modern, Clean, Simple, Smooth
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Typing Effect ---
  const typingTarget = document.getElementById('typing-text');
  if (typingTarget) {
    const words = ['Maths Teacher', 'Web Developer', 'AI Enthusiast'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout = null;

    const typeEffect = () => {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typingTarget.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingTarget.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      // Determine speed
      let speed = isDeleting ? 60 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        // Pause at full word
        speed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        // Cycle to next word
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400; // Pause before typing next word
      }

      typingTimeout = setTimeout(typeEffect, speed);
    };

    typeEffect();
  }

  // --- 2. Interactive Parallax Background Shapes ---
  const homeSection = document.getElementById('home');
  const shapes = document.querySelectorAll('.home-shape');

  if (homeSection && shapes.length > 0) {
    let tick = false;

    homeSection.addEventListener('mousemove', (e) => {
      if (!tick) {
        window.requestAnimationFrame(() => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          
          // Calculate normalized coordinate offset from center (-0.5 to 0.5)
          const mouseX = (e.clientX / width) - 0.5;
          const mouseY = (e.clientY / height) - 0.5;
          
          shapes.forEach(shape => {
            const speed = parseFloat(shape.getAttribute('data-speed')) || 2;
            const xOffset = mouseX * speed * 25; // max 25px travel
            const yOffset = mouseY * speed * 25;
            
            shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
          });
          
          tick = false;
        });
        tick = true;
      }
    }, { passive: true });
  }
});