// scripts/motion.js — premium motion layer for CanoramIQ
// Safe by design: if anything fails or scripts don't load, content stays visible.
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  // Always neutralize the legacy slide-in handler.
  $$('.slide-in').forEach(el => el.classList.add('visible'));

  // Hard safety net: if motion setup fails or stalls, force everything visible.
  function forceVisible() {
    $$('.fx-reveal, .fx-hero').forEach(el => {
      el.classList.add('fx-shown');
      el.style.opacity = '';
      el.style.transform = '';
    });
  }
  const failSafe = setTimeout(forceVisible, 4000);
  window.addEventListener('error', forceVisible);

  if (reduced) { forceVisible(); clearTimeout(failSafe); return; }
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    forceVisible(); clearTimeout(failSafe); return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);

    // ---- 1. Lenis smooth scroll ----
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
        duration: 1.1,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
      });
      window.lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      $$('a[href^="#"]').forEach(a => {
        const href = a.getAttribute('href');
        if (!href || href.length < 2) return;
        a.addEventListener('click', e => {
          const el = document.querySelector(href);
          if (!el) return;
          e.preventDefault();
          lenis.scrollTo(el, { offset: -120, duration: 1.1 });
        });
      });

      const phoneInner = $('.phone-scroll-container');
      if (phoneInner) {
        phoneInner.addEventListener('pointerenter', () => lenis.stop());
        phoneInner.addEventListener('pointerleave', () => lenis.start());
      }
    }

    // ---- 2. Header shrink on scroll ----
    const header = $('.site-header');
    if (header) {
      ScrollTrigger.create({
        start: 'top top',
        end: 99999,
        onUpdate: self => header.classList.toggle('is-scrolled', self.scroll() > 24),
      });
    }

    // ---- 3. Hero entrance ----
    const heroH1 = $('main .container h1');
    const heroLead = $('main .container .lead');
    const heroCta = $$('main .container .cta .btn');
    const heroPills = $$('.hero-highlights li');
    const heroIcons = $$('.industry-icons .ii-item');

    [heroH1, heroLead, ...heroCta, ...heroPills, ...heroIcons]
      .filter(Boolean)
      .forEach(el => el.classList.add('fx-hero'));

    const heroTl = gsap.timeline({ delay: 0.1 });

    if (heroH1 && typeof SplitType !== 'undefined') {
      try {
        const split = new SplitType(heroH1, { types: 'words' });
        heroH1.classList.add('fx-shown');
        gsap.set(split.words, { yPercent: 110, opacity: 0, display: 'inline-block' });
        heroTl.to(split.words, {
          yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.04,
        });
      } catch (e) {
        heroH1.classList.add('fx-shown');
      }
    } else if (heroH1) {
      heroH1.classList.add('fx-shown');
    }

    if (heroLead) heroLead.classList.add('fx-shown');
    heroCta.forEach(el => el.classList.add('fx-shown'));
    heroPills.forEach(el => el.classList.add('fx-shown'));
    heroIcons.forEach(el => el.classList.add('fx-shown'));

    // ---- 4. Generic section reveals (CSS handles initial state, JS toggles class) ----
    const revealSelectors = [
      '.section .eyebrow',
      '.section h2',
      '.section > .container > p',
      '.section > .container > .muted',
      '.card', '.step', '.kpi', '.ss-card', '.cs-badge',
    ];
    const reveals = $$(revealSelectors.join(','));
    reveals.forEach(el => el.classList.add('fx-reveal'));

    // Reveal anything already in viewport on first paint
    const viewportH = window.innerHeight;
    reveals.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < viewportH * 0.95) el.classList.add('fx-shown');
    });

    reveals.forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => el.classList.add('fx-shown'),
      });
    });

    // ---- 5. Phone section: parallax glow + pager auto-advance ----
    const phoneSection = $('#phone-scroll-section');
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
    const stepsWrap = $('#how .steps');
    if (stepsWrap && !isMobile && stepsWrap.children.length > 2) {
      stepsWrap.classList.add('is-horizontal');
      // Reveal step cards immediately so the horizontal track shows them.
      $$('#how .steps .step').forEach(el => el.classList.add('fx-shown'));
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
    if (!isMobile && canHover) {
      $$('#features .card').forEach(card => {
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
    $$('.kpis .kpi .kpi-value').forEach(el => {
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
      gsap.to(obj, {
        v: target, duration: 1.4, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onStart: () => { el.textContent = prefix + (0).toFixed(decimals) + suffix; },
        onUpdate: () => { el.textContent = prefix + obj.v.toFixed(decimals) + suffix; },
        onComplete: () => { el.textContent = raw; },
      });
    });

    // ---- 9. Refresh after fonts/images/map load ----
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    setTimeout(refresh, 600);

    clearTimeout(failSafe);
    // Belt-and-braces: anything still hidden after 2.5s gets revealed.
    setTimeout(forceVisible, 2500);
  } catch (err) {
    console.warn('motion.js failed, restoring visibility:', err);
    forceVisible();
    clearTimeout(failSafe);
  }
})();
