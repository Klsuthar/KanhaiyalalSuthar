/* Resume Section Script */
const carouselState = {
    experience: 0,
    education: 0
};

function initCarousel() {
    if (window.innerWidth <= 768) {
        ['experience', 'education'].forEach(type => {
            const wrapper = document.querySelector(`[data-carousel="${type}"]`);
            if (!wrapper) return;
            
            const cards = wrapper.querySelectorAll('.resume-card');
            const dotsContainer = document.getElementById(`${type}-dots`);
            
            cards.forEach((card, index) => {
                const dot = document.createElement('div');
                dot.className = 'resume-dot';
                dot.onclick = () => goToCard(type, index);
                dotsContainer.appendChild(dot);
            });
            
            updateCarousel(type);
        });
    }
}

function updateCarousel(type) {
    if (window.innerWidth > 768) return;
    
    const wrapper = document.querySelector(`[data-carousel="${type}"]`);
    if (!wrapper) return;
    
    const cards = wrapper.querySelectorAll('.resume-card');
    const dots = document.querySelectorAll(`#${type}-dots .resume-dot`);
    const current = carouselState[type];
    const total = cards.length;
    
    cards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'next');
        card.onclick = null;
        
        if (index === current) {
            card.classList.add('active');
        } else if (index === (current - 1 + total) % total) {
            card.classList.add('prev');
            card.onclick = () => changeCard(type, -1);
        } else if (index === (current + 1) % total) {
            card.classList.add('next');
            card.onclick = () => changeCard(type, 1);
        }
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === current);
    });
}

function changeCard(type, direction) {
    const wrapper = document.querySelector(`[data-carousel="${type}"]`);
    if (!wrapper) return;
    
    const cards = wrapper.querySelectorAll('.resume-card');
    const total = cards.length;
    
    carouselState[type] = (carouselState[type] + direction + total) % total;
    updateCarousel(type);
}

window.changeCard = changeCard;

function goToCard(type, index) {
    carouselState[type] = index;
    updateCarousel(type);
}

window.addEventListener('load', initCarousel);
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        initCarousel();
    }
});

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
    ['experience', 'education'].forEach(type => {
        const wrapper = document.querySelector(`[data-carousel="${type}"]`);
        if (!wrapper) return;
        
        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        wrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(type);
        });
    });
});

function handleSwipe(type) {
    if (touchEndX < touchStartX - 50) {
        changeCard(type, 1);
    }
    if (touchEndX > touchStartX + 50) {
        changeCard(type, -1);
    }
}
