/* -----------------------------------------------------------
 *  OptinetFlow – responsive infinite-loop carousel with swipe
 * ----------------------------------------------------------- */

(() => {
  const carousel = document.querySelector(".carousel");
  const dots = Array.from(document.querySelectorAll(".dot"));

  /* -------- parameters you may tweak -------- */
  const AUTO_DELAY = 5000; // ms between automatic slides
  const SWIPE_RATIO = 0.15; // 15 % of viewport → trigger slide
  const TRANSITION = "transform 0.5s ease-in-out";

  /* ------------- state ------------- */
  let slides, firstClone, lastClone, allSlides;
  let index = 1; // start on first REAL slide
  let autoId = null;
  let lastTime = 0;

  const colorThief = new ColorThief(); // ① once at top-level

  function syncBg(allIdx) {
    const realIdx = (allIdx - 1 + slides.length) % slides.length;
    const img     = slides[realIdx].querySelector('img');
  
    /* ---------- get palette (dominant + 2 accents) ---------- */
    const getRGB = () => colorThief.getPalette(img, 3);   // [[r,g,b]…]
    
    if (img.complete && img.naturalWidth){
      updateTheme(getRGB());
    } else {
      img.decode().then(() => updateTheme(getRGB()));
    }
  }

  function updateTheme(palette){
    if (!palette || !palette.length) return;
  
    // pick the first two colours in the palette
    const [c0, c1] = palette;
    const rgbA = `rgb(${c0[0]},${c0[1]},${c0[2]})`;
    const rgbB = `rgb(${c1[0]},${c1[1]},${c1[2]})`;
  
    /* ① gradient behind blur bars & letter-box */
    const grad = `linear-gradient(180deg, ${rgbA} 0%, ${rgbB} 100%)`;
    document.body.style.backgroundImage     = grad;           // for tall desktop
    document.body.style.backgroundSize      = 'cover';
    document.body.style.backgroundPosition  = 'center';
    // keep the hero photo on the wrapper (already set in syncBg)
  
    /* ② colour for browser chrome (theme-color) = dominant stop */
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta){
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = rgbA;
  }
  

  function goTo(i, animate = true) {
    carousel.style.transition = animate ? TRANSITION : "none";
    carousel.style.transform = `translate3d(-${i * 100}%,0,0)`;
    syncBg(i);
  }

  function setActiveDot(realIdx) {
    dots.forEach((d) => d.classList.remove("active"));
    if (dots[realIdx]) dots[realIdx].classList.add("active");
  }

  function getSlides() {
    // after markup refactor every .carousel-item is usable
    return Array.from(document.querySelectorAll(".carousel-item"));
  }

  /* ------- build / rebuild carousel (also on resize) ------- */
  function build() {
    /* remove any previous clones */
    carousel.querySelectorAll(".clone").forEach((n) => n.remove());

    slides = getSlides();
    firstClone = slides[0].cloneNode(true);
    lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.classList.add("clone");
    lastClone.classList.add("clone");

    carousel.appendChild(firstClone);
    carousel.insertBefore(lastClone, slides[0]);

    allSlides = Array.from(document.querySelectorAll(".carousel-item")); // incl. clones
    index = 1;
    goTo(index, false);
    setActiveDot(0);
  }

  /* ----------- seamless looping ----------- */
  carousel.addEventListener("transitionend", () => {
    if (allSlides[index] === firstClone) {
      index = 1;
      goTo(index, false);
    }
    if (allSlides[index] === lastClone) {
      index = slides.length;
      goTo(index, false);
    }
  });

  /* ----------- autoslide --------------- */
  function autoSlide(ts) {
    if (!lastTime) lastTime = ts;
    if (ts - lastTime >= AUTO_DELAY) {
      index++;
      goTo(index);
      setActiveDot((index - 1) % slides.length);
      lastTime = ts;
    }
    autoId = requestAnimationFrame(autoSlide);
  }

  function startAuto() {
    lastTime = performance.now();
    if (!autoId) autoId = requestAnimationFrame(autoSlide);
  }
  function stopAuto() {
    cancelAnimationFrame(autoId);
    autoId = null;
  }

  /* --------------- swipe / drag --------------- */
  let startX,
    isDragging = false;

  function pointerDown(e) {
    stopAuto();
    isDragging = true;
    startX = e.type.startsWith("mouse") ? e.pageX : e.touches[0].pageX;
    carousel.style.transition = "none";
  }

  function pointerMove(e) {
    if (!isDragging) return;
    const x = e.type.startsWith("mouse") ? e.pageX : e.touches[0].pageX;
    const delta = x - startX;
    const offsetPct = (delta / window.innerWidth) * 100;
    carousel.style.transform = `translate3d(${-index * 100 + offsetPct}%,0,0)`;
  }

  function pointerUp(e) {
    if (!isDragging) return;
    const x = e.type.startsWith("mouse")
      ? e.pageX
      : (e.changedTouches && e.changedTouches[0].pageX) || startX;
    const delta = x - startX;
    const thresh = window.innerWidth * SWIPE_RATIO;

    if (delta > thresh) index--; // swipe right  → previous
    if (delta < -thresh) index++; // swipe left   → next

    goTo(index);
    setActiveDot((index - 1 + slides.length) % slides.length);
    isDragging = false;
    startAuto();
  }

  /* pointer & touch listeners (passive false for touchmove so we can prevent scroll) */
  carousel.addEventListener("mousedown", pointerDown);
  carousel.addEventListener("touchstart", pointerDown, { passive: true });

  window.addEventListener("mousemove", pointerMove);
  window.addEventListener("touchmove", pointerMove, { passive: false });

  window.addEventListener("mouseup", pointerUp);
  window.addEventListener("touchend", pointerUp);

  /* -------------- dots navigation --------------- */
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      index = Number(dot.dataset.slide) + 1; // +1 for the leading clone
      goTo(index);
      setActiveDot(Number(dot.dataset.slide));
      lastTime = performance.now();
    });
  });

  /* -------------- setup & run --------------- */
  build();
  startAuto();
  window.addEventListener("resize", () => {
    stopAuto();
    build();
    startAuto();
  });
})();
