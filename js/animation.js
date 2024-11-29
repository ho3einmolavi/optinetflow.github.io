// js/animations.js

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');

    const options = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing after it becomes visible
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
});
