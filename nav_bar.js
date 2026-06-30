/* ============================================
   NAV_BAR.JS — Bottom Mobile Navigation Bar Indicator
   Modern, Clean, Simple, Smooth
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const bottomNavbar = document.querySelector('.bottom-navbar');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  const indicator = document.querySelector('.bottom-nav-line-indicator');

  if (!bottomNavbar || bottomNavItems.length === 0 || !indicator) {
    return;
  }

  // --- Update Mobile Indicator Position ---
  const updateMobileNavIndicator = () => {
    const activeItem = bottomNavbar.querySelector('.bottom-nav-item.active');
    
    if (activeItem) {
      const leftOffset = activeItem.offsetLeft;
      const width = activeItem.offsetWidth;
      indicator.style.left = `${leftOffset}px`;
      indicator.style.width = `${width}px`;
    }
  };

  // Expose function globally so script.js can update it on scroll
  window.updateMobileNavIndicator = updateMobileNavIndicator;

  // Initial position
  setTimeout(updateMobileNavIndicator, 200);

  // Resize handler
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateMobileNavIndicator, 100);
  });

  // Tap handler to immediately slide indicator
  bottomNavItems.forEach(item => {
    item.addEventListener('click', () => {
      bottomNavItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      updateMobileNavIndicator();
    });
  });
});