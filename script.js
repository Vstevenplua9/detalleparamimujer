document.addEventListener('DOMContentLoaded', () => {
  const phrases = [
    "Te amo",
    "My love",
    "Gracias por ser tú",
    "Eres mi princesa",
    "Me encantas",
    "Amor de mi vida",
    "Felicidades 🎉",
    "Feliz Cumpleaños 🎂",
    "Mi choquilla",
    "💚",
    "🎉",
    "❤️"
  ];

  const images = [
    "img/photo1.jpg",
    "img/photo2.jpg",
    "img/photo3.jpg",
    "img/photo4.jpg",
    "img/photo5.jpg",
    "img/photo6.jpg",
    "img/photo7.jpg",
    "img/photo8.jpg",
    "img/photo9.jpg",
    "img/photo10.jpg",
    "img/photo11.jpg",
    "img/photo12.jpg",
    "img/photo13.jpg",
    "img/photo14.jpg"
  ];

  const settings = {
    colorCycle: 3,
    spawnInterval: 850,
    maxItems: 135,
    starCount: 220,
    starShuffleInterval: 6000,
    shootingInterval: 5200,
    minHorizontalGap: 10,
    initialFill: 7
  };
  const depthLayers = [
    { name:'10', weight:0.10, size:[6.6,7.2], opacity:[0.92,1.0], z:[170,220], duration:[4.0,4.6] },
    { name:'9',  weight:0.12, size:[6.2,6.7], opacity:[0.88,0.97], z:[140,169], duration:[5.0,5.8] },
    { name:'8',  weight:0.13, size:[5.8,6.3], opacity:[0.82,0.92], z:[110,139], duration:[6.0,6.9] },
    { name:'7',  weight:0.14, size:[5.4,5.9], opacity:[0.78,0.88], z:[85,109],  duration:[7.5,8.6] },
    { name:'6',  weight:0.13, size:[5.0,5.4], opacity:[0.72,0.82], z:[60,84],  duration:[9.0,10.2] },
    { name:'5',  weight:0.12, size:[4.6,5.0], opacity:[0.64,0.76], z:[40,59],  duration:[11.0,12.4] },
    { name:'4',  weight:0.10, size:[4.2,4.6], opacity:[0.56,0.7], z:[24,39],  duration:[13.0,14.6] },
    { name:'3',  weight:0.08, size:[3.9,4.2], opacity:[0.50,0.64], z:[14,23], duration:[15.0,16.4] },
    { name:'2',  weight:0.07, size:[2.7,3.9], opacity:[0.46,0.58], z:[8,13],  duration:[17.0,18.2] },
    { name:'1',  weight:0.06, size:[1.5,2.7], opacity:[0.42,0.54], z:[4,7],   duration:[19.0,20.0] }
  ];

  const stage = document.getElementById('stage');
  const starfield = document.getElementById('starfield');

  if (!stage || !starfield) return;

  const rand = (a,b) => Math.random()*(b-a)+a;
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
  function makePool(){ const pool = []; phrases.forEach(p => pool.push({type:'text', value:p})); images.forEach(src => pool.push({type:'img', value:src})); return pool; }
  let pool = makePool();

  function createStarfield(count){
    const existing = Array.from(starfield.children);
    if(existing.length === 0){
      for(let i=0;i<count;i++){
        const s = document.createElement('div');
        s.className = 'star';
        s.style.left = `${rand(0,100)}%`;
        s.style.top = `${rand(0,100)}%`;
        const size = Math.round(rand(1,3));
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.background = (Math.random() > 0.9) ? 'var(--star2)' : 'var(--star1)';
        s.style.animationDuration = `${rand(2.2,5.0).toFixed(2)}s`;
        s.style.animationDelay = `${rand(0,6).toFixed(2)}s`;
        starfield.appendChild(s);
      }
    } else {
      shuffleStarPositions();
    }
  }
  function shuffleStarPositions(){
    const stars = Array.from(starfield.children);
    if(stars.length === 0) return;
    const moveFrac = 0.40;
    const toMove = Math.max(4, Math.floor(stars.length * moveFrac));
    const indices = [];
    while(indices.length < toMove){
      const i = Math.floor(rand(0, stars.length));
      if(!indices.includes(i)) indices.push(i);
    }
    indices.forEach((idx, k) => {
      const s = stars[idx];
      const newLeft = rand(0,100);
      const newTop  = rand(0,100);
      const dur = rand(1600,3200);
      s.animate([{ transform: `translate(0,0)` }, { transform: `translate(0,0)` }], { duration: dur });
      setTimeout(()=> {
        s.style.left = `${newLeft}%`;
        s.style.top  = `${newTop}%`;
        s.style.animationDuration = `${rand(2.2,5.0).toFixed(2)}s`;
      }, k * rand(80,180));
    });
  }
  createStarfield(settings.starCount);
  setInterval(()=> shuffleStarPositions(), settings.starShuffleInterval);

  function createHeartQuad(){
    const options = [
      { sx:-10, sy:rand(5,25), dx:120, dy: rand(60,95), rot:-25 },
      { sx:rand(70,100), sy:-6, dx: rand(-60,-120), dy:120, rot: 25 },
      { sx:-10, sy:rand(60,90), dx:120, dy: rand(-40,10), rot: -45 },
      { sx:rand(70,100), sy:110, dx: rand(-80,-140), dy:-120, rot: 45 }
    ];
    for(let i=0;i<4;i++){
      const route = options[Math.floor(rand(0, options.length))];
      spawnHeartWithTrail(route);
    }
  }
  function spawnHeartWithTrail(o){
    const h = document.createElement('div');
    h.className = 'heart';
    h.innerText = '❤';
    h.style.left = `${o.sx}%`;
    h.style.top = `${o.sy}%`;
    h.style.transform = `rotate(${o.rot}deg)`;
    document.body.appendChild(h);
    const duration = Math.round(rand(4000,5200));
    const distanceX = o.dx;
    const distanceY = o.dy;
    h.animate([
      { transform: `translate(0px,0px) rotate(${o.rot}deg) scale(.95)`, opacity: 0 },
      { transform: `translate(${distanceX}vw, ${distanceY}vh) rotate(${o.rot}deg) scale(1.05)`, opacity: 1 },
      { transform: `translate(${distanceX*1.3}vw, ${distanceY*1.3}vh) rotate(${o.rot}deg) scale(.9)`, opacity: 0 }
    ], { duration: duration, easing: 'cubic-bezier(.2,.8,.2,1)' });
    const trailCount = 8;
    for(let t=0;t<trailCount;t++){
      const p = document.createElement('div');
      p.className = 'heart-trail';
      p.style.left = `${o.sx}%`;
      p.style.top  = `${o.sy}%`;
      document.body.appendChild(p);
      const td = Math.round(rand(1000, duration - 400));
      const spread = (t / trailCount) * 0.9;
      p.animate([
        { transform: `translate(0px,0px) scale(${0.5 + Math.random()*0.8})`, opacity: 0.9 },
        { transform: `translate(${distanceX*spread}vw, ${distanceY*spread}vh) scale(${0.3 + Math.random()*0.7})`, opacity: 0.35 },
        { transform: `translate(${distanceX*(spread+0.35)}vw, ${distanceY*(spread+0.35)}vh) scale(0.1)`, opacity: 0 }
      ], { duration: td, delay: Math.round(t * rand(40,110)), easing: 'cubic-bezier(.2,.8,.2,1)' });
      setTimeout(()=> { if(p && p.parentNode) p.parentNode.removeChild(p); }, td + 300 + t*120);
    }
    setTimeout(()=> { if(h && h.parentNode) h.parentNode.removeChild(h); }, duration + 80);
  }
  setInterval(createHeartQuad, settings.shootingInterval);

  function pickDepthLayerIndex(){
    const total = depthLayers.reduce((a,b)=> a + b.weight, 0);
    let r = Math.random()*total;
    for(let i=0;i<depthLayers.length;i++){
      if(r < depthLayers[i].weight) return i;
      r -= depthLayers[i].weight;
    }
    return depthLayers.length - 1;
  }
  function chooseNonCollidingLeft(minGapPercent = settings.minHorizontalGap, attempts = 16){
    const existing = Array.from(stage.children).map(c => parseFloat(c.style.left) || 0);
    for(let i=0;i<attempts;i++){
      const candidate = rand(3,92);
      const ok = existing.every(x => Math.abs(x - candidate) >= minGapPercent);
      if(ok) return candidate;
    }
    return rand(3,92);
  }
  function createFallingGroup(){
    if(pool.length === 0) return;
    if(stage.children.length > settings.maxItems) return;
    const item = pool[Math.floor(rand(0,pool.length))];
    const baseIndex = pickDepthLayerIndex();
    const iterations = Math.random() < 0.5 ? 2 : 3;
    for(let j=0;j<iterations;j++){
      const layerIndex = Math.min(baseIndex + j, depthLayers.length - 1);
      const layer = depthLayers[layerIndex];
      const el = document.createElement(item.type === 'img' ? 'img' : 'div');
      el.classList.add('falling');
      if(item.type === 'img') el.classList.add('img');

      const sizeVW = rand(layer.size[0], layer.size[1]).toFixed(2);
      const opacity = rand(layer.opacity[0], layer.opacity[1]).toFixed(2);
      const z = Math.floor(rand(layer.z[0], layer.z[1]));
      const duration = rand(layer.duration[0], layer.duration[1]).toFixed(2);
      if(item.type === 'img'){
        el.src = item.value;
        el.style.width = `${rand(8,20)}vw`;
        el.style.height = 'auto';
        el.loading = 'lazy';
        el.onerror = () => { try { if(el && el.parentNode) el.parentNode.removeChild(el); } catch(e) {} };
      } else {
        el.textContent = item.value;
        el.style.fontSize = `${sizeVW}vw`;
        el.style.webkitTextStroke = '0.0px rgba(0,0,0,0.02)';
      }
      let left = chooseNonCollidingLeft(settings.minHorizontalGap, 16);
      const offset = (j - (iterations-1)/2) * rand(2,5);
      left = clamp(left + offset, 2, 94);
      el.style.left = `${left}%`;
      el.style.zIndex = z - j;
      el.style.opacity = opacity;
      const delay = rand(0, 0.9).toFixed(2);
      el.style.animation = `fall ${duration}s linear ${delay}s 1 forwards, colorChange ${settings.colorCycle}s linear ${delay}s infinite`;
      el.addEventListener('animationend', (ev) => {
        if(ev.animationName === 'fall'){
          if(el && el.parentNode) el.parentNode.removeChild(el);
        }
      });
      el.style.userSelect = 'none';
      stage.appendChild(el);
    }
    if(stage.children.length > settings.maxItems){
      for(let i=0;i<6;i++){
        if(stage.firstChild) stage.removeChild(stage.firstChild);
      }
    }
  }
  setInterval(createFallingGroup, settings.spawnInterval);
  function initialFill(n = settings.initialFill){
    for(let i=0;i<n;i++){
      setTimeout(()=> createFallingGroup(), i * 120);
    }
  }
  initialFill();
  function refreshPool(){ pool = makePool(); }

  const audio = document.getElementById('bgAudio');
  const audioBtn = document.getElementById('audioControl');

  if (audio) {
    audio.play().catch(()=>{});
  }

  function updateAudioButton() {
    if (!audio) return;
    if (audio.muted || audio.volume === 0) {
      audioBtn.textContent = '🔇';
      audioBtn.setAttribute('aria-pressed', 'false');
      audioBtn.setAttribute('aria-label', 'Activar sonido');
    } else {
      audioBtn.textContent = '🔊';
      audioBtn.setAttribute('aria-pressed', 'true');
      audioBtn.setAttribute('aria-label', 'Desactivar sonido');
    }
  }

  audioBtn && audioBtn.addEventListener('click', (e) => {
    if (!audio) return;
    if (audio.muted) {
      audio.muted = false;
      audio.play().catch(()=>{});
    } else {
      audio.muted = true;
    }
    updateAudioButton();
  });

  updateAudioButton();
});
