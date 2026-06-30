/* ============================================
   SCRIPT.JS — Main Global Script
   Modern, Clean, Simple, Smooth
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  body.classList.add('loading');

  // --- Scroll Handler (Navbar style & active links) ---
  let rAFId = null;
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('main section[id]');
  const desktopLinks = document.querySelectorAll('#navbar .nav-links li a');
  const mobileLinks = document.querySelectorAll('.bottom-navbar .bottom-nav-item a');

  const onScroll = () => {
    const scrollY = window.scrollY;

    // Toggle scrolled state on desktop navbar
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll spy for active menu item highlighting
    let currentSectionId = '';
    const offsetHeader = 80;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - offsetHeader;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Fallback to home at the very top
    if (scrollY < 100) {
      currentSectionId = 'home';
    }

    // Update desktop nav links
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.substring(1) === currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update mobile bottom nav items
    const bottomNavItems = document.querySelectorAll('.bottom-navbar .bottom-nav-item');
    bottomNavItems.forEach(item => {
      const section = item.getAttribute('data-section');
      if (section === currentSectionId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Trigger update of mobile slide indicator if exists
    if (typeof window.updateMobileNavIndicator === 'function') {
      window.updateMobileNavIndicator();
    }

    rAFId = null;
  };

  window.addEventListener('scroll', () => {
    if (rAFId === null) {
      rAFId = requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll(); // Run once initially

  // --- Burger Menu Toggle (Mobile Overlay Menu) ---
  const burger = document.querySelector('#navbar .burger');
  const navLinksUl = document.querySelector('#navbar .nav-links');
  
  if (burger && navLinksUl) {
    const navLinkItems = navLinksUl.querySelectorAll('li a');

    burger.addEventListener('click', () => {
      navLinksUl.classList.toggle('nav-active');
      burger.classList.toggle('toggle');
      const isExpanded = navLinksUl.classList.contains('nav-active');
      burger.setAttribute('aria-expanded', isExpanded.toString());

      if (isExpanded) {
        navLinkItems.forEach((link, index) => {
          link.style.animation = `navLinkFade 0.4s ease forwards ${index / 7 + 0.1}s`;
        });
      } else {
        navLinkItems.forEach(link => {
          link.style.animation = '';
        });
      }
    });

    // Close menu when a link is clicked
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinksUl.classList.contains('nav-active')) {
          navLinksUl.classList.remove('nav-active');
          burger.classList.remove('toggle');
          burger.setAttribute('aria-expanded', 'false');
          navLinkItems.forEach(item => item.style.animation = '');
        }
      });
    });
  }

  // --- IntersectionObserver for Scroll Animations & Skill Counters ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const animateValueCounter = (spanEl, barEl, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentValue = Math.floor(easedProgress * (end - start) + start);
      
      spanEl.textContent = `${currentValue}%`;
      if (barEl) barEl.style.width = `${currentValue}%`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  if (animatedElements.length > 0 && typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;

          // Handle transition delay via data-delay attribute
          if (target.dataset.delay && !target.style.transitionDelay) {
            target.style.transitionDelay = target.dataset.delay;
          }
          target.classList.add('is-visible');

          // Trigger skill counter animation if it is a skill item
          if (target.classList.contains('skill-item') && !target.dataset.counterAnimated) {
            const percentageSpan = target.querySelector('.skill-percentage');
            const progressBar = target.querySelector('.progress-bar');
            
            if (percentageSpan && progressBar) {
              const targetValue = parseInt(progressBar.getAttribute('data-progress'), 10) || 0;
              if (targetValue > 0) {
                progressBar.style.width = '0%';
                percentageSpan.textContent = '0%';
                animateValueCounter(percentageSpan, progressBar, 0, targetValue, 1200);
                target.dataset.counterAnimated = 'true';
              }
            }
          }
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    document.querySelectorAll('.skill-item').forEach(item => {
      const percentageSpan = item.querySelector('.skill-percentage');
      const progressBar = item.querySelector('.progress-bar');
      if (percentageSpan && progressBar) {
        const targetValue = progressBar.getAttribute('data-progress');
        progressBar.style.width = `${targetValue}%`;
        percentageSpan.textContent = `${targetValue}%`;
      }
    });
  }

  // --- Hiding Loading Overlay ---
  const loadingOverlay = document.getElementById('loading-overlay');
  
  const hideLoader = () => {
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
      body.classList.remove('loading');
    }
  };

  window.addEventListener('load', () => {
    setTimeout(hideLoader, 300); // 300ms minimum display time
  });

  // Fallback timeout for loader
  setTimeout(hideLoader, 2500);

  // --- Footer Current Year Setter ---
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});