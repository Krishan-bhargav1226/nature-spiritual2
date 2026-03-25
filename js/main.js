/* ============================================================
   main.js — Shared JavaScript
   नेचर स्पिरिचुअल हेल्थ सेंटर
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── LOADER ── */
  const loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hide'), 1400);
    });
  }

  /* ── CUSTOM CURSOR ── */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  if (cursor && cursorDot) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top  = my + 'px';
    });
    const animCursor = () => {
      cx += (mx - cx) * 0.13; cy += (my - cy) * 0.13;
      cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
      requestAnimationFrame(animCursor);
    };
    animCursor();
    document.querySelectorAll('a, button, .card, .rule-card, .tip-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1.9)';
        cursor.style.background = 'rgba(212,160,23,0.15)';
        cursor.style.borderColor = 'var(--amber)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursor.style.background = '';
        cursor.style.borderColor = 'var(--gold)';
      });
    });
  }

  /* ── LEAF PARTICLES ── */
  // const container = document.getElementById('particles');
  // if (container) {
  //   const chars = ['🍃','🌿','☘️','🍀','🌱','✨','🌸','🌺'];
  //   const spawn = () => {
  //     const el = document.createElement('div');
  //     el.className = 'leaf-p';
  //     el.textContent = chars[Math.floor(Math.random() * chars.length)];
  //     el.style.left = Math.random() * 100 + 'vw';
  //     el.style.fontSize = (0.7 + Math.random() * 1.1) + 'rem';
  //     const dur = 9 + Math.random() * 12;
  //     el.style.animationDuration = dur + 's';
  //     el.style.animationDelay = (Math.random() * 3) + 's';
  //     container.appendChild(el);
  //     setTimeout(() => el.remove(), (dur + 3) * 1000);
  //   };
  //   for (let i = 0; i < 6; i++) setTimeout(spawn, i * 300);
  //   setInterval(spawn, 900);
  // }

  /* ── NAV SCROLL ── */
  const navWrap = document.querySelector('.nav-wrap');
  if (navWrap) {
    const onScroll = () => navWrap.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── HAMBURGER ── */
  const burger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }));
  }

  /* ── ACTIVE NAV LINK ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── STAGGER children with .stagger-children ── */
  // Important: add the `.reveal` class before setting up the IntersectionObserver,
  // otherwise these elements will never be observed (and remain invisible).
  document.querySelectorAll('.stagger-children').forEach(parent => {
    [...parent.children].forEach((child, i) => {
      child.dataset.delay = (i * 0.1).toFixed(1);
      child.classList.add('reveal');
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-scale');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseFloat(entry.target.dataset.delay || 0);
          setTimeout(() => entry.target.classList.add('in'), delay * 1000);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── NUMBER COUNT-UP ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el  = entry.target;
          const end = parseFloat(el.dataset.count);
          const dec = el.dataset.decimal ? parseInt(el.dataset.decimal) : 0;
          const dur = 1800;
          let start = null;
          const step = (ts) => {
            if (!start) start = ts;
            const prog = Math.min((ts - start) / dur, 1);
            const val  = prog * end;
            el.textContent = dec > 0 ? val.toFixed(dec) : Math.floor(val);
            if (prog < 1) requestAnimationFrame(step);
            else el.textContent = dec > 0 ? end.toFixed(dec) : end;
          };
          requestAnimationFrame(step);
          countObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObs.observe(c));
  }

});
