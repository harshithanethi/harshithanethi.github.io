document.addEventListener("DOMContentLoaded", function () {
  const togglers = document.querySelectorAll('.navbar-toggler');
  togglers.forEach(toggler => {
    toggler.addEventListener('click', function (e) {
      e.stopPropagation();
      const targetId = toggler.getAttribute('data-bs-target');
      if (targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.classList.toggle('show');
          const isExpanded = targetElement.classList.contains('show');
          toggler.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        }
      }
    });
  });

  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const parent = toggle.closest('.dropdown');
      if (parent) {
        const menu = parent.querySelector('.dropdown-menu');
        if (menu) {
          document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
            if (openMenu !== menu) {
              openMenu.classList.remove('show');
              const openToggle = openMenu.closest('.dropdown').querySelector('.dropdown-toggle');
              if (openToggle) openToggle.setAttribute('aria-expanded', 'false');
            }
          });
          menu.classList.toggle('show');
          const isExpanded = menu.classList.contains('show');
          toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        }
      }
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        const toggle = menu.closest('.dropdown').querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });
});
