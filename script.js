/* =============================================================
   Luxe Beauty & Wellness Co. — site script
   ============================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Header solidify on scroll ---------- */
  const header = $('#site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('solid');
    else header.classList.remove('solid');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Smooth scroll + nav data attributes ---------- */
  const goTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
  };
  $$('[data-nav]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = a.getAttribute('data-nav');
      if (!target) return;
      e.preventDefault();
      goTo(target);
      // close mobile nav if open
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
  mobileToggle.addEventListener('click', () => toggleMobileNav());

  /* ---------- Active nav tracking ---------- */
  const navLinks = $$('.nav-link');
  const sections = ['home','services','philosophy','founder','contact']
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

  /* ---------- Services tabs ---------- */
  $$('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.tab;
      $$('.tab').forEach(b => b.classList.toggle('active', b === btn));
      $$('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === id));
    });
  });

  /* ---------- Testimonials auto-rotate ---------- */
  const slides = $$('.t-slide');
  const dots   = $$('.t-dot');
  let tIdx = 0;
  const setSlide = (i) => {
    tIdx = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === tIdx));
    dots.forEach((d, k) => d.classList.toggle('active', k === tIdx));
  };
  dots.forEach(d => d.addEventListener('click', () => setSlide(parseInt(d.dataset.idx, 10))));
  if (slides.length) setInterval(() => setSlide(tIdx + 1), 6000);

  /* ---------- Hero clock ---------- */
  const clock = $('#hero-clock');
  if (clock) {
    const tickClock = () => {
      const d = new Date();
      clock.textContent = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: false
      }).format(d);
    };
    tickClock();
    setInterval(tickClock, 30000);
  }

  /* ---------- Hero parallax (mouse) ---------- */
  const parallaxEls = $$('[data-parallax]');
  window.addEventListener('mousemove', (e) => {
    const mx = (e.clientX / window.innerWidth  - 0.5);
    const my = (e.clientY / window.innerHeight - 0.5);
    parallaxEls.forEach(el => {
      const mode = el.dataset.parallax;
      let x = 0, y = 0;
      if (mode === '1') { x = mx * 28;  y = my * 28;  }
      if (mode === '2') { x = -mx * 22; y = -my * 22; }
      if (mode === '3') { x = mx * 8;   y = my * 8;   }
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  /* ---------- Custom cursor (desktop only) ---------- */
  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (dot && ring && matchMedia('(hover: hover)').matches) {
    let rx = window.innerWidth / 2, ry = window.innerHeight / 2;
    let dx = rx, dy = ry;
    window.addEventListener('mousemove', (e) => {
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = `translate(${dx - 14}px, ${dy - 14}px)`;
    });
    const loop = () => {
      rx += (dx - rx) * 0.12;
      ry += (dy - ry) * 0.12;
      ring.style.transform = `translate(${rx - 22}px, ${ry - 22}px)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    const hoverables = document.querySelectorAll('a, button, .hoverable');
    hoverables.forEach(h => {
      h.addEventListener('mouseenter', () => ring.classList.add('hover'));
      h.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  } else {
    if (dot)  dot.style.display  = 'none';
    if (ring) ring.style.display = 'none';
  }
})();
