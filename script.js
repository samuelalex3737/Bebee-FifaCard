/* ═══════════════════════════════════════════
   VALENTINE'S PACK OPENING — SCRIPT
   FIFA Ultimate Team Style Experience
   ═══════════════════════════════════════════ */

/* ── PERSONALIZATION — Edit these! ────────── */
const CONFIG = {
  // Her name (displayed on the card)
  girlfriendName: "AIMEE",

  // Romantic message on the final screen
  message: `Every day with you feels like pulling a 99-rated card 
from a free pack — unbelievably lucky.

Happy Valentine's Day bebee 😚💖, I love you 💕`,

  // Her nationality (emoji flag)
  nationalityFlag: "\uD83C\uDDEE\uD83C\uDDF3",

  // Card position — a romantic abbreviation
  position: "CDM", // "Central Defensive Midfielder"

  // Club name
  clubName: "Kannur FC",

  // Overall rating
  rating: 99,

  // FIFA-style stat abbreviations → romantic labels
  stats: [
    { key: "PWR", label: "FAT", fullLabel: "POWER", value: 99 },
    { key: "TDY", label: "Tiddies", fullLabel: "TIDDIES", value: 99 },
    { key: "HGT", label: "HEIGT", fullLabel: "HEIGHT", value: 47 },
    { key: "BUNDA", label: "BUNDA", fullLabel: "BUNDA", value: 99 },
    { key: "VAL", label: "VAL", fullLabel: "VALORANT", value: 15 },
    { key: "MUST", label: "MUSTY", fullLabel: "MUSTINESS", value: 67 },
  ],

  // Path to her photo (place image in assets/images/)
  // Leave empty string to show silhouette
  photoUrl: "assets/images/Picture.jpeg",

  // Secret message when she taps the card (Easter egg)
  secretMessage: "That injury was holding you back fr 💯",

  // Audio file paths (place files in assets/audio/)
  audio: {
    buildup: "assets/audio/buildup.mp3",
    reveal: "assets/audio/reveal.mp3",
    bg: "assets/audio/ordinary.mpeg",
  },
};

/* ═══════════════════════════════════════════
   STATE MACHINE
   ═══════════════════════════════════════════ */
const PHASES = ["intro", "pack", "buildup", "card", "message"];
let currentPhase = 0;
let isAnimating = false;
let audioEnabled = false;

/* ═══════════════════════════════════════════
   DOM REFERENCES
   ═══════════════════════════════════════════ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const screens = {
  intro: $("#intro-screen"),
  pack: $("#pack-screen"),
  buildup: $("#buildup-screen"),
  card: $("#card-screen"),
  message: $("#message-screen"),
};

const els = {
  openBtn: $("#open-pack-btn"),
  packCard: $("#pack-card"),
  packRays: $("#pack-rays"),
  ratingFlash: $("#rating-flash"),
  positionFlash: $("#position-flash"),
  flagFlash: $("#flag-flash"),
  futCard: $("#fut-card"),
  futCardWrap: $("#fut-card-wrapper"),
  cardRating: $("#card-rating"),
  cardPosition: $("#card-position"),
  cardName: $("#card-name"),
  cardPhoto: $("#card-photo"),
  playerImg: $("#player-img"),
  silhouette: $("#photo-silhouette"),
  cardFlagIcon: $("#card-flag-icon"),
  cardFlagIcon2: $("#card-flag-icon-2"),
  cardStats: $("#card-stats"),
  cardHint: $("#card-hint"),
  continueBtn: $("#continue-btn"),
  messageTitle: $("#message-title"),
  messageBody: $("#message-body"),
  miniName: $("#mini-name"),
  detClub: $("#det-club"),
  replayBtn: $("#replay-btn"),
  secretOverlay: $("#secret-overlay"),
  secretText: $("#secret-text"),
  closeSecret: $("#close-secret"),
  audioToggle: $("#audio-toggle"),
  canvas: $("#particle-canvas"),
  audioBg: $("#audio-bg"),
  audioBuildup: $("#audio-buildup"),
  audioReveal: $("#audio-reveal"),
};

/* ═══════════════════════════════════════════
   INITIALIZATION
   ═══════════════════════════════════════════ */
function init() {
  // Populate card data from CONFIG
  els.cardRating.textContent = CONFIG.rating;
  els.cardPosition.textContent = CONFIG.position;
  els.cardName.textContent = CONFIG.girlfriendName;
  els.cardFlagIcon.textContent = CONFIG.nationalityFlag;
  els.cardFlagIcon2.textContent = CONFIG.nationalityFlag;
  els.miniName.textContent = CONFIG.girlfriendName;
  els.messageBody.textContent = CONFIG.message;
  els.detClub.textContent = CONFIG.clubName;
  els.secretText.textContent = CONFIG.secretMessage;

  // Position flash text
  els.positionFlash.textContent = CONFIG.position;

  // Flag flash
  els.flagFlash.textContent = CONFIG.nationalityFlag;

  // Stats
  populateStats();

  // Player photo
  if (CONFIG.photoUrl) {
    els.playerImg.src = CONFIG.photoUrl;
    els.playerImg.classList.remove("hidden");
    els.silhouette.classList.add("hidden");
    els.playerImg.onerror = () => {
      els.playerImg.classList.add("hidden");
      els.silhouette.classList.remove("hidden");
    };
  }

  // Resize canvas
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Bind events
  bindEvents();

  // Auto-play background music on first user interaction
  autoPlayMusic();
}

function populateStats() {
  const cols = els.cardStats.querySelectorAll(".stat-col");
  cols.forEach((col) => (col.innerHTML = ""));

  CONFIG.stats.forEach((stat, i) => {
    const colIndex = i < 3 ? 0 : 1;
    const div = document.createElement("div");
    div.className = "stat-item";
    div.style.opacity = "0";
    div.innerHTML = `
      <span class="stat-val" data-target="${stat.value}">0</span>
      <span class="stat-label" title="${stat.fullLabel}">${stat.label}</span>
    `;
    cols[colIndex].appendChild(div);
  });
}

/* ═══════════════════════════════════════════
   AUTO-PLAY MUSIC
   ═══════════════════════════════════════════ */
function autoPlayMusic() {
  // Try to play immediately (may be blocked by browser)
  tryPlayAudio(els.audioBg);
  if (els.audioBg && !els.audioBg.paused) {
    audioEnabled = true;
    els.audioToggle.textContent = "🔊";
  }

  // Fallback: play on first user interaction (click/touch/key)
  const startMusicOnInteraction = () => {
    if (els.audioBg && els.audioBg.paused) {
      tryPlayAudio(els.audioBg);
      audioEnabled = true;
      els.audioToggle.textContent = "🔊";
    }
    document.removeEventListener("click", startMusicOnInteraction);
    document.removeEventListener("touchstart", startMusicOnInteraction);
    document.removeEventListener("keydown", startMusicOnInteraction);
  };

  document.addEventListener("click", startMusicOnInteraction, { once: true });
  document.addEventListener("touchstart", startMusicOnInteraction, { once: true });
  document.addEventListener("keydown", startMusicOnInteraction, { once: true });
}

/* ═══════════════════════════════════════════
   EVENT BINDINGS
   ═══════════════════════════════════════════ */
function bindEvents() {
  // Open pack
  els.openBtn.addEventListener("click", startPackOpening);

  // Continue to message
  els.continueBtn.addEventListener("click", () => goToPhase("message"));

  // Replay
  els.replayBtn.addEventListener("click", replay);

  // Card easter egg
  els.futCard.addEventListener("click", showSecret);

  // Close secret
  els.closeSecret.addEventListener("click", hideSecret);

  // Audio toggle
  els.audioToggle.addEventListener("click", toggleAudio);
}

/* ═══════════════════════════════════════════
   PHASE TRANSITIONS
   ═══════════════════════════════════════════ */
function goToPhase(phaseName) {
  // Hide all screens
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  // Show target
  screens[phaseName].classList.add("active");
  currentPhase = PHASES.indexOf(phaseName);
}

/* ═══════════════════════════════════════════
   PHASE 1 → 2: START PACK OPENING
   ═══════════════════════════════════════════ */
function startPackOpening() {
  if (isAnimating) return;
  isAnimating = true;

  // Try to play buildup audio on user interaction
  tryPlayAudio(els.audioBuildup);

  // Transition to pack screen
  goToPhase("pack");

  // Start pack shake sequence after a beat
  setTimeout(() => {
    packShakeSequence();
  }, 600);
}

/* ═══════════════════════════════════════════
   PHASE 2: PACK SHAKE + EXPLODE
   ═══════════════════════════════════════════ */
function packShakeSequence() {
  const pack = els.packCard;

  // Start shaking
  pack.classList.add("shaking");

  // Intensify over 2 seconds, then explode
  setTimeout(() => {
    // Screen flash
    createScreenFlash();

    // Explode pack
    pack.classList.remove("shaking");
    pack.classList.add("exploding");

    // Try reveal audio
    tryPlayAudio(els.audioReveal);

    // Transition to buildup
    setTimeout(() => {
      goToPhase("buildup");
      startBuildup();
    }, 500);
  }, 2000);
}

/* ═══════════════════════════════════════════
   PHASE 3: BUILDUP — Rating + Position flash
   ═══════════════════════════════════════════ */
function startBuildup() {
  // Flash screen
  createScreenFlash();

  // Rating slam
  setTimeout(() => {
    els.ratingFlash.classList.add("animate");
  }, 200);

  // Position reveal
  setTimeout(() => {
    els.positionFlash.classList.add("animate");
  }, 900);

  // Flag reveal
  setTimeout(() => {
    els.flagFlash.classList.add("animate");
  }, 1400);

  // Move to card reveal
  setTimeout(() => {
    createScreenFlash();
    setTimeout(() => {
      goToPhase("card");
      startCardReveal();
    }, 300);
  }, 2600);
}

/* ═══════════════════════════════════════════
   PHASE 4: CARD REVEAL
   ═══════════════════════════════════════════ */
function startCardReveal() {
  const card = els.futCard;

  // Animate card entrance
  card.style.animation = "card-reveal-in 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards";

  // Show the hint and continue button with their animations
  els.cardHint.classList.add("show");
  els.continueBtn.classList.add("show");

  // Launch particles
  launchParticles();

  // Haptic feedback on mobile
  triggerHaptic();

  // Animate stats counting up
  setTimeout(() => {
    animateStats();
  }, 1000);

  // Try background music
  setTimeout(() => {
    tryPlayAudio(els.audioBg);
    if (els.audioBg && !els.audioBg.paused) {
      audioEnabled = true;
      els.audioToggle.textContent = "🔊";
    }
  }, 1500);

  isAnimating = false;
}

/* ═══════════════════════════════════════════
   STAT ANIMATION — Count up from 0 → value
   ═══════════════════════════════════════════ */
function animateStats() {
  const statItems = els.cardStats.querySelectorAll(".stat-item");

  statItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.animation = `stat-count-in 0.4s ease forwards`;
      item.style.opacity = "1";

      const valEl = item.querySelector(".stat-val");
      const target = parseInt(valEl.dataset.target) || 99;
      countUp(valEl, target, 600);
    }, index * 150);
  });
}

function countUp(el, target, duration) {
  const start = 0;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * ease);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ═══════════════════════════════════════════
   PARTICLE SYSTEM (Canvas)
   ═══════════════════════════════════════════ */
let canvasEl, ctx;
let particles = [];
let animatingParticles = false;

function resizeCanvas() {
  if (!canvasEl) canvasEl = $("#particle-canvas");
  if (!ctx) ctx = canvasEl.getContext("2d");
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
}

function launchParticles() {
  particles = [];

  // Confetti particles
  for (let i = 0; i < 80; i++) {
    particles.push(createConfetti());
  }

  // Heart particles
  for (let i = 0; i < 20; i++) {
    particles.push(createHeart());
  }

  if (!animatingParticles) {
    animatingParticles = true;
    renderParticles();
  }
}

function createConfetti() {
  const colors = ["#ffd700", "#ff2d7b", "#ff6b9d", "#e91e8c", "#ffed4a", "#ffffff", "#9b59b6"];
  return {
    x: canvasEl.width / 2 + (Math.random() - 0.5) * 100,
    y: canvasEl.height / 2,
    vx: (Math.random() - 0.5) * 18,
    vy: (Math.random() - 1) * 16 - 4,
    size: Math.random() * 8 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 15,
    gravity: 0.15 + Math.random() * 0.1,
    opacity: 1,
    decay: 0.005 + Math.random() * 0.008,
    type: "confetti",
    shape: Math.random() > 0.5 ? "rect" : "circle",
  };
}

function createHeart() {
  return {
    x: canvasEl.width / 2 + (Math.random() - 0.5) * 200,
    y: canvasEl.height / 2 + (Math.random() - 0.5) * 100,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 1) * 10 - 2,
    size: Math.random() * 12 + 6,
    color: Math.random() > 0.5 ? "#ff2d7b" : "#ff6b9d",
    gravity: 0.08,
    opacity: 1,
    decay: 0.006 + Math.random() * 0.006,
    type: "heart",
  };
}

function renderParticles() {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  particles = particles.filter((p) => p.opacity > 0);

  if (particles.length === 0) {
    animatingParticles = false;
    return;
  }

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.opacity -= p.decay;
    if (p.opacity < 0) p.opacity = 0;

    ctx.save();
    ctx.globalAlpha = p.opacity;

    if (p.type === "confetti") {
      p.rotation += p.rotationSpeed;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (p.type === "heart") {
      drawHeart(ctx, p.x, p.y, p.size, p.color);
    }

    ctx.restore();
  });

  requestAnimationFrame(renderParticles);
}

function drawHeart(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // Left curve
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
  // Bottom left
  ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.5, x, y + size);
  // Bottom right
  ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.5, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
  // Right curve
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
  ctx.closePath();
  ctx.fill();
}

/* ═══════════════════════════════════════════
   SCREEN FLASH
   ═══════════════════════════════════════════ */
function createScreenFlash() {
  const flash = document.createElement("div");
  flash.className = "screen-flash";
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 600);
}

/* ═══════════════════════════════════════════
   EASTER EGG — Secret Message
   ═══════════════════════════════════════════ */
function showSecret() {
  if (isAnimating) return;
  els.secretOverlay.classList.add("active");
  triggerHaptic();
}

function hideSecret() {
  els.secretOverlay.classList.remove("active");
}

/* ═══════════════════════════════════════════
   HAPTIC FEEDBACK (Mobile)
   ═══════════════════════════════════════════ */
function triggerHaptic() {
  if ("vibrate" in navigator) {
    navigator.vibrate([50, 30, 80]);
  }
}

/* ═══════════════════════════════════════════
   AUDIO
   ═══════════════════════════════════════════ */
function tryPlayAudio(audioEl) {
  if (!audioEl) return;
  audioEl.volume = 0.5;
  const playPromise = audioEl.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Browser blocked autoplay — that's ok
    });
  }
}

function toggleAudio() {
  if (!els.audioBg) return;

  if (els.audioBg.paused) {
    tryPlayAudio(els.audioBg);
    els.audioToggle.textContent = "🔊";
    audioEnabled = true;
  } else {
    els.audioBg.pause();
    els.audioToggle.textContent = "🔇";
    audioEnabled = false;
  }
}

/* ═══════════════════════════════════════════
   REPLAY
   ═══════════════════════════════════════════ */
function replay() {
  // Reset all animations
  els.packCard.classList.remove("shaking", "exploding");
  els.ratingFlash.classList.remove("animate");
  els.positionFlash.classList.remove("animate");
  els.flagFlash.classList.remove("animate");
  els.futCard.style.animation = "none";
  els.ratingFlash.style.opacity = "0";
  els.ratingFlash.style.transform = "scale(3)";

  // Reset card-hint and continue-btn animations
  els.cardHint.classList.remove("show");
  els.continueBtn.classList.remove("show");

  // Reset stats
  populateStats();

  // Clear particles
  particles = [];
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  // Force reflow
  void els.packCard.offsetWidth;

  // Reset phase
  currentPhase = 0;
  isAnimating = false;
  goToPhase("intro");
}

/* ═══════════════════════════════════════════
   LAUNCH
   ═══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", init);
