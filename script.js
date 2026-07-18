/* ==========================================================
   Mzuzu Islamic Institute — Scripts
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Sticky header: shadow + auto-hide/reveal on scroll ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    const y = window.scrollY;

    if (y > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    // Navbar stays visible at all times while scrolling.
    header.classList.remove('nav-hidden');

    const toTop = document.getElementById('toTop');
    if (toTop) toTop.classList.toggle('show', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const nav       = document.getElementById('nav');
  const navOverlay = document.getElementById('navOverlay');

  const openNav = () => {
    nav.classList.add('open');
    navToggle.classList.add('open');
    if (navOverlay) navOverlay.classList.add('open');
    header.classList.remove('nav-hidden');
    document.body.style.overflow = 'hidden';
  };
  const closeNav = () => {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.contains('open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    if (navOverlay) navOverlay.addEventListener('click', closeNav);
  }

  /* ---------- Active nav link based on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const setActive = () => {
    const y = window.scrollY + 120;
    let current = '';
    sections.forEach(s => {
      if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
        current = s.id;
      }
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });

  /* ---------- Back-to-top ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Hero slider ---------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots .dot');
  let slideIdx = 0;
  let slideTimer;

  const goToSlide = (n) => {
    slideIdx = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === slideIdx));
    dots.forEach((d, i) => d.classList.toggle('active', i === slideIdx));
  };
  const nextSlide = () => goToSlide(slideIdx + 1);
  const startSlider = () => { slideTimer = setInterval(nextSlide, 6000); };
  const stopSlider  = () => clearInterval(slideTimer);

  dots.forEach(d => {
    d.addEventListener('click', () => {
      stopSlider();
      goToSlide(parseInt(d.dataset.index, 10));
      startSlider();
    });
  });
  if (slides.length) startSlider();

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        animateCounter(en.target);
        counterObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObs.observe(c));

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.section-head, .about-content, .about-media, .program-card, .why-card, ' +
    '.principal-media, .principal-content, .gallery-item, .contact-info, .contact-form, .info-card'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => revealObs.observe(el));

  /* ---------- Gallery lightbox ---------- */
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let currentIdx = 0;

  const openLightbox = (i) => {
    currentIdx = i;
    lbImg.src = items[i].getAttribute('href');
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  };
  const navLightbox = (dir) => {
    currentIdx = (currentIdx + dir + items.length) % items.length;
    lbImg.src = items[currentIdx].getAttribute('href');
  };

  items.forEach((it, i) => {
    it.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(i);
    });
  });
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', () => navLightbox(-1));
  if (lbNext)  lbNext.addEventListener('click', () => navLightbox(1));
  if (lb) lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navLightbox(1);
    if (e.key === 'ArrowLeft')  navLightbox(-1);
  });

  /* ---------- Lightbox swipe on mobile ---------- */
  if (lb) {
    let lbTouchX = 0;
    lb.addEventListener('touchstart', (e) => { lbTouchX = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - lbTouchX;
      if (Math.abs(dx) > 50) navLightbox(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ---------- Contact form (client-side handler) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        status.textContent = 'Please fill in your name, email and message.';
        status.className = 'form-status error';
        return;
      }
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        status.textContent = 'Please enter a valid email address.';
        status.className = 'form-status error';
        return;
      }

      // Compose a mailto fallback so message reaches the institute
      const subject = encodeURIComponent('[TIF Enquiry] ' + (form.subject.value || 'Inquiry'));
      const body = encodeURIComponent(
        'Name: ' + name +
        '\nPhone: ' + (form.phone.value || '—') +
        '\nEmail: ' + email +
        '\n\nMessage:\n' + message
      );
      window.location.href = `mailto:Twareequlihsaanmw@outlook.com?subject=${subject}&body=${body}`;

      status.textContent = 'Opening your email app… Jazak Allahu Khairan!';
      status.className = 'form-status success';
      form.reset();
    });
  }
});
