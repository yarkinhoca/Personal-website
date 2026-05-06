// scripts/motion.js — premium motion layer for CanoramIQ
// Loaded after GSAP, ScrollTrigger, Lenis, and SplitType (all from CDN).
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 720px)').matches;

  // Always make .slide-in elements visible (the old IO-based handler is neutralized).
  document.querySelectorAll('.slide-in').forEach(el => el.classList.add('visible'));

  if (reduced) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // ---- 1. Lenis smooth scroll, synced with ScrollTrigger ----
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false, // keep native touch for the in-phone hijack
    });
    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Anchor links → use Lenis. Skip elements that have their own handlers.
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      a.addEventListener('click', e => {
        const el = document.querySelector(href);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -120, duration: 1.2 });
      });
    });

    // Pause Lenis when hovering the phone scroll container so its inner hijack works.
    const phoneInner = document.querySelector('.phone-scroll-container');
    if (phoneInner) {
      phoneInner.addEventListener('pointerenter', () => lenis.stop());
      phoneInner.addEventListener('pointerleave', () => lenis.start());
    }
  }

  // ---- 2. Header shrink on scroll ----
  const header = document.querySelector('.site-header');
  if (header) {
    ScrollTrigger.create({
      start: 'top top',
      end: 99999,
      onUpdate: self => header.classList.toggle('is-scrolled', self.scroll() > 24),
    });
  }

  // ---- 3. Hero text mask reveal ----
  const heroH1 = document.querySelector('main .container h1');
  const heroLead = document.querySelector('main .container .lead');
  if (heroH1 && typeof SplitType !== 'undefined') {
    const split = new SplitType(heroH1, { types: 'words' });
    gsap.set(heroH1, { perspective: 800 });
    gsap.set(split.words, { yPercent: 110, opacity: 0, display: 'inline-block' });
    gsap.to(split.words, {
      yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out',
      stagger: 0.04, delay: 0.2,
    });
  } else if (heroH1) {
    gsap.from(heroH1, { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' });
  }
  if (heroLead) {
    gsap.from(heroLead, { y: 24, opacity: 0, duration: 0.9, delay: 0.6, ease: 'power3.out' });
  }
  gsap.from('.hero-highlights li', {
    y: 14, opacity: 0, duration: 0.6, stagger: 0.05, delay: 0.8, ease: 'power2.out',
  });
  gsap.from('.industry-icons .ii-item', {
    y: 18, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.07, delay: 0.9, ease: 'back.out(1.6)',
  });
  gsap.from('main .container .cta .btn', {
    y: 18, opacity: 0, duration: 0.6, stagger: 0.08, delay: 1.0, ease: 'power3.out',
  });

  // ---- 4. Generic section reveals (replaces .slide-in IO handler) ----
  const revealTargets = [
    '.section .eyebrow',
    '.section h2',
    '.section > .container > p',
    '.section > .container > .muted',
    '.card', '.step', '.kpi', '.ss-card', '.cs-badge',
    '.who-cards .card',
  ];
  gsap.utils.toArray(revealTargets.join(', ')).forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      y: 36, opacity: 0, duration: 0.8, ease: 'power3.out',
    });
  });

  // Stagger groups within their parents for a nicer cadence
  document.querySelectorAll('.cards, .steps, .kpis, .session-stats-grid, .compliance-strip').forEach(group => {
    const children = group.children;
    if (!children.length) return;
    gsap.from(children, {
      scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none none' },
      y: 32, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08,
      overwrite: 'auto',
    });
  });

  // ---- 5. Phone section: parallax glow + pager auto-advance ----
  const phoneSection = document.getElementById('phone-scroll-section');
  if (phoneSection && !isMobile) {
    const glow = document.createElement('div');
    glow.className = 'phone-bg-glow';
    phoneSection.prepend(glow);
    gsap.fromTo(glow,
      { yPercent: 10, opacity: 0.35 },
      {
        yPercent: -25, opacity: 0.85,
        scrollTrigger: { trigger: phoneSection, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );

    // Drive page progress → auto-advance phone pager via existing dot click handlers
    const dots = phoneSection.querySelectorAll('.pager-dot');
    if (dots.length) {
      let lastIdx = -1;
      ScrollTrigger.create({
        trigger: phoneSection,
        start: 'top 30%',
        end: 'bottom 70%',
        scrub: true,
        onUpdate: self => {
          const idx = Math.min(dots.length - 1, Math.floor(self.progress * dots.length));
          if (idx !== lastIdx) {
            lastIdx = idx;
            if (!dots[idx].classList.contains('active')) dots[idx].click();
          }
        },
      });
    }
  }

  // ---- 6. "How it works" horizontal pinned stepper ----
  const stepsWrap = document.querySelector('#how .steps');
  if (stepsWrap && !isMobile && stepsWrap.children.length > 2) {
    stepsWrap.classList.add('is-horizontal');
    const distance = () => Math.max(0, stepsWrap.scrollWidth - window.innerWidth + 120);
    gsap.to(stepsWrap, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '#how',
        pin: true,
        scrub: 0.6,
        start: 'top top',
        end: () => '+=' + distance(),
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
  }

  // ---- 7. Magnetic + tilt hover on feature cards ----
  if (!isMobile && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('#features .card').forEach(card => {
      const strength = 10;
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateY: px * 6, rotateX: -py * 6,
          x: px * strength, y: py * strength,
          transformPerspective: 800,
          duration: 0.4, ease: 'power3.out',
        });
      });
      card.addEventListener('pointerleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
      });
    });
  }

  // ---- 8. KPI count-up gated by ScrollTrigger ----
  document.querySelectorAll('.kpis .kpi .kpi-value').forEach(el => {
    const raw = el.textContent.trim();
    const match = raw.match(/([\d,]+\.?\d*)/);
    if (!match) return;
    const numStr = match[1].replace(/,/g, '');
    const target = parseFloat(numStr);
    if (!isFinite(target)) return;
    const decimals = (numStr.split('.')[1] || '').length;
    const prefix = raw.slice(0, match.index);
    const suffix = raw.slice(match.index + match[1].length);
    const obj = { v: 0 };
    el.textContent = prefix + (0).toFixed(decimals) + suffix;
    gsap.to(obj, {
      v: target, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => { el.textContent = prefix + obj.v.toFixed(decimals) + suffix; },
      onComplete: () => { el.textContent = raw; },
    });
  });

  // ---- 9. Refresh after fonts/images/map load ----
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
