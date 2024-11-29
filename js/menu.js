document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a'); // All menu items

    // Function to toggle the menu
    function toggleMenu() {
        navToggle.classList.toggle('active');
        nav.classList.toggle('active');

        // Update ARIA attributes
        const isExpanded = navToggle.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
        navToggle.setAttribute('aria-label', isExpanded ? 'بستن منو' : 'باز کردن منو');
    }

    // Function to close the menu
    function closeMenu() {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'باز کردن منو');
    }

    // Event listener for the hamburger button
    navToggle.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent event from bubbling up
        toggleMenu();
    });

    // Event listener for menu items
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });

    // Event listener for clicking outside the menu
    document.addEventListener('click', function (event) {
        // Close the menu only if it's open and the click is outside the menu or toggle button
        if (nav.classList.contains('active') && !nav.contains(event.target) && !navToggle.contains(event.target)) {
            closeMenu();
        }
    });
});
