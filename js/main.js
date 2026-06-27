/* =====================================================================
   Grove Dental Practice — interactions
   Vanilla ES6+, no dependencies.
   ===================================================================== */
(function () {
  'use strict';

  // Signal JS is active (enables reveal animations; without it, content stays visible).
  document.documentElement.classList.add('js');

  const header = document.getElementById('siteHeader');
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('navList');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  /* --- Sticky header shadow on scroll --- */
  const onScrollHeader = () => {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* --- Mobile menu toggle --- */
  if (navToggle && navList) {
    const closeMenu = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      navList.classList.remove('is-open');
    };
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      navList.classList.toggle('is-open', !open);
    });
    // Close when a link is chosen, or on Escape
    navList.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  /* --- Active-section highlighting via IntersectionObserver --- */
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const byId = (id) => navLinks.find((l) => l.getAttribute('href') === '#' + id);
    const setActive = (id) => {
      navLinks.forEach((l) => l.classList.remove('is-active'));
      const link = byId(id);
      if (link) link.classList.add('is-active');
    };
    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most visible intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* --- Services: expand / collapse (independent, keyboard accessible) --- */
  document.querySelectorAll('[data-service]').forEach((service) => {
    const head = service.querySelector('.service-head');
    if (!head) return;
    head.addEventListener('click', () => {
      const open = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', String(!open));
      service.classList.toggle('is-open', !open);
    });
  });

  /* --- Reviews carousel --- */
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-track]');
    const slides = Array.from(track.children);
    const dotsWrap = carousel.querySelector('[data-dots]');
    const prevBtn = carousel.querySelector('[data-prev]');
    const nextBtn = carousel.querySelector('[data-next]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0;
    let timer = null;

    // Build dot buttons
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Show review ${i + 1} of ${slides.length}`);
      b.addEventListener('click', () => { goTo(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, i) => s.setAttribute('aria-hidden', String(i !== index)));
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === index)));
    }
    function goTo(i) { index = (i + slides.length) % slides.length; update(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() { if (!reduce) timer = window.setInterval(next, 6000); }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    nextBtn.addEventListener('click', () => { next(); restart(); });
    prevBtn.addEventListener('click', () => { prev(); restart(); });

    // Pause on hover / keyboard focus
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    // Arrow-key support when the carousel has focus
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prev(); restart(); }
      else if (e.key === 'ArrowRight') { next(); restart(); }
    });

    update();
    start();
  });

  /* --- FAQ accordion (one open at a time) --- */
  document.querySelectorAll('[data-accordion]').forEach((accordion) => {
    const items = Array.from(accordion.querySelectorAll('[data-faq]'));
    items.forEach((item) => {
      const btn = item.querySelector('.faq-q');
      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        // Close all
        items.forEach((other) => {
          other.classList.remove('is-open');
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
        // Open this one if it was closed
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });

  /* --- Footer year --- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* --- Cookie consent + privacy-friendly Google Map --- */
  const CONSENT_KEY = 'grove-cookie-consent';
  const banner = document.getElementById('cookieBanner');
  const mapWrap = document.querySelector('[data-map]');

  function loadMap() {
    if (!mapWrap || mapWrap.querySelector('iframe')) return;
    const src = mapWrap.getAttribute('data-map-src');
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = 'Map showing Grove Dental Practice at 21 Plashet Grove, London E6 1AD';
    iframe.loading = 'lazy';
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    const placeholder = mapWrap.querySelector('[data-map-placeholder]');
    if (placeholder) placeholder.remove();
    mapWrap.appendChild(iframe);
  }

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* ignore */ }
  }
  function hideBanner() { if (banner) banner.hidden = true; }
  function showBanner() { if (banner) banner.hidden = false; }

  // Apply stored choice on load
  if (getConsent() === 'accepted') {
    loadMap();
  } else if (getConsent() === null) {
    showBanner();
  }

  if (banner) {
    banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
      setConsent('accepted'); loadMap(); hideBanner();
    });
    banner.querySelector('[data-cookie-decline]')?.addEventListener('click', () => {
      setConsent('declined'); hideBanner();
    });
  }
  // Manual "Show map" — loading the map is itself consent to that one cookie
  mapWrap?.querySelector('[data-map-load]')?.addEventListener('click', () => {
    setConsent('accepted'); loadMap(); hideBanner();
  });
  // Re-open the banner from the footer "Cookie settings" link
  document.querySelector('[data-cookie-reopen]')?.addEventListener('click', (e) => {
    e.preventDefault(); showBanner();
  });

  /* --- Booking form (Formspree, AJAX with inline status) --- */
  const form = document.querySelector('[data-booking-form]');
  if (form) {
    const statusEl = form.querySelector('[data-form-status]');
    const submitBtn = form.querySelector('.booking-submit');
    const setStatus = (msg, type) => {
      statusEl.textContent = msg;
      statusEl.classList.remove('is-success', 'is-error');
      if (type) statusEl.classList.add('is-' + type);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Native validation first
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      setStatus('', null);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          form.reset();
          setStatus("Thanks — we've received your enquiry and will be in touch shortly.", 'success');
        } else {
          const data = await response.json().catch(() => null);
          const msg = data && data.errors && data.errors.length
            ? data.errors.map((err) => err.message).join(' ')
            : 'Sorry, something went wrong. Please call us on 020 8552 1953 and we’ll help.';
          setStatus(msg, 'error');
        }
      } catch (err) {
        setStatus('Sorry, we couldn’t send your enquiry just now. Please check your connection or call us on 020 8552 1953.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  /* --- Scroll reveal --- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );
    reveals.forEach((el) => {
      // Anything already within (or near) the viewport at load reveals immediately —
      // no dependence on an async observer tick, so no first-paint flash.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        el.classList.add('is-visible');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }
})();
