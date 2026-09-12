/* ==========================================================================
   ABDELKADER BENAJIBA — Portfolio Script
   Vanilla JS · No dependencies
   ========================================================================== */

(function () {
  'use strict';

  /* ---- NAV SCROLL EFFECT ---- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- MOBILE NAV TOGGLE ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---- ACTIVE NAV LINK ON SCROLL ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a');

  const activateNav = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', activateNav, { passive: true });

  /* ---- INTERNSHIP BANNER DISMISS ---- */
  const banner      = document.getElementById('banner');
  const bannerClose = document.getElementById('bannerClose');

  bannerClose.addEventListener('click', () => {
    banner.classList.add('hidden');
    try { sessionStorage.setItem('bannerDismissed', '1'); } catch (_) {}
  });

  // Respect session dismissal
  try {
    if (sessionStorage.getItem('bannerDismissed')) banner.classList.add('hidden');
  } catch (_) {}

  /* ---- SCROLL REVEAL ---- */
  // Apply only to elements that are offscreen on load — one pass, no repeated animations
  const revealTargets = [
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.skill-group'),
    ...document.querySelectorAll('.about-aside'),
    ...document.querySelectorAll('.contact-cta-block'),
  ];

  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    revealTargets.forEach(el => el.classList.add('visible'));
  }

  /* ---- SMOOTH SCROLL OFFSET (for sticky nav) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
