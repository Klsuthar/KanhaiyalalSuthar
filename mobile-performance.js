// mobile-performance.js - Mobile Performance Optimizations

// Mobile-specific performance enhancements
(function() {
    'use strict';
    
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Optimize scroll performance
        let ticking = false;
        
        function updateScrollEffects() {
            // Throttled scroll effects for mobile
            const scrollY = window.pageYOffset;
            
            // Update navbar on scroll
            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            
            ticking = false;
        }
        
        function requestScrollUpdate() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }
        
        // Optimized scroll listener
        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
        
        // Touch feedback for buttons
        const buttons = document.querySelectorAll('.btn, .project-card, .skill-item');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            button.addEventListener('touchend', function() {
                this.style.transform = '';
            }, { passive: true });
        });
        
        // Optimize animations for mobile
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => observer.observe(el));
        
        // Mobile-specific form enhancements
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            // Prevent zoom on focus for iOS
            input.addEventListener('focus', function() {
                if (window.innerWidth < 768) {
                    document.querySelector('meta[name=viewport]').setAttribute(
                        'content', 
                        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                    );
                }
            });
            
            input.addEventListener('blur', function() {
                if (window.innerWidth < 768) {
                    document.querySelector('meta[name=viewport]').setAttribute(
                        'content', 
                        'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
                    );
                }
            });
        });
        
        // Mobile swipe gestures for projects
        let startX = 0;
        let startY = 0;
        
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });
            
            projectsGrid.addEventListener('touchmove', function(e) {
                if (!startX || !startY) return;
                
                const diffX = startX - e.touches[0].clientX;
                const diffY = startY - e.touches[0].clientY;
                
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    // Horizontal swipe detected
                    e.preventDefault();
                }
            });
        }
        
        // Optimize images for mobile
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });
        
        // Mobile-specific loading optimization
        window.addEventListener('load', function() {
            // Remove loading overlay faster on mobile
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                setTimeout(() => {
                    loadingOverlay.classList.add('hidden');
                }, 800);
            }
        });
        
        // Optimize progress bars for mobile
        const progressBars = document.querySelectorAll('.progress-bar');
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const progress = progressBar.getAttribute('data-progress');
                    if (progress) {
                        setTimeout(() => {
                            progressBar.style.width = progress + '%';
                        }, 200);
                    }
                    progressObserver.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => progressObserver.observe(bar));
        
        // Mobile navigation enhancement
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(item => {
            item.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            item.addEventListener('touchend', function() {
                this.style.transform = '';
            }, { passive: true });
        });
        
        // Prevent double-tap zoom on buttons
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
})();