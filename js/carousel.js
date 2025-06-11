const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');
let index = 0;
let autoSlideDelay = 5000;
let rafId;
let lastTime = 0;

// Initial setup
function updateCarousel() {
  carousel.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[index]) {
    dots[index].classList.add('active');
  }
}

// Dot navigation
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    index = parseInt(dot.getAttribute('data-slide'));
    updateCarousel();
    lastTime = performance.now(); // Reset auto-slide timer
  });
});

// Auto-slide using requestAnimationFrame
function autoSlide(timestamp) {
  if (!lastTime) lastTime = timestamp;
  if (timestamp - lastTime >= autoSlideDelay) {
    index = (index + 1) % items.length;
    updateCarousel();
    lastTime = timestamp;
  }
  rafId = requestAnimationFrame(autoSlide);
}

// Start carousel
updateCarousel();
rafId = requestAnimationFrame(autoSlide);

// Pause on hover (optional but recommended)
carousel.addEventListener('mouseenter', () => cancelAnimationFrame(rafId));
carousel.addEventListener('mouseleave', () => {
  lastTime = performance.now(); // Reset timer to avoid immediate skip
  rafId = requestAnimationFrame(autoSlide);
});
