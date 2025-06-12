/* -----------------------------------------------------------
 *  OptinetFlow – responsive infinite-loop carousel
 * -----------------------------------------------------------
 *  − works with one <picture> per .carousel-item
 *  − clones first/last slide once to create a seamless loop
 *  − syncs dots, supports auto-slide & hover-pause
 * --------------------------------------------------------- */

(() => {
  const carousel = document.querySelector('.carousel');
  const dots     = Array.from(document.querySelectorAll('.dot'));

  let slides, firstClone, lastClone, allSlides;
  let index      = 1;          // start on first REAL slide (after leading clone)
  let lastTime   = 0;
  const autoDelay = 5000;      // ms between auto-slides

  /* ---------- helpers ---------- */
  function goTo (i, animate = true) {
    carousel.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    carousel.style.transform  = `translate3d(-${i * 100}%,0,0)`;
  }

  function setActiveDot (realIdx) {
    dots.forEach(d => d.classList.remove('active'));
    if (dots[realIdx]) dots[realIdx].classList.add('active');
  }

  function getSlides () {
    // all REAL slides (exclude earlier clones, if any)
    return Array.from(carousel.querySelectorAll('.carousel-item:not(.clone)'));
  }

  /* ---------- (re)build when layout changes ---------- */
  function buildCarousel () {
    // 1. remove old clones
    carousel.querySelectorAll('.clone').forEach(c => c.remove());

    // 2. cache current visible slides
    slides = getSlides();
    if (!slides.length) return;

    // 3. clone ends
    firstClone = slides[0].cloneNode(true);
    lastClone  = slides[slides.length - 1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');

    carousel.appendChild(firstClone);              // tail
    carousel.insertBefore(lastClone, slides[0]);   // head

    // 4. allSlides now includes the clones
    allSlides = carousel.querySelectorAll('.carousel-item');

    // 5. jump to first REAL slide
    index = 1;
    goTo(index, false);
    setActiveDot(0);
  }

  buildCarousel();
  window.addEventListener('resize', buildCarousel); // rebuild on breakpoint/orientation change

  /* ---------- dot navigation ---------- */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i + 1;           // +1 to skip leading clone
      goTo(index);
      setActiveDot(i);
      lastTime = performance.now();
    });
  });

  /* ---------- seamless looping ---------- */
  carousel.addEventListener('transitionend', () => {
    if (allSlides[index] === firstClone) {         // passed last REAL → snap to first REAL
      index = 1;
      goTo(index, false);
    } else if (allSlides[index] === lastClone) {   // passed first REAL → snap to last REAL
      index = slides.length;
      goTo(index, false);
    }
  });

  /* ---------- auto-slide (requestAnimationFrame) ---------- */
  function autoSlide (ts) {
    if (!lastTime) lastTime = ts;
    if (ts - lastTime >= autoDelay) {
      index++;
      goTo(index);
      setActiveDot((index - 1) % slides.length);   // real index modulo slide count
      lastTime = ts;
    }
    requestAnimationFrame(autoSlide);
  }
  requestAnimationFrame(autoSlide);

  /* ---------- pause on hover ---------- */
  carousel.addEventListener('mouseenter', () => lastTime = 0);            // freeze
  carousel.addEventListener('mouseleave',  () => lastTime = performance.now()); // resume
})();
