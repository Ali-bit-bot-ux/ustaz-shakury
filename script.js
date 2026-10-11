/* ============================================================
   USTAZ – ҰЛЫТҰЛҒА  |  script.js
   Envelope Open  •  Countdown  •  Scroll Reveal  •  RSVP
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------
     ELEMENTS
  ---------------------------------------- */
  const envelopeScreen   = document.getElementById('envelopeScreen');
  const invitationContent = document.getElementById('invitationContent');
  const waxSealBtn       = document.getElementById('waxSealBtn');
  const topFlap          = document.getElementById('topFlap');
  const rsvpForm         = document.getElementById('rsvpForm');
  const rsvpSuccessMsg   = document.getElementById('rsvpSuccessMsg');
  const submitBtn        = document.getElementById('submitBtn');
  const shareBtn         = document.getElementById('shareBtn');
  const soundToggleBtn   = document.getElementById('soundToggleBtn');
  const soundIcon        = document.getElementById('soundIcon');
  const tributeVideo     = document.getElementById('tributeVideo');

  /* ----------------------------------------
     1. ENVELOPE OPEN ANIMATION
  ---------------------------------------- */
  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Add a ripple click effect on the wax seal
    waxSealBtn.style.transform = 'translate(-50%, -50%) scale(0.9)';
    setTimeout(() => {
      waxSealBtn.style.transition = 'all 0.4s ease';
      waxSealBtn.style.transform  = 'translate(-50%, -50%) scale(1)';
    }, 120);

    // Step 1: Add "opening" class → CSS handles flap rotation
    setTimeout(() => {
      envelopeScreen.classList.add('opening');
      topFlap && topFlap.classList.add('opened');
    }, 200);

    // Step 2: Fade out envelope screen
    setTimeout(() => {
      envelopeScreen.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      envelopeScreen.style.opacity    = '0';
      envelopeScreen.style.transform  = 'scale(0.95)';
    }, 1100);

    // Step 3: Show invitation content
    setTimeout(() => {
      envelopeScreen.style.display = 'none';
      invitationContent.classList.remove('hidden');
      invitationContent.classList.add('visible-anim');
      window.scrollTo(0, 0);
      initScrollReveal();
      startParticles();
    }, 1800);
  }

  // Bind seal click + keyboard
  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', openEnvelope);
    waxSealBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
    });
  }

  /* ----------------------------------------
     2. PARTICLE / SPARKLE EFFECT ON OPEN
  ---------------------------------------- */
  function startParticles() {
    const colors = ['#D4AF37', '#E8CB6A', '#FAF7F2', '#fff', '#C5A059'];
    for (let i = 0; i < 26; i++) {
      createParticle(colors[Math.floor(Math.random() * colors.length)]);
    }
  }

  function createParticle(color) {
    const el = document.createElement('div');
    const size = Math.random() * 8 + 4;
    Object.assign(el.style, {
      position:        'fixed',
      pointerEvents:   'none',
      zIndex:          '9999',
      width:           size + 'px',
      height:          size + 'px',
      borderRadius:    '50%',
      background:      color,
      left:            Math.random() * 100 + 'vw',
      top:             '-20px',
      opacity:         '0.9',
      boxShadow:       `0 0 ${size * 2}px ${color}`,
      transition:      'none',
    });
    document.body.appendChild(el);

    const duration = Math.random() * 1200 + 800;
    const endY     = Math.random() * 80 + 40;
    const endX     = (Math.random() - 0.5) * 60;

    el.animate([
      { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(${endY}vh) translateX(${endX}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], { duration, easing: 'ease-in', fill: 'forwards' })
      .onfinish = () => el.remove();
  }

  /* ----------------------------------------
     3. SCROLL REVEAL (Intersection Observer)
  ---------------------------------------- */
  function initScrollReveal() {
    const revealTargets = invitationContent.querySelectorAll(
      '.section-card, .card-hero, .timeline-item, .slogan-badge'
    );

    revealTargets.forEach((el, i) => {
      el.classList.add('reveal');
      if (i % 3 === 1) el.classList.add('reveal-delay-1');
      if (i % 3 === 2) el.classList.add('reveal-delay-2');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealTargets.forEach(el => observer.observe(el));
  }

  /* ----------------------------------------
     4. RSVP FORM SUBMISSION
  ---------------------------------------- */
  window.handleRsvpSubmit = function () {
    const nameInput  = document.getElementById('guestName');
    const attendance = document.querySelector('input[name="attendance"]:checked');

    if (!nameInput || !nameInput.value.trim()) {
      nameInput && nameInput.focus();
      nameInput && (nameInput.style.borderBottomColor = '#c0392b');
      setTimeout(() => nameInput && (nameInput.style.borderBottomColor = ''), 1200);
      return;
    }

    const name    = nameInput.value.trim();
    const status  = attendance ? attendance.value : 'Жауап берілмеді';

    // Store locally
    try {
      const existing = JSON.parse(localStorage.getItem('ustaz_rsvp') || '[]');
      existing.push({ name, status, timestamp: new Date().toISOString() });
      localStorage.setItem('ustaz_rsvp', JSON.stringify(existing));
    } catch (_) {}

    // Build WhatsApp share link (pre-fills organizer number)
    const message   = encodeURIComponent(
      `✨ RSVP — «Ұстаз – ұлы тұлға»\n` +
      `Аты-жөні: ${name}\n` +
      `Қатысу: ${status}`
    );
    const waLink = `https://wa.me/?text=${message}`;

    // Animate form → success
    if (rsvpForm) {
      rsvpForm.style.transition = 'opacity 0.4s ease';
      rsvpForm.style.opacity    = '0';
    }
    setTimeout(() => {
      if (rsvpForm)        rsvpForm.style.display       = 'none';
      if (rsvpSuccessMsg)  rsvpSuccessMsg.classList.remove('hidden');

      // Auto-open WhatsApp after short delay
      setTimeout(() => { window.open(waLink, '_blank'); }, 600);
    }, 440);
  };

  /* ----------------------------------------
     5. SHARE BUTTON (Web Share API)
  ---------------------------------------- */
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: '«Ұстаз – ұлы тұлға» — Салтанатты шақыру',
        text:  '✨ Ұстазға құрмет – ұрпаққа өнеге! Мерекелік концерттік бағдарламаға шақыру.',
        url:   window.location.href,
      };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(window.location.href);
          showToast('Сілтеме көшірілді! 📋');
        }
      } catch (_) {
        await navigator.clipboard.writeText(window.location.href).catch(() => {});
        showToast('Сілтеме көшірілді! 📋');
      }
    });
  }

  /* ----------------------------------------
     6. TOAST NOTIFICATION
  ---------------------------------------- */
  function showToast(message) {
    const existing = document.getElementById('toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast';
    Object.assign(toast.style, {
      position:      'fixed',
      bottom:        '30px',
      left:          '50%',
      transform:     'translateX(-50%) translateY(20px)',
      background:    '#2C2424',
      color:         '#D4AF37',
      padding:       '10px 22px',
      borderRadius:  '50px',
      fontSize:      '0.82rem',
      fontWeight:    '600',
      zIndex:        '9999',
      boxShadow:     '0 4px 20px rgba(0,0,0,0.3)',
      opacity:       '0',
      transition:    'all 0.4s ease',
      whiteSpace:    'nowrap',
      letterSpacing: '0.05em',
    });
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 450);
    }, 2800);
  }

  /* ----------------------------------------
     7. SOUND / BELL TOGGLE (decorative)
  ---------------------------------------- */
  let soundOn = true;
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundOn = !soundOn;
      soundIcon.textContent = soundOn ? '🔔' : '🔕';
      if (tributeVideo) {
        tributeVideo.muted = !soundOn;
      }
      showToast(soundOn ? 'Дыбыс қосылды 🔔' : 'Дыбыс өшірілді 🔕');
    });
  }

  /* ----------------------------------------
     8. AUTO-PLAY VIDEO ON SCROLL INTO VIEW
  ---------------------------------------- */
  if (tributeVideo) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Don't autoplay with sound (browser policy) — just ensure it's ready
          tributeVideo.load();
        }
      });
    }, { threshold: 0.5 });
    videoObserver.observe(tributeVideo);
  }

  /* ----------------------------------------
     9. SMOOTH SCROLL FOR ANCHOR LINKS
  ---------------------------------------- */
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ----------------------------------------
     10. PREVENT CONTEXT MENU ON LONG-PRESS
         (common mobile UX for invitation sites)
  ---------------------------------------- */
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName !== 'VIDEO' && e.target.tagName !== 'A') {
      e.preventDefault();
    }
  });

  /* ----------------------------------------
     11. TOUCH RIPPLE EFFECT ON BUTTONS
  ---------------------------------------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-primary, .nav-round-btn, .wax-seal');
    if (!btn) return;

    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 1.5;

    Object.assign(ripple.style, {
      position:      'absolute',
      width:         size + 'px',
      height:        size + 'px',
      borderRadius:  '50%',
      background:    'rgba(255,255,255,0.18)',
      pointerEvents: 'none',
      left:          (e.clientX - rect.left - size / 2) + 'px',
      top:           (e.clientY - rect.top  - size / 2) + 'px',
      animation:     'rippleAnim 0.6s ease-out forwards',
    });

    if (!document.getElementById('rippleStyle')) {
      const style = document.createElement('style');
      style.id    = 'rippleStyle';
      style.textContent = `
        @keyframes rippleAnim {
          from { transform: scale(0); opacity: 1; }
          to   { transform: scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });

  /* ----------------------------------------
     12. LOADING PROGRESS BAR
  ---------------------------------------- */
  (function addProgressBar() {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      position:   'fixed',
      top:        '0', left: '0',
      height:     '3px',
      background: 'linear-gradient(90deg, #D4AF37, #E8CB6A)',
      width:      '0%',
      zIndex:     '99999',
      transition: 'width 0.2s ease',
      boxShadow:  '0 0 8px rgba(212,175,55,0.8)',
    });
    document.body.prepend(bar);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 90) { clearInterval(interval); return; }
      bar.style.width = progress + '%';
    }, 150);

    window.addEventListener('load', () => {
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(() => { bar.style.opacity = '0'; }, 400);
      setTimeout(() => bar.remove(), 900);
    });
  })();

})();
