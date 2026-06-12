(() => {
  'use strict';

  /* ── Header scroll effect ─────────────────────────────────── */
  const header = document.querySelector('.header');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Drawer (mobile menu) ─────────────────────────────────── */
  const drawer = document.querySelector('#drawer');
  const toggle = document.querySelector('#menuToggle');
  const close  = document.querySelector('#drawerClose');
  const backdrop = document.querySelector('.drawer__backdrop');

  const setDrawer = (open) => {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle?.addEventListener('click', () => setDrawer(true));
  close?.addEventListener('click', () => setDrawer(false));
  backdrop?.addEventListener('click', () => setDrawer(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setDrawer(false); });
  document.querySelectorAll('.drawer__nav a').forEach(a => a.addEventListener('click', () => setDrawer(false)));

  /* ── FAQ Accordion ────────────────────────────────────────── */
  document.querySelectorAll('.faq-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ── Gallery Filters ──────────────────────────────────────── */
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('[data-category]').forEach(item => {
        const cats = item.dataset.category || '';
        item.classList.toggle('is-hidden', filter !== 'all' && !cats.includes(filter));
      });
    });
  });

  /* ── Video autoplay safety ────────────────────────────────── */
  document.querySelectorAll('video[autoplay]').forEach(v => {
    v.muted = true;
    v.playsInline = true;
  });

  /* ── Reveal on scroll ─────────────────────────────────────── */
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('reveal', 'is-visible'));
  } else if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('reveal');
      revealObs.observe(el);
    });

    /* Pause/play videos on visibility */
    const videoObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        if (entry.isIntersecting) vid.play().catch(() => {});
        else vid.pause();
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('video[autoplay]').forEach(v => videoObs.observe(v));
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('reveal', 'is-visible'));
  }

  /* ── Magnetic hover on cards ──────────────────────────────── */
  document.querySelectorAll('.card, .stat').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Smooth counter animation for stat numbers ────────────── */
  const animateCounter = (el) => {
    const text = el.textContent.trim();
    const num = parseInt(text);
    if (isNaN(num) || num <= 0) return;
    const suffix = text.replace(String(num), '');
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(num * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const statObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const strong = entry.target.querySelector('strong');
          if (strong) animateCounter(strong);
          statObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat').forEach(s => statObs.observe(s));
  }
})();
