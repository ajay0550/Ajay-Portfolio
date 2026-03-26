/* ============================================================
   AJAY GUNDU — PORTFOLIO SCRIPTS
   Custom Cursor · Nav Scroll · Canvas Particles
   Intersection Observer · Skill Bars · Form Handler
   ============================================================ */

/* ========== CUSTOM CURSOR ========== */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth trail animation
function animateTrail() {
  trailX += (mouseX - trailX) * 0.14;
  trailY += (mouseY - trailY) * 0.14;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Cursor scaling on interactive elements
document.querySelectorAll('a, button, .project-card, .cert-card, .ach-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '18px';
    cursor.style.height = '18px';
    cursorTrail.style.width  = '48px';
    cursorTrail.style.height = '48px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '10px';
    cursor.style.height = '10px';
    cursorTrail.style.width  = '32px';
    cursorTrail.style.height = '32px';
  });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorTrail.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorTrail.style.opacity = '1';
});


/* ========== NAV SCROLL ========== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* Mobile nav toggle */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ========== HERO CANVAS — PARTICLES ========== */
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x   = Math.random() * canvas.width;
    this.y   = Math.random() * canvas.height;
    this.vx  = (Math.random() - .5) * .4;
    this.vy  = (Math.random() - .5) * .4;
    this.r   = Math.random() * 1.5 + .5;
    this.a   = Math.random() * .5 + .1;
    this.color = Math.random() > .5 ? '62,207,255' : '123,92,250';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.a})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(62,207,255,${(.12 * (1 - dist / 120)).toFixed(3)})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();


/* ========== INTERSECTION OBSERVER — FADE IN ========== */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for sibling elements
      const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 0.08}s`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));


/* ========== SKILL BARS — trigger when visible ========== */
const skillGroups = document.querySelectorAll('.skill-group');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

skillGroups.forEach(g => skillObserver.observe(g));


/* ========== CONTACT FORM ========== */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn     = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('form-success');
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    // Shake the empty fields
    [document.getElementById('name'), document.getElementById('email'), document.getElementById('message')]
      .filter(f => !f.value.trim())
      .forEach(f => { f.style.borderColor = '#ff6b9d'; f.focus(); });
    return;
  }

  // Simulate send
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Sending...';

  setTimeout(() => {
    btn.querySelector('.btn-text').textContent = 'Send Message';
    btn.disabled = false;
    success.style.display = 'block';
    e.target.reset();
    setTimeout(() => { success.style.display = 'none'; }, 5000);
  }, 1200);
}


/* ========== SMOOTH SCROLL for anchor links ========== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ========== PROJECT CARD 3D TILT ========== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const tiltX  = dy * -5;
    const tiltY  = dx *  5;
    card.style.transform = `translateY(-6px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform .1s ease, border-color .35s, box-shadow .35s';
  });
});


/* ========== ACTIVE NAV LINK ON SCROLL ========== */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


/* ========== TYPED TEXT EFFECT — hero role ========== */
const heroRole = document.querySelector('.hero-role');
if (heroRole) {
  const roles = [
    'Full-Stack Developer &amp; AI Enthusiast',
    'Privacy Tech Builder',
    'Computer Vision Explorer',
    'Problem Solver &amp; Leader'
  ];
  let ri = 0, ci = 0, deleting = false;

  function type() {
    const current = roles[ri];
    const inner   = `<span class="mono">&lt;</span> ${
      deleting ? current.substring(0, ci--) : current.substring(0, ci++)
    } <span class="mono">/&gt;</span>`;
    heroRole.innerHTML = inner;

    let delay = deleting ? 40 : 80;

    if (!deleting && ci > current.length) {
      delay = 2200;
      deleting = true;
    } else if (deleting && ci < 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
      ci = 0;
      delay = 400;
    }
    setTimeout(type, delay);
  }

  // Start after hero entrance animation
  setTimeout(type, 1600);
}