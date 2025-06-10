const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');
let index = 0;

function updateCarousel() {
  carousel.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    index = parseInt(dot.getAttribute('data-slide'));
    updateCarousel();
  });
});

// Set initial active dot
updateCarousel();

// Auto-advance every 3 seconds
setInterval(() => {
  index = (index + 1) % items.length;
  updateCarousel();
}, 5000);
