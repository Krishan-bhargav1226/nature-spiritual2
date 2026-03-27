/* ============================================================
   main.js — Shared JavaScript
   नेचर स्पिरिचुअल हेल्थ सेंटर
   ============================================================ */

// Utility: Throttle function to reduce event listener calls
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Utility: Debounce function for delayed execution
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── LOADER ── */
  try {
    const loader = document.getElementById('page-loader');
    if (loader) {
      window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hide'), 1400);
      });
    }
  } catch (e) {
    console.warn('Loader initialization error:', e);
  }

  /* ── CUSTOM CURSOR ── */
  try {
    const cursor    = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');
    if (cursor && cursorDot) {
      let mx = 0, my = 0, cx = 0, cy = 0;
      
      // Throttle mousemove to improve performance
      const handleMouseMove = throttle((e) => {
        mx = e.clientX;
        my = e.clientY;
        cursorDot.style.left = mx + 'px';
        cursorDot.style.top  = my + 'px';
      }, 16); // ~60fps
      
      document.addEventListener('mousemove', handleMouseMove);
      
      const animCursor = () => {
        cx += (mx - cx) * 0.13;
        cy += (my - cy) * 0.13;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';
        requestAnimationFrame(animCursor);
      };
      animCursor();
      
      // Add cursor scale effect on interactive elements
      const interactiveElements = document.querySelectorAll('a, button, .card, .rule-card, .tip-card');
      interactiveElements.forEach(el => {
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
  } catch (e) {
    console.warn('Custom cursor initialization error:', e);
  }

  /* ── NAV SCROLL ── */
  try {
    const navWrap = document.querySelector('.nav-wrap');
    if (navWrap) {
      const handleScroll = throttle(() => {
        navWrap.classList.toggle('scrolled', window.scrollY > 60);
      }, 16);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  } catch (e) {
    console.warn('Navigation scroll error:', e);
  }

  /* ── HAMBURGER ── */
  try {
    const burger  = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.nav-mobile');
    if (burger && mobileMenu) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
      });
      mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          burger.classList.remove('open');
          mobileMenu.classList.remove('open');
        });
      });
    }
  } catch (e) {
    console.warn('Hamburger menu error:', e);
  }

  /* ── ACTIVE NAV LINK ── */
  try {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  } catch (e) {
    console.warn('Active nav link error:', e);
  }

  /* ── STAGGER CHILDREN ── */
  try {
    document.querySelectorAll('.stagger-children').forEach(parent => {
      [...parent.children].forEach((child, i) => {
        child.dataset.delay = (i * 0.1).toFixed(1);
        child.classList.add('reveal');
      });
    });
  } catch (e) {
    console.warn('Stagger children error:', e);
  }

  /* ── SCROLL REVEAL ── */
  try {
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
      // Fallback for older browsers
      revealEls.forEach(el => el.classList.add('in'));
    }
  } catch (e) {
    console.warn('Scroll reveal error:', e);
  }

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
  try {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  } catch (e) {
    console.warn('Smooth scroll error:', e);
  }

  /* ── NUMBER COUNT-UP ── */
  try {
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
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
  } catch (e) {
    console.warn('Number count-up error:', e);
  }

});





document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('shortsCarousel');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (!carousel) return;

  const scrollStep = () => {
    const item = carousel.querySelector('.shorts-item');
    return item ? item.offsetWidth + 20 : 300; // width + gap
  };

  nextBtn?.addEventListener('click', () => {
    carousel.scrollBy({ left: scrollStep(), behavior: 'smooth' });
  });

  prevBtn?.addEventListener('click', () => {
    carousel.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
  });

  // Optional: Auto-hide buttons at start/end of scroll
  carousel.addEventListener('scroll', () => {
    const scrollLeft = carousel.scrollLeft;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    
    if (prevBtn) prevBtn.style.opacity = scrollLeft <= 5 ? "0" : "1";
    if (nextBtn) nextBtn.style.opacity = scrollLeft >= maxScroll - 5 ? "0" : "1";
  });
});