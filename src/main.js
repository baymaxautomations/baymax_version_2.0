import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// const a = 2

// Sin wave animation for hero card rows
// const topCards = document.querySelectorAll('#cardsUpRow .cardHero');
// const botCards = document.querySelectorAll('#cardsUpDown .cardHero');

// const amplitude = 18;   // px — how much cards travel up/down
// const speed     = 0.0012; // wave speed (lower = slower)
// const phaseStep = 0.8;   // phase offset between neighbouring cards

// function animateCards(timestamp) {
//   const t = timestamp * speed;

//   topCards.forEach((card, i) => {
//     const y = amplitude * Math.sin(t + i * phaseStep);
//     card.style.transform = `translateY(${y}px)`;
//   });

//   // Bottom row runs opposite phase (+ Math.PI = 180° offset)
//   botCards.forEach((card, i) => {
//     const y = amplitude * Math.sin(t + i * phaseStep + Math.PI);
//     card.style.transform = `translateY(${y}px)`;
//   });

//   requestAnimationFrame(animateCards);
// }

// requestAnimationFrame(animateCards);


// ── Infinite horizontal scroll for hero card rows ──────────────────────────

// function setupInfiniteRow(rowId, direction = -1) {
//   const row = document.getElementById(rowId)
//   if (!row) return

//   const cards = Array.from(row.querySelectorAll('.cardHero'))
//   if (!cards.length) return

//   // Clone all cards and append for seamless looping
//   cards.forEach(card => {
//     const clone = card.cloneNode(true)
//     clone.setAttribute('aria-hidden', 'true')
//     row.appendChild(clone)
//   })

//   // Total width of original cards (including gap)
//   const gap = 8 // matches gap-2 (0.5rem = 8px)
//   const cardWidth = cards[0].offsetWidth
//   const totalWidth = (cardWidth + gap) * cards.length

//   // Start position: direction 1 = starts at -totalWidth (scrolls right)
//   //                 direction -1 = starts at 0 (scrolls left)
//   const startX = direction === -1 ? 0 : -totalWidth

//   gsap.set(row, { x: startX })

//   gsap.to(row, {
//     x: direction === -1 ? -totalWidth : 0,
//     duration: 18,          // seconds for one full cycle — lower = faster
//     ease: 'none',          // constant speed, no easing
//     repeat: -1,            // infinite
//     modifiers: {
//       x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
//     }
//   })
// }

// Top row scrolls left → direction -1
// // Bottom row scrolls right → direction 1
// setupInfiniteRow('cardsUpRow', -1)
// setupInfiniteRow('cardsUpDown', 1)


function updateTime() {
  const now = new Date();

  const day = now.getDate();
  const month = now.toLocaleString('en-US', { month: 'long' });
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  document.getElementById('clock').textContent = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
}

setInterval(updateTime, 1000);
updateTime();


// ── Scroll Y to Scroll X Animation ──────────────────────────────────────────
// const content = document.getElementById('content');
// if (content) {
//   // Get the parent section that contains the content
//   const section = content.closest('section');

//   gsap.to(content, {
//     scrollLeft: content.scrollWidth,
//     ease: 'none',
//     scrollTrigger: {
//       trigger: section,
//       start: 'top -0%',
//       end: 'bottom 20%',
//       scrub: 1.5,
//       pin: false,
//       markers: true // set to true for debugging
//     }
//   });
// }

// 2nd version gsap code

// ─── GSAP Horizontal Scroll (Scroll-X on Scroll-Y) ───────────────────────────

const initHorizontalScroll = () => {
  const content = document.getElementById('content');
  if (!content) return;

  const section = content.closest('section');
  const NAV_HEIGHT = document.querySelector('nav')?.offsetHeight ?? 64; // adjust selector

  // Total horizontal distance to scroll
  const totalScroll = content.scrollWidth - content.clientWidth;

  // Pin the section and drive scrollLeft via ScrollTrigger
  const st = ScrollTrigger.create({
    trigger: section,
    start: `top top+=${NAV_HEIGHT}`,   // 🔑 top of section hits just below navbar
    end: () => `+=${totalScroll}`,      // 🔑 pin for exactly as long as needed
    pin: true,                          // 🔑 pins the section while scrolling horizontally
    pinSpacing: true,                   // adds spacer so next section pushes naturally
    anticipatePin: 1,
    scrub: 1.5,                         // 🔑 smooth lag for cinematic feel
    onUpdate: (self) => {
      content.scrollLeft = self.progress * totalScroll;

      // Optional: highlight active card dot
      const cardCount = content.children.length;
      const activeIndex = Math.round(self.progress * (cardCount - 1));
      document.querySelectorAll('.card-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    },
    // 🔑 Only allow next-section scroll AFTER user has completed full horizontal scroll
    onLeave: () => {
      // ScrollTrigger naturally handles this via pinSpacing — no extra logic needed
    },
  });

  // Recalculate on resize (important for responsive)
  ScrollTrigger.addEventListener('refreshInit', () => {
    st.vars.end = `+=${content.scrollWidth - content.clientWidth}`;
  });
};

// Init after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  initHorizontalScroll();
});