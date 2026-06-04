/* ══════════════════════════════════════════
   SETUP ARGENTINA — script.js
   Scroll animations · Counters · Nav · FAQ · Form
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR — Scroll behavior ─────────── */
  const navbar = document.getElementById('navbar');

  const updateNav = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ─── NAVBAR — Smooth scroll ────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  /* ─── MOBILE MENU ───────────────────────── */
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  overlay.innerHTML = `
    <ul class="nav-links">
      <li><a href="#services">Services</a></li>
      <li><a href="#process">Process</a></li>
      <li><a href="#why-us">Why Us</a></li>
      <li><a href="#founder">About</a></li>
      <li><a href="#faq">FAQ</a></li>
    </ul>
    <a href="#contact" class="btn-nav-cta">Book Free Consultation</a>
  `;
  document.body.appendChild(overlay);

  const openMobileMenu  = () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    navToggle.setAttribute('aria-expanded', 'true');
    // Animate hamburger → X
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  };

  const closeMobileMenu = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    navToggle.setAttribute('aria-expanded', 'false');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  };

  navToggle.addEventListener('click', () => {
    if (overlay.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close on outside click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeMobileMenu();
  });

  /* ─── SCROLL ANIMATIONS ─────────────────── */
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        animateObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('[data-animate]').forEach(el => {
    animateObserver.observe(el);
  });

  /* ─── COUNTER ANIMATION ─────────────────── */
  const counters = document.querySelectorAll('.counter[data-target]');

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target);
    const duration = 1800;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ─── FAQ ACCORDION ─────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    const first = faqItems[0];
    first.classList.add('open');
    const firstAnswer = first.querySelector('.faq-answer');
    firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
  }

  /* ─── CONTACT FORM — Façade (activar backend después) ── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const country = form.querySelector('#country').value;

      if (!name || !email || !country) {
        shakeForm(form);
        highlightRequired(form);
        return;
      }
      if (!isValidEmail(email)) {
        form.querySelector('#email').style.borderColor = '#EF4444';
        return;
      }

      const submitBtn = form.querySelector('.btn-form-submit');
      const btnText   = submitBtn.querySelector('.btn-text');
      submitBtn.disabled = true;
      btnText.textContent = 'Sending...';

      setTimeout(() => {
        formSuccess.classList.add('show');
        form.reset();
        submitBtn.disabled = false;
        btnText.textContent = 'Book Free Consultation';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1200);
    });

    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
        field.style.boxShadow  = '';
      });
    });
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const shakeForm = (form) => {
    form.style.animation = 'none';
    form.offsetHeight;
    form.style.animation = 'shake 0.4s ease';
    setTimeout(() => { form.style.animation = ''; }, 400);
  };

  const highlightRequired = (form) => {
    ['name', 'email', 'country'].forEach(id => {
      const field = form.querySelector(`#${id}`);
      if (!field.value.trim()) {
        field.style.borderColor = '#EF4444';
        field.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)';
      }
    });
  };

  /* ─── ACTIVE NAV LINK on scroll ─────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '-80px 0px -60% 0px'
  });

  sections.forEach(s => activeObserver.observe(s));

  /* ─── SERVICE CARDS — Micro interaction ── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y     = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
      card.style.transform = `translateY(-3px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.3s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    });
  });

});

/* ─── CSS SHAKE ANIMATION (injected) ────── */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);
