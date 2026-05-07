/* ═══════════════════════════════════════════════════════
   CURSOR CUSTOMIZADO
═══════════════════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = -100, my = -100;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  ring.style.left = mx + 'px';
  ring.style.top = my + 'px';
});
document.querySelectorAll('button, input, a').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    ring.style.width = '50px';
    ring.style.height = '50px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    ring.style.width = '36px';
    ring.style.height = '36px';
  });
});

/* ═══════════════════════════════════════════════════════
   ESTRELAS
═══════════════════════════════════════════════════════ */
function createStars(containerId, count) {
  const c = document.getElementById(containerId);
  if (!c) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2 + 0.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%; top:${Math.random()*100}%;
      --d:${2 + Math.random()*4}s;
      --delay:-${Math.random()*4}s;
    `;
    c.appendChild(s);
  }
}
createStars('starsContainer', 80);
createStars('starsContainerFinal', 120);

/* ═══════════════════════════════════════════════════════
   PARTÍCULAS CANVAS
═══════════════════════════════════════════════════════ */
const cvs = document.getElementById('particles-canvas');
const ctx = cvs.getContext('2d');
let W, H, particles = [];
function resize() {
  W = cvs.width = window.innerWidth;
  H = cvs.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    a: Math.random(),
    hue: Math.random() > 0.6 ? 42 : (Math.random() > 0.5 ? 350 : 280)
  });
}

function animParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    p.a += 0.005;
    const alpha = 0.3 + Math.sin(p.a) * 0.25;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(animParticles);
}
animParticles();

/* ═══════════════════════════════════════════════════════
   CENAS
═══════════════════════════════════════════════════════ */
const scenes = [
  'scene-intro','scene-before','scene-lucas','scene-levi',
  'scene-family','scene-moments','scene-interactive',
  'scene-climax','scene-video','scene-final'
];
let currentScene = 0;
const chapters = [
  '','I — O Começo','II — Tudo Mudou','III — O Coração Cresceu',
  'IV — Os Três Juntos','V — Momentos Marcantes','VI — Uma Pergunta',
  'VII — O Clímax','VIII — O Vídeo','IX — O Final'
];

function updateProgress(idx) {
  const pct = (idx / (scenes.length - 1)) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
  const chap = document.getElementById('chapter-indicator');
  chap.textContent = chapters[idx] || '';
}

const fade = document.getElementById('sceneFade');

function nextScene() {
  if (currentScene >= scenes.length - 1) return;
  
  fade.classList.add('active');
  
  setTimeout(() => {
    document.getElementById(scenes[currentScene]).classList.remove('active');
    document.getElementById(scenes[currentScene]).classList.add('hidden');
    
    currentScene++;
    const next = document.getElementById(scenes[currentScene]);
    next.classList.remove('hidden');
    
    setTimeout(() => {
      next.classList.add('active');
      fade.classList.remove('active');
      
      updateProgress(currentScene);
      initScene(currentScene);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    
  }, 600);
}

function restartExperience() {
  // Ativa o fundo escuro para uma transição suave de saída
  fade.classList.add('active');
  
  // Espera a tela escurecer totalmente (600 milissegundos) e recarrega a página
  setTimeout(() => {
    window.location.reload();
  }, 600);
}

/* ═══════════════════════════════════════════════════════
   INIT SCENE 0 — INTRO
═══════════════════════════════════════════════════════ */
let introTimeout = null;
function resetIntro() {
  ['il1','il2','il3'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('show');
  });
  document.getElementById('btnIntro').classList.remove('show');
  setTimeout(runIntroAnimation, 100);
}

function runIntroAnimation() {
  const t1 = setTimeout(() => document.getElementById('il1').classList.add('show'), 600);
  const t2 = setTimeout(() => document.getElementById('il2').classList.add('show'), 2200);
  const t3 = setTimeout(() => document.getElementById('il3').classList.add('show'), 3400);
  const t4 = setTimeout(() => document.getElementById('btnIntro').classList.add('show'), 5000);
}
runIntroAnimation();

/* ═══════════════════════════════════════════════════════
   INIT CENAS COM SCROLL / INTERSECTION
═══════════════════════════════════════════════════════ */
function initScene(idx) {
  const sceneId = scenes[idx];

  if (idx === 1) initBefore();
  if (idx === 2) initLucas();
  if (idx === 3) initLevi();
  if (idx === 4) initFamily();
  if (idx === 5) initMoments();
  if (idx === 6) initInteractive();
  if (idx === 7) initClimax();
  if (idx === 8) initVideo();
  if (idx === 9) initFinal();
}

/* ─── CENA 2 ─── */
function initBefore() {
  const obs = createObserver();
  document.querySelectorAll('#scene-before .text-block p').forEach((el, i) => {
    setTimeout(() => obs.observe(el), i * 200);
  });
}

/* ─── CENA 3 ─── */
function initLucas() {
  animSceneTexts('#scene-lucas .scene-text');
  const items = document.querySelectorAll('#trio-lucas .photo-frame');
  items.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.8s ease';
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 50 + i * 180);
    }, 300);
  });
}

/* ─── CENA 4 ─── */
function initLevi() {
  animSceneTexts('#scene-levi .scene-text');
  const merge = document.getElementById('merge-levi');
  if (merge) {
    merge.style.opacity = '0';
    merge.style.transform = 'scale(0.97)';
    merge.style.transition = 'all 0.9s ease 0.4s';
    setTimeout(() => { merge.style.opacity = '1'; merge.style.transform = 'scale(1)'; }, 200);
  }
}

/* ─── CENA 5 ─── */
function initFamily() {
  animSceneTexts('#scene-family .scene-text');
  const items = document.querySelectorAll('#masonry .masonry-item');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
  setTimeout(() => items.forEach(el => el.classList.add('show')), 400);
}

/* ─── CENA 6 ─── */
function initMoments() {
  animSceneTexts('#scene-moments .scene-text');
  const cards = document.querySelectorAll('.moment-card');
  setTimeout(() => cards.forEach(c => c.classList.add('show')), 300);
  const strip = document.getElementById('momentsStrip');
  if (strip) {
    let scrolling = true;
    const scrollAnim = () => {
      if (!scrolling) return;
      strip.scrollLeft += 0.5;
      if (strip.scrollLeft >= strip.scrollWidth - strip.clientWidth) scrolling = false;
      requestAnimationFrame(scrollAnim);
    };
    setTimeout(scrollAnim, 1500);
    strip.addEventListener('mouseenter', () => scrolling = false);
  }
}

/* ─── CENA 7 ─── */
function initInteractive() {
  const els = document.querySelectorAll('#scene-interactive .scene-text, #scene-interactive h2, #scene-interactive p, #scene-interactive .input-line, #scene-interactive .btn-discover');
  els.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    document.getElementById('inputBlock').style.opacity = '1';
    document.getElementById('btnDiscover').style.opacity = '1';
  }, 1000);
}

/* ─── CENA 8 ─── */
function initClimax() {
  const lines = ['cl1','cl2','cl3','cl4'];
  lines.forEach((id, i) => {
    setTimeout(() => document.getElementById(id).classList.add('show'), 600 + i * 900);
  });
  setTimeout(() => {
    document.getElementById('climaxLine').style.opacity = '1';
  }, 2800);
  setTimeout(() => {
    document.getElementById('btnClimax').classList.add('show');
  }, 4200);
}

/* ─── CENA 9 ─── */
function initVideo() {
}

/* ─── CENA 10 ─── */
function initFinal() {
  launchConfetti();
  setTimeout(() => {
    document.getElementById('finalChapter').style.opacity = '1';
  }, 500);
  ['fl1','fl2','fl3','fl4'].forEach(id => {
    const el = document.getElementById(id);
    setTimeout(() => el.classList.add('show'), parseInt(el.style.transitionDelay) * 1000 || 800);
  });
  setTimeout(() => document.getElementById('finalLine').style.opacity = '1', 3100);
  setTimeout(() => document.getElementById('finalMain').classList.add('show'), 3300);
  setTimeout(() => document.getElementById('finalSig').classList.add('show'), 4600);
  setTimeout(() => {
    document.getElementById('finalButtons').style.opacity = '1';
    document.getElementById('btnRestart').classList.add('show');
  }, 5200);
}

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
function animSceneTexts(selector) {
  const els = document.querySelectorAll(selector);
  els.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300 + i * 400);
  });
}

function createObserver() {
  return new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold: 0.2 });
}

/* ═══════════════════════════════════════════════════════
   INTERATIVO — RESPOSTA
═══════════════════════════════════════════════════════ */
const answers = [
  "Você é nosso mundo. ✨",
  "Você é tudo pra gente. ❤️",
  "Você é nosso lar. 🏡",
  "Você é a nossa força. 💪",
  "Você é a razão de tudo. 🌸",
  "Você é amor em forma de pessoa. 💛"
];

function revealAnswer() {
  const input = document.getElementById('answerInput').value.trim();
  const box = document.getElementById('revealAnswer');
  const nextBtn = document.getElementById('btnAfterReveal');

  const chosen = answers[Math.floor(Math.random() * answers.length)];
  box.innerHTML = `
    <span class="reveal-heart">❤️</span><br>
    ${chosen}
  `;
  box.classList.add('show');

  nextBtn.style.display = 'block';
  setTimeout(() => { nextBtn.style.opacity = '1'; }, 1200);
}

document.getElementById('answerInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') revealAnswer();
});

/* ═══════════════════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════════════════ */
function launchConfetti() {
  const colors = ['#c9a84c','#e8c97a','#c47a7a','#e8a8a8','#fff','#6b4f7a','#a8d4e8'];
  for (let i = 0; i < 120; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left:${Math.random()*100}%;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        width:${6 + Math.random()*8}px;
        height:${6 + Math.random()*8}px;
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration:${3 + Math.random()*4}s;
        animation-delay:${Math.random()*2}s;
      `;
      piece.style.animation = `confettiFall ${3 + Math.random() * 4}s linear ${Math.random() * 2}s forwards`;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 7000);
    }, i * 60);
  }
}

/* Inicia scroll hint */
setTimeout(() => {
  const hint = document.getElementById('scrollHint');
  if (hint) hint.style.animationPlayState = 'running';
}, 0);