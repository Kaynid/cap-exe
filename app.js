/* ================================================
   CAP.EXE — app.js
   Y2K Desktop OS Interactive Engine v1.0
================================================ */

'use strict';

// ================================================
// DATA
// ================================================
const CAPS = [
  {
    id: 'pearl_plaid',
    name: 'Pearl Plaid NY',
    filename: 'pearl_plaid.exe',
    price: 'R850',
    rarity: 'Limited',
    patch: '1/25',
    status: 'AVAILABLE',
    build: 'Hand-set pearl studs on plaid wool',
    img: 'assets/caps/pearl_plaid.png'
  },
  {
    id: 'lace_fitted',
    name: 'Lace Fitted',
    filename: 'lace_fitted.exe',
    price: 'R920',
    rarity: 'Ultra Rare',
    patch: '1/10',
    status: 'AVAILABLE',
    build: 'Hand-stitched white lace applique',
    img: 'assets/caps/lace_fitted.png'
  },
  {
    id: 'slate_rosary',
    name: 'Slate Rosary',
    filename: 'slate_rosary.exe',
    price: 'R780',
    rarity: 'Rare',
    patch: '1/15',
    status: 'AVAILABLE',
    build: 'Distressed denim, pearl logos + rosary',
    img: 'assets/caps/slate_rosary.png'
  },
  {
    id: 'olive_gold',
    name: 'Olive Gold Jewel',
    filename: 'olive_gold.exe',
    price: 'R990',
    rarity: 'Legendary',
    patch: '1/8',
    status: 'AVAILABLE',
    build: 'Jewel-encrusted NY, gold chain brim',
    img: 'assets/caps/olive_gold.png'
  }
];

const SECRET_CAPS = [
  { name: 'REDACTED_001.exe', desc: 'UNRELEASED', img: 'assets/caps/pearl_plaid.png' },
  { name: 'GHOST_002.exe', desc: 'PROTOTYPE', img: 'assets/caps/lace_fitted.png' },
  { name: 'VOID_003.exe', desc: 'CLASSIFIED', img: 'assets/caps/olive_gold.png' }
];

const LOOKBOOK = [
  { img: 'assets/lookbook/look1.png', caption: 'NYC ARCHIVE / 2003', label: 'UPTOWN STREET DOC' },
  { img: 'assets/lookbook/look2.png', caption: 'SOUTH SIDE / 2003', label: 'GRAFFITI WALL SESSIONS' },
  { img: 'assets/lookbook/look3.png', caption: 'NIGHT ARCHIVE / 03', label: 'NEON STREETS COLLECTION' }
];

const ERROR_MESSAGES = [
  { title: 'DRIP LEVEL CRITICAL', msg: 'Drip level dangerously low.\nAdd to cart immediately to prevent style failure.' },
  { title: 'RARE UNIT DETECTED', msg: 'Warning: A rare cap file has been detected.\nInstall before inventory expires.' },
  { title: 'SWAG OVERFLOW ERROR', msg: 'Error 0x00DRIP: Swag overflow detected.\nSystem cannot contain this much heat.' },
  { title: 'CACHE FULL', msg: 'Your cache is full of mid fits.\nDelete them and install CAP.EXE immediately.' },
  { title: 'INSTALL RECOMMENDED', msg: 'CAP.EXE recommends immediate installation.\nYour fit is at risk.' }
];

// ================================================
// STATE
// ================================================
const state = {
  cart: [],
  activeLookbook: 0,
  windowZCounter: 200,
  openWindows: new Set(),
  minimizedWindows: new Set(),
  errorShown: false
};

// ================================================
// BOOT MANAGER
// ================================================
function initBoot() {
  const bootLines = ['bl2', 'bl3', 'bl4', 'bl5'];
  const progress = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  let pct = 0;
  let lineIdx = 0;

  const interval = setInterval(() => {
    pct = Math.min(pct + Math.random() * 8 + 3, 100);
    progress.style.width = pct + '%';
    progressText.textContent = Math.floor(pct) + '%';

    // Reveal lines at checkpoints
    if (pct > 20 && lineIdx === 0) {
      showBootLine('bl2'); lineIdx++;
    }
    if (pct > 45 && lineIdx === 1) {
      showBootLine('bl3'); lineIdx++;
    }
    if (pct > 70 && lineIdx === 2) {
      showBootLine('bl4'); lineIdx++;
    }
    if (pct > 90 && lineIdx === 3) {
      showBootLine('bl5'); lineIdx++;
    }

    if (pct >= 100) {
      clearInterval(interval);
      progressText.textContent = '100%';
      setTimeout(bootComplete, 900);
    }
  }, 80);

  // Skip on any key or click
  document.addEventListener('keydown', skipBoot, { once: true });
  document.addEventListener('click', skipBoot, { once: true });
}

function showBootLine(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}

function skipBoot() {
  // Immediately fill progress then complete
  const progress = document.getElementById('progress-bar');
  progress.style.width = '100%';
  document.getElementById('progress-text').textContent = '100%';
  setTimeout(bootComplete, 400);
}

function bootComplete() {
  const boot = document.getElementById('boot-screen');
  boot.classList.add('fade-out');

  setTimeout(() => {
    boot.style.display = 'none';
    const desktop = document.getElementById('desktop');
    desktop.classList.remove('hidden');
    desktop.style.opacity = '0';
    desktop.style.transition = 'opacity 0.6s';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        desktop.style.opacity = '1';
      });
    });

    initDesktop();
  }, 800);
}

// ================================================
// DESKTOP INIT
// ================================================
function initDesktop() {
  initStarfield();
  initClock();
  renderProducts();
  renderSecretCaps();
  initCursorFX();
  scheduleErrorPopups();
  openWindow('shop'); // Open shop by default
}

// ================================================
// STARFIELD
// ================================================
function initStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.4 + 0.1,
        brightness: Math.random(),
        brightDir: Math.random() > 0.5 ? 1 : -1,
        color: Math.random() > 0.85 ? '#7b2ff7' : Math.random() > 0.7 ? '#003FFF' : '#39ff14'
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.brightness += 0.01 * s.brightDir;
      if (s.brightness >= 1 || s.brightness <= 0.2) s.brightDir *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.brightness * 0.8;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Slow drift
      s.y -= s.speed * 0.3;
      if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
    });

    requestAnimationFrame(drawStars);
  }

  resize();
  createStars();
  drawStars();
  window.addEventListener('resize', () => { resize(); createStars(); });
}

// ================================================
// CLOCK
// ================================================
function initClock() {
  const clock = document.getElementById('taskbar-clock');
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    clock.textContent = `${h}:${m}`;
  }
  tick();
  setInterval(tick, 10000);
}

// ================================================
// CURSOR FX (Sparkle Trail)
// ================================================
function initCursorFX() {
  const canvas = document.getElementById('sparkle-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];

  window.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        life: 1,
        size: Math.random() * 4 + 2,
        color: ['#39ff14', '#7b2ff7', '#003FFF', '#ffffff', '#ff9900'][Math.floor(Math.random() * 5)]
      });
    }
  });

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.life -= 0.04;
      p.size *= 0.95;

      if (p.life <= 0) { particles.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;

      // Draw star shape
      ctx.translate(p.x, p.y);
      ctx.rotate(p.life * 3);
      ctx.beginPath();
      for (let j = 0; j < 4; j++) {
        ctx.lineTo(0, -p.size);
        ctx.rotate(Math.PI / 4);
        ctx.lineTo(0, -p.size * 0.4);
        ctx.rotate(Math.PI / 4);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(animateParticles);
  }

  animateParticles();
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ================================================
// SOUND ENGINE (Web Audio API)
// ================================================
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playWindowOpen() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) { }
}

function playWindowClose() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) { }
}

function playClick() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) { }
}

function playNotification() {
  try {
    const ctx = getAudioCtx();
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.1);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.12);
    });
  } catch (e) { }
}

// ================================================
// WINDOW MANAGER
// ================================================
const WINDOW_IDS = { shop: 'win-shop', lookbook: 'win-lookbook', custom: 'win-custom', contact: 'win-contact', cart: 'win-cart', player: 'win-player', secret: 'win-secret', story: 'win-story', game: 'win-game' };
const WINDOW_LABELS = { shop: '🧢 SHOP.EXE', lookbook: '📸 LOOKBOOK', custom: '✏️ CUSTOM', contact: '💬 CONTACT', cart: '🛒 CART', player: '▶ CAP PLAYER', secret: '🔓 SECRET', story: '📖 STORY.EXE', game: '🎮 GAME.EXE' };

function openWindow(id) {
  const el = document.getElementById(WINDOW_IDS[id]);
  if (!el) return;

  playWindowOpen();
  el.style.display = 'flex';
  el.style.flexDirection = 'column';
  el.classList.remove('minimized');
  state.openWindows.add(id);
  state.minimizedWindows.delete(id);
  bringToFront(el);
  updateTaskbar();
  makeDraggable(el);
}

function closeWindow(id) {
  const el = document.getElementById(WINDOW_IDS[id]);
  if (!el) return;
  playWindowClose();
  el.style.display = 'none';
  state.openWindows.delete(id);
  state.minimizedWindows.delete(id);
  updateTaskbar();
}

function minimizeWindow(id) {
  const el = document.getElementById(WINDOW_IDS[id]);
  if (!el) return;
  playClick();
  el.style.display = 'none';
  state.minimizedWindows.add(id);
  updateTaskbar();
}

function maximizeWindow(id) {
  const el = document.getElementById(WINDOW_IDS[id]);
  if (!el) return;
  el.style.left = '0';
  el.style.top = '0';
  el.style.width = '100vw';
  el.style.height = 'calc(100vh - 38px)';
}

function bringToFront(el) {
  state.windowZCounter++;
  el.style.zIndex = state.windowZCounter;
  // Mark as active
  document.querySelectorAll('.win').forEach(w => w.classList.remove('active', 'inactive'));
  el.classList.add('active');
  document.querySelectorAll('.win:not(.active)').forEach(w => w.classList.add('inactive'));
}

function updateTaskbar() {
  const bar = document.getElementById('taskbar-windows');
  bar.innerHTML = '';
  state.openWindows.forEach(id => {
    const btn = document.createElement('button');
    btn.className = 'taskbar-win-btn';
    if (!state.minimizedWindows.has(id)) btn.classList.add('active');
    btn.textContent = WINDOW_LABELS[id] || id;
    btn.onclick = () => {
      if (state.minimizedWindows.has(id)) {
        openWindow(id);
      } else {
        const el = document.getElementById(WINDOW_IDS[id]);
        bringToFront(el);
      }
      playClick();
    };
    bar.appendChild(btn);
  });
}

// ================================================
// DRAG WINDOWS
// ================================================
function makeDraggable(win) {
  if (win._draggable) return;
  win._draggable = true;

  const titlebar = win.querySelector('.win-titlebar');
  if (!titlebar) return;

  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('win-btn')) return;
    isDragging = true;
    offsetX = e.clientX - win.getBoundingClientRect().left;
    offsetY = e.clientY - win.getBoundingClientRect().top;
    bringToFront(win);
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    // Clamp within viewport
    x = Math.max(0, Math.min(x, window.innerWidth - win.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - 38 - win.offsetHeight));
    win.style.left = x + 'px';
    win.style.top = y + 'px';
  });

  document.addEventListener('mouseup', () => { isDragging = false; });
}

// Bind all existing windows
document.querySelectorAll('.win').forEach(w => {
  w.addEventListener('mousedown', () => bringToFront(w));
});

// ================================================
// PRODUCT RENDERING
// ================================================
function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  CAPS.forEach(cap => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', cap.id);
    card.innerHTML = `
      <img class="product-img" src="${cap.img}" alt="${cap.name}">
      <div class="product-info">
        <div class="product-name">${cap.name}</div>
        <div class="product-price">${cap.price}</div>
        <div class="product-rarity">RARITY: ${cap.rarity} // PATCH ${cap.patch}</div>
        <div class="product-status">${cap.status}</div>
      </div>
    `;
    card.onclick = () => openCapPlayer(cap.id);
    grid.appendChild(card);
  });
}

function openCapPlayer(capId) {
  const cap = CAPS.find(c => c.id === capId);
  if (!cap) return;

  const body = document.getElementById('player-body');
  body.innerHTML = `
    <div class="player-display">
      <img class="player-img" src="${cap.img}" alt="${cap.name}">
      <div class="player-scanlines"></div>
    </div>
    <div class="player-info-bar">
      <div class="player-now-viewing">NOW VIEWING:</div>
      <div class="player-cap-name">"${cap.name}"</div>
      <div class="player-meta">
        <div class="player-meta-item">
          <div class="meta-label">STATUS</div>
          <div class="meta-value">${cap.status}</div>
        </div>
        <div class="player-meta-item">
          <div class="meta-label">PRICE</div>
          <div class="meta-value price">${cap.price}</div>
        </div>
        <div class="player-meta-item">
          <div class="meta-label">RARITY</div>
          <div class="meta-value">${cap.rarity}</div>
        </div>
      </div>
      <div class="player-file-info">
        FILE: ${cap.filename} // BUILD: ${cap.build} // PATCH ${cap.patch}
      </div>
      <div class="player-buttons">
        <button class="btn-install" onclick="addToCart('${cap.id}')">▶ ADD TO CART</button>
        <button class="btn-cancel" onclick="closeWindow('player')">BACK</button>
      </div>
    </div>
  `;

  openWindow('player');
  playWindowOpen();
}

// ================================================
// CART
// ================================================
function addToCart(capId) {
  const cap = CAPS.find(c => c.id === capId);
  if (!cap) return;

  if (state.cart.find(c => c.id === capId)) {
    showError({ title: 'ALREADY QUEUED', msg: `${cap.name} is already in your installation queue.` });
    return;
  }

  state.cart.push(cap);
  playNotification();
  renderCart();
  showInstallSuccess(cap);
}

function removeFromCart(capId) {
  state.cart = state.cart.filter(c => c.id !== capId);
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const empty = document.getElementById('cart-empty');
  const footer = document.getElementById('cart-footer');
  const totalEl = document.getElementById('cart-total-price');

  if (state.cart.length === 0) {
    container.innerHTML = '<div class="cart-empty" id="cart-empty">No items queued.<br><span class="cart-empty-sub">Visit SHOP.EXE to add drip.</span></div>';
    footer.style.display = 'none';
    return;
  }

  let total = 0;
  container.innerHTML = state.cart.map(cap => {
    const numPrice = parseInt(cap.price.replace('R', ''));
    total += numPrice;
    return `
      <div class="cart-item">
        <img class="cart-item-img" src="${cap.img}" alt="${cap.name}">
        <div class="cart-item-name">${cap.name}</div>
        <div class="cart-item-price">${cap.price}</div>
        <button class="cart-item-remove" onclick="removeFromCart('${cap.id}')">✕</button>
      </div>
    `;
  }).join('');

  totalEl.textContent = `R${total}`;
  footer.style.display = 'block';
}

function checkout() {
  if (state.cart.length === 0) return;
  openWindow('contact');
  setTimeout(() => {
    addMsnMessage(`CAP.EXE: Order received! ${state.cart.map(c => c.name).join(', ')}. Total: R${state.cart.reduce((s, c) => s + parseInt(c.price.replace('R', '')), 0)}. We'll contact you via WhatsApp to confirm.`);
  }, 500);
}

function showInstallSuccess(cap) {
  const overlay = document.createElement('div');
  overlay.className = 'success-dialog';
  overlay.innerHTML = `
    <div class="success-titlebar win-titlebar">
      <div class="win-title">▶ INSTALLING ${cap.filename}</div>
      <button class="win-btn win-close" onclick="this.closest('.success-dialog').remove()">✕</button>
    </div>
    <div class="success-body">
      <div class="success-icon">✅</div>
      <div class="success-text">
        ${cap.name.toUpperCase()}
        <br>SUCCESSFULLY QUEUED
        <br><br>
        DRIP INSTALLATION IN PROGRESS...
      </div>
      <button class="btn-install" onclick="openWindow('cart'); this.closest('.success-dialog').remove()">VIEW CART.EXE</button>
    </div>
  `;
  document.getElementById('desktop').appendChild(overlay);
  setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 3500);
}

// ================================================
// LOOKBOOK
// ================================================
function lookbookNext() {
  state.activeLookbook = (state.activeLookbook + 1) % LOOKBOOK.length;
  updateLookbook();
  playClick();
}

function lookbookPrev() {
  state.activeLookbook = (state.activeLookbook - 1 + LOOKBOOK.length) % LOOKBOOK.length;
  updateLookbook();
  playClick();
}

function updateLookbook() {
  const lb = LOOKBOOK[state.activeLookbook];
  const img = document.getElementById('lookbook-img');
  const caption = document.getElementById('lookbook-caption');
  const counter = document.getElementById('lookbook-counter');
  const label = document.getElementById('lookbook-label');

  img.style.opacity = '0';
  setTimeout(() => {
    img.src = lb.img;
    caption.textContent = lb.caption;
    counter.textContent = `${state.activeLookbook + 1} / ${LOOKBOOK.length}`;
    label.textContent = lb.label;
    img.style.opacity = '1';
  }, 200);
}

// ================================================
// MSN CONTACT
// ================================================
function addMsnMessage(text) {
  const chat = document.getElementById('msn-chat');
  if (!chat) return;
  const msg = document.createElement('div');
  msg.className = 'msn-msg received';
  msg.innerHTML = `<span class="msg-sender">CAP.EXE:</span> ${text}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function sendMsnMessage(e) {
  if (e.key === 'Enter') sendMsnMessageBtn();
}

function sendMsnMessageBtn() {
  const input = document.getElementById('msn-input');
  if (!input || !input.value.trim()) return;

  const chat = document.getElementById('msn-chat');
  const msg = document.createElement('div');
  msg.className = 'msn-msg sent';
  msg.innerHTML = `<span class="msg-sender" style="color:#880000">You:</span> ${input.value}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  playClick();

  const reply = input.value.trim();
  input.value = '';

  setTimeout(() => {
    const replies = [
      "say less, we got you 🧢",
      "yo that sounds fire, DM us on IG for the full custom quote",
      "drip received. one of our builders will slide in your DMs",
      "limited slots available for custom builds — lock in fast",
      "real ones only. fill out CUSTOM.EXE for a full quote"
    ];
    addMsnMessage(replies[Math.floor(Math.random() * replies.length)]);
  }, 800);
}

// ================================================
// CUSTOM ORDER FORM
// ================================================
function submitCustomOrder(e) {
  e.preventDefault();
  const name = document.getElementById('cf-name').value.trim();
  const contact = document.getElementById('cf-contact').value.trim();

  if (!name || !contact) {
    showError({ title: 'INPUT ERROR', msg: 'Please fill in your name and contact details to submit an order.' });
    return;
  }

  playNotification();
  closeWindow('custom');

  // Show success
  const overlay = document.createElement('div');
  overlay.className = 'success-dialog';
  overlay.innerHTML = `
    <div class="success-titlebar win-titlebar">
      <div class="win-title">✅ ORDER SUBMITTED</div>
      <button class="win-btn win-close" onclick="this.closest('.success-dialog').remove()">✕</button>
    </div>
    <div class="success-body">
      <div class="success-icon">📨</div>
      <div class="success-text">
        CUSTOM ORDER LOGGED
        <br>WE'LL HIT YOU UP AT
        <br>${contact.toUpperCase()}
        <br><br>DRIP INCOMING.
      </div>
    </div>
  `;
  document.getElementById('desktop').appendChild(overlay);
  setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 4000);
}

// ================================================
// START MENU
// ================================================
function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  menu.classList.toggle('hidden');
  playClick();
}

// Close start menu on outside click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('start-menu');
  const startBtn = document.getElementById('start-btn');
  if (!menu.contains(e.target) && !startBtn.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

// ================================================
// ERROR POPUPS
// ================================================
let errorCount = 0;

function scheduleErrorPopups() {
  // First error after 8 seconds, then random intervals
  setTimeout(() => showRandomError(), 8000);
}

function showRandomError() {
  if (errorCount >= 3) return; // Max 3 errors

  const msg = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
  showError(msg);
  errorCount++;

  if (errorCount < 3) {
    setTimeout(showRandomError, Math.random() * 20000 + 15000);
  }
}

function showError(errData) {
  const popup = document.createElement('div');
  popup.className = 'error-popup';
  popup.style.top = (Math.random() * 200 + 100) + 'px';
  popup.style.left = (Math.random() * 300 + 200) + 'px';
  popup.innerHTML = `
    <div class="error-titlebar">
      <div class="error-title">⚠ ${errData.title}</div>
      <button class="win-btn win-close" onclick="this.closest('.error-popup').remove(); playClick()">✕</button>
    </div>
    <div class="error-body">
      <div class="error-icon">⚠️</div>
      <div class="error-message-text">${errData.msg.replace(/\n/g, '<br>')}</div>
    </div>
    <div class="error-footer">
      <button class="btn-install" onclick="this.closest('.error-popup').remove(); playClick()">OK</button>
      <button class="btn-cancel" onclick="this.closest('.error-popup').remove(); playClick()">Ignore</button>
    </div>
  `;
  popup.style.zIndex = 40000;
  document.getElementById('desktop').appendChild(popup);
  playNotification();

  // Auto-dismiss after 10 seconds
  setTimeout(() => { if (popup.parentNode) popup.remove(); }, 10000);
}

function dismissError(btn) {
  btn.closest('.error-popup').remove();
  playClick();
}

// ================================================
// SECRET DRIP MODE
// ================================================
function renderSecretCaps() {
  const container = document.getElementById('secret-caps');
  if (!container) return;
  container.innerHTML = SECRET_CAPS.map(cap => `
    <div class="secret-cap-card">
      <img class="secret-cap-img" src="${cap.img}" alt="${cap.name}">
      <div class="secret-cap-name">${cap.name}</div>
      <div class="secret-cap-lock">${cap.desc}</div>
    </div>
  `).join('');
}

// CTRL+D Easter Egg
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'd') {
    e.preventDefault();
    openWindow('secret');
    playNotification();
    playNotification();
  }
});

// ================================================
// GAME.EXE — CAP CATCHER
// ================================================
let gameState = null;
let gameAnimFrame = null;
let gameRunning = false;

function startGame() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Reset HUD
  document.getElementById('game-score').textContent = '0';
  document.getElementById('game-lives').textContent = '❤️❤️❤️';
  document.getElementById('game-level').textContent = '1';
  document.getElementById('game-status').textContent = 'CATCH THE CAPS!';
  document.getElementById('game-start-btn').textContent = '↺ RESTART';

  if (gameAnimFrame) cancelAnimationFrame(gameAnimFrame);

  gameRunning = true;
  gameState = {
    score: 0,
    lives: 3,
    level: 1,
    caps: [],
    bombs: [],
    basket: {
      x: canvas.width / 2 - 40,
      y: canvas.height - 30,
      w: 80, h: 20,
      speed: 7,
      target: canvas.width / 2 - 40
    },
    keys: {},
    frameCount: 0,
    dropInterval: 80,
    capEmojis: ['🧢', '👑', '⭐', '💎'],
    lastScore: 0,
    combo: 0
  };

  // Key handlers
  const keydown = (e) => {
    gameState.keys[e.key] = true;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd') {
      e.preventDefault();
    }
  };
  const keyup = (e) => { gameState.keys[e.key] = false; };

  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);
  gameState._keydown = keydown;
  gameState._keyup = keyup;

  // Mouse/touch control for basket
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    gameState.basket.target = e.clientX - rect.left - gameState.basket.w / 2;
  });

  function spawnCap() {
    const isBomb = Math.random() < 0.18 + gameState.level * 0.02;
    gameState.caps.push({
      x: Math.random() * (canvas.width - 30) + 15,
      y: -20,
      speed: 2 + gameState.level * 0.6 + Math.random() * 1.5,
      emoji: isBomb ? '💣' : gameState.capEmojis[Math.floor(Math.random() * gameState.capEmojis.length)],
      isBomb,
      size: 24 + Math.random() * 10,
      rotation: (Math.random() - 0.5) * 0.2
    });
  }

  function drawBasket(b) {
    ctx.save();
    // Basket body
    ctx.fillStyle = '#003FFF';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    // Neon outline
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 8;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    // Label
    ctx.shadowBlur = 0;
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('CATCH', b.x + b.w / 2, b.y + 13);
    ctx.restore();
  }

  function gameLoop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = 'rgba(57,255,20,0.06)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < canvas.width; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
    }
    for (let gy = 0; gy < canvas.height; gy += 40) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
    }

    const gs = gameState;
    const b = gs.basket;

    // Move basket
    if (gs.keys['ArrowLeft'] || gs.keys['a']) b.x = Math.max(0, b.x - b.speed);
    if (gs.keys['ArrowRight'] || gs.keys['d']) b.x = Math.min(canvas.width - b.w, b.x + b.speed);
    // Smooth mouse follow
    if (Math.abs(b.x - b.target) > 2) b.x += (b.target - b.x) * 0.18;

    // Spawn caps
    gs.frameCount++;
    if (gs.frameCount % gs.dropInterval === 0) {
      spawnCap();
      // Level up every 10 catches
      if (gs.score > 0 && gs.score % 100 === 0 && gs.score !== gs.lastScore) {
        gs.lastScore = gs.score;
        gs.level = Math.min(gs.level + 1, 10);
        gs.dropInterval = Math.max(30, 80 - gs.level * 5);
        document.getElementById('game-level').textContent = gs.level;
      }
    }

    // Update + draw caps
    for (let i = gs.caps.length - 1; i >= 0; i--) {
      const cap = gs.caps[i];
      cap.y += cap.speed;

      // Draw emoji
      ctx.save();
      ctx.translate(cap.x, cap.y);
      ctx.rotate(gs.frameCount * cap.rotation);
      ctx.font = cap.size + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (cap.isBomb) {
        ctx.shadowColor = '#ff3300';
        ctx.shadowBlur = 10;
      } else {
        ctx.shadowColor = '#39ff14';
        ctx.shadowBlur = 6;
      }
      ctx.fillText(cap.emoji, 0, 0);
      ctx.restore();

      // Catch detection
      const caught =
        cap.y + cap.size / 2 >= b.y &&
        cap.y - cap.size / 2 <= b.y + b.h &&
        cap.x >= b.x - 10 && cap.x <= b.x + b.w + 10;

      if (caught) {
        gs.caps.splice(i, 1);
        if (cap.isBomb) {
          gs.lives--;
          gs.combo = 0;
          playGameHit();
          document.getElementById('game-lives').textContent =
            ['', '❤️', '❤️❤️', '❤️❤️❤️'][Math.max(0, gs.lives)] || '';
          // Flash screen red
          ctx.fillStyle = 'rgba(255,0,0,0.3)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          gs.combo++;
          const pts = gs.level * 10 * (gs.combo > 3 ? 2 : 1);
          gs.score += pts;
          playGameCatch();
          document.getElementById('game-score').textContent = gs.score;
          // Combo flash
          if (gs.combo >= 3) {
            showCombo(ctx, cap.x, cap.y, gs.combo);
          }
        }
        if (gs.lives <= 0) { gameOver(); return; }
      }

      // Missed
      if (cap.y > canvas.height + 20) {
        gs.caps.splice(i, 1);
        if (!cap.isBomb) {
          gs.lives--;
          gs.combo = 0;
          document.getElementById('game-lives').textContent =
            ['', '❤️', '❤️❤️', '❤️❤️❤️'][Math.max(0, gs.lives)] || '';
          if (gs.lives <= 0) { gameOver(); return; }
        }
      }
    }

    drawBasket(b);
    gameAnimFrame = requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

function showCombo(ctx, x, y, combo) {
  ctx.save();
  ctx.font = '10px "Press Start 2P"';
  ctx.fillStyle = '#ff9900';
  ctx.shadowColor = '#ff9900';
  ctx.shadowBlur = 10;
  ctx.textAlign = 'center';
  ctx.fillText(`x${combo} COMBO!`, x, y - 20);
  ctx.restore();
}

function gameOver() {
  gameRunning = false;
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const score = gameState ? gameState.score : 0;

  // Remove listeners
  if (gameState._keydown) document.removeEventListener('keydown', gameState._keydown);
  if (gameState._keyup) document.removeEventListener('keyup', gameState._keyup);

  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '16px "Press Start 2P"';
  ctx.fillStyle = '#ff3300';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#ff3300';
  ctx.shadowBlur = 20;
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

  ctx.font = '10px "Press Start 2P"';
  ctx.fillStyle = '#39ff14';
  ctx.shadowColor = '#39ff14';
  ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2);

  ctx.font = '8px "Press Start 2P"';
  ctx.fillStyle = '#888';
  ctx.shadowBlur = 0;
  ctx.fillText('PRESS START TO RETRY', canvas.width / 2, canvas.height / 2 + 40);

  document.getElementById('game-status').textContent = `GAME OVER — SCORE: ${score}`;
  document.getElementById('game-start-btn').textContent = '▶ PLAY AGAIN';
  playGameOver();
}

function stopGame() {
  gameRunning = false;
  if (gameAnimFrame) cancelAnimationFrame(gameAnimFrame);
  if (gameState) {
    if (gameState._keydown) document.removeEventListener('keydown', gameState._keydown);
    if (gameState._keyup) document.removeEventListener('keyup', gameState._keyup);
    gameState = null;
  }
}

// Game sounds
function playGameCatch() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    osc.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(); osc.stop(ctx.currentTime + 0.12);
  } catch (e) { }
}

function playGameHit() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);
    osc.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(); osc.stop(ctx.currentTime + 0.2);
  } catch (e) { }
}

function playGameOver() {
  try {
    const ctx = getAudioCtx();
    [400, 350, 300, 220].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.connect(gain); gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.15);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.15);
    });
  } catch (e) { }
}

// ================================================
// KONAMI CODE EASTER EGG ↑↑↓↓←→←→BA
// ================================================
(function () {
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kIdx = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === KONAMI[kIdx]) {
      kIdx++;
      if (kIdx === KONAMI.length) {
        kIdx = 0;
        triggerKonami();
      }
    } else {
      kIdx = e.key === KONAMI[0] ? 1 : 0;
    }
  });

  function triggerKonami() {
    playNotification();
    setTimeout(playNotification, 200);
    setTimeout(playNotification, 400);

    const overlay = document.createElement('div');
    overlay.className = 'konami-overlay';
    overlay.innerHTML = `
      <div class="konami-content">
        <div class="konami-title">CHEAT CODE ACTIVATED</div>
        <div class="konami-code-display">↑↑↓↓←→←→ BA</div>
        <div class="konami-sub">you know the code. you are the culture.</div>
        <div style="font-family: 'VT323', monospace; font-size: 22px; color: #39ff14; margin-bottom: 20px; line-height: 1.6;">
          CAP.EXE recognizes a legend.<br>
          This isn't just streetwear.<br>
          This is a protocol.
        </div>
        <button class="konami-close" onclick="this.closest('.konami-overlay').remove(); playClick()">[ CLOSE FILE ]</button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Auto-dismiss
    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 8000);
  }
})();

// ================================================
// EXTRA EASTER EGG: Logo click counter
// ================================================
(function () {
  let clickCount = 0;
  let clickTimer = null;

  // Attach to start brand
  document.addEventListener('click', (e) => {
    const brand = document.querySelector('.start-brand');
    if (brand && brand.contains(e.target)) {
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 2000);

      if (clickCount >= 5) {
        clickCount = 0;
        showLogoEasterEgg();
      }
    }
  });

  function showLogoEasterEgg() {
    showError({
      title: '🔒 CLASSIFIED MESSAGE',
      msg: 'You clicked the logo 5 times.\nYou are clearly built different.\n\nUse code: DRIP2003 for 10% off.'
    });
    playNotification();
  }
})();

// ================================================
// KAYNID CREDIT CLICK
// ================================================
(function () {
  document.addEventListener('click', (e) => {
    const credit = document.getElementById('kaynid-credit');
    if (credit && credit.contains(e.target)) {
      playNotification();
      showError({
        title: '👾 SITE BY KAYNID',
        msg: 'Built with: HTML // CSS // JS\nPowered by: Caffeine + Culture\nNo frameworks were harmed.\n\nkaynid.exe // 2003-forever'
      });
    }
  });
})();

// ================================================
// INIT
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  initBoot();
});

