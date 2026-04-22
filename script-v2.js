/* =============================================================
   Luxe v2 — Refined destination
   ============================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Header solidify when past hero ---------- */
  const header = $('#site-header');
  const hero = $('.hero');
  const solidifyAt = () => (hero ? hero.offsetHeight - 80 : 120);

  const onScroll = () => {
    if (window.scrollY > solidifyAt()) header.classList.add('solid');
    else header.classList.remove('solid');

    // Reserve bar appears after user has scrolled past hero
    if (window.scrollY > window.innerHeight * 0.6) reserveBar.classList.add('shown');
    // (we never auto-hide; user can dismiss manually)
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Smooth scroll ---------- */
  const goTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.offsetTop - 30;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  $$('[data-nav]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = a.getAttribute('data-nav');
      if (!target) return;
      e.preventDefault();
      goTo(target);
      if (header.classList.contains('nav-open')) toggleMobileNav(false);
    });
  });

  /* ---------- Mobile nav ---------- */
  const mobileToggle = $('.mobile-nav-toggle');
  const toggleMobileNav = (open) => {
    const willOpen = typeof open === 'boolean' ? open : !header.classList.contains('nav-open');
    header.classList.toggle('nav-open', willOpen);
    mobileToggle.setAttribute('aria-expanded', String(willOpen));
  };
  if (mobileToggle) mobileToggle.addEventListener('click', () => toggleMobileNav());

  /* ---------- Active nav tracking ---------- */
  const navLinks = $$('.nav-link');
  const sectionIds = ['home', 'worlds', 'house', 'team', 'gift'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      navLinks.forEach(n => n.classList.toggle('active', n.getAttribute('data-nav') === id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => io.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealables = $$('.reveal');
  const rio = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('shown');
        rio.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  revealables.forEach(el => rio.observe(el));

  /* ---------- Sticky reserve bar ---------- */
  const reserveBar = $('.reserve-bar');
  const reserveClose = $('.reserve-close');
  if (reserveClose) {
    reserveClose.addEventListener('click', () => {
      reserveBar.classList.remove('shown');
      reserveBar.setAttribute('data-dismissed', 'true');
    });
  }
  // once dismissed, don't auto-reshow on scroll
  const origOnScroll = onScroll;
  window.removeEventListener('scroll', origOnScroll);
  const scrollHandler = () => {
    if (window.scrollY > solidifyAt()) header.classList.add('solid');
    else header.classList.remove('solid');

    if (reserveBar.getAttribute('data-dismissed') === 'true') return;
    if (window.scrollY > window.innerHeight * 0.6) reserveBar.classList.add('shown');
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler();
})();
