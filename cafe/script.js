/* ─────────────────────────────────────────
   Sucrée — script.js
───────────────────────────────────────── */

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
let cursorX = 0, cursorY = 0;
let targetX = 0, targetY = 0;

document.addEventListener('mousemove', e => {
  targetX = e.clientX;
  targetY = e.clientY;
});

// Smooth cursor follow
(function animateCursor() {
  cursorX += (targetX - cursorX) * 0.18;
  cursorY += (targetY - cursorY) * 0.18;
  cursor.style.left = cursorX + 'px';
  cursor.style.top  = cursorY + 'px';
  requestAnimationFrame(animateCursor);
})();

// Grow on hoverable elements
document.querySelectorAll('a, button, .menu-card, .tab').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});


// ── STICKY NAV ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 60);
}, { passive: true });


// ── SPRINKLES ──
const sprinkleContainer = document.getElementById('sprinkles');
const sprinkleColors = ['#ff8fab','#ffc2d4','#e8637e','#ffd6e0','#ffb3c6','#d4a84b','#fff0f3'];
const sprinkleCount = 28;

for (let i = 0; i < sprinkleCount; i++) {
  const s = document.createElement('div');
  s.classList.add('sprinkle');
  const w = Math.random() * 6 + 4;
  const h = Math.random() * 14 + 6;
  s.style.cssText = `
    width: ${w}px;
    height: ${h}px;
    left: ${Math.random() * 100}%;
    background: ${sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)]};
    animation-duration: ${Math.random() * 8 + 6}s;
    animation-delay: -${Math.random() * 10}s;
    border-radius: 4px;
    opacity: ${Math.random() * 0.5 + 0.3};
  `;
  sprinkleContainer.appendChild(s);
}


// ── MENU TABS ──
const tabs = document.querySelectorAll('.tab');
const grids = document.querySelectorAll('.menu-grid');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    grids.forEach(g => {
      const wasActive = g.classList.contains('active');
      g.classList.remove('active');
      g.style.display = 'none';

      if (g.id === 'tab-' + target) {
        g.style.display = 'grid';
        // Force reflow for animation
        void g.offsetWidth;
        g.classList.add('active');

        // Re-trigger reveal on cards inside this tab
        g.querySelectorAll('.reveal').forEach((el, i) => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), i * 80);
        });
      }
    });
  });
});


// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));


// ── PARALLAX TREATS (hero emojis) ──
const treats = document.querySelectorAll('.treat');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  treats.forEach((t, i) => {
    const speed = (i % 2 === 0 ? 0.08 : 0.05);
    t.style.transform = `translateY(${scrollY * speed}px)`;
  });
}, { passive: true });


// ── MARQUEE PAUSE ON HOVER ──
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.parentElement.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.parentElement.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}


// ── CARD TILT ON HOVER ──
document.querySelectorAll('.menu-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'transform 0.1s ease, box-shadow 0.25s';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.35s ease, box-shadow 0.25s';
  });
});
