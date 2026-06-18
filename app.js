/* ==========================================================================
   Main App Interactions (Navigation, Scroll, Accordion)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('a');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking links
  links.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // --- Scroll Active Section Link Highlight ---
  const sections = document.querySelectorAll('section, header');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    
    // Add offset for header height
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href').substring(1);
      if (href === current || (href === '' && current === 'home')) {
        item.classList.add('active');
      }
    });
  });
});

// --- Course Card Toggle Accordion ---
window.toggleCourse = function(card) {
  // If we want accordion style (only one open at a time):
  const allCards = document.querySelectorAll('.course-card');
  allCards.forEach(c => {
    if (c !== card) {
      c.classList.remove('active');
    }
  });
  
  // Toggle the clicked card
  card.classList.toggle('active');
};
