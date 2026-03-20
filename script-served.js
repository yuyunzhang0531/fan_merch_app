const baseTemplates = [{ id: 1, name: '甜酷底图', url: 'image/sweet_baji.jpg' }];
const stickerTemplates = [{ id: 1, name: 'ins贴纸', url: 'image/sticker_ins.jpg' }];
const sizeMap = { '吧唧 58mm / 685px': { w: 685, h: 685 }, '小卡 54x86mm / 638x1016px': { w: 638, h: 1016 } };
const CUTOUT_MODE = 'removebg';
const REMOVE_BG_API_KEY = 'fnxGBUBXD2ekaF6KjQecrdYV';

let selectedBase = baseTemplates[0];
let selectedSticker = null;
let selectedSize = '吧唧 58mm / 685px';
let faceURL = null;
let idolObj = null;
let stickerObj = null;
let dragTarget = null;
let dragOffset = { x: 0, y: 0 };

const canvas = document.getElementById('preview-canvas');
const ctx = canvas.getContext('2d');

function setStatus(text) {
  const s = document.getElementById('status-debug');
  if (s) s.innerText = '状态：' + text;
}

function init() {
  loadBaseTemplates();
  loadStickerTemplates();
  loadSizes();
  setupUpload();
  setupButtons();
  updateCanvasSize();
  render();
  setStatus('初始化完成，请上传照片并生成。');
  setupDrag();
}

function updateCanvasSize() {
  const s = sizeMap[selectedSize];
  canvas.width = s.w;
  canvas.height = s.h;
  canvas.style.width = Math.min(s.w, 320) + 'px';
  canvas.style.height = Math.min(s.h, 320) + 'px';
  const preview = document.querySelector('.canvas-preview');
  if (preview) preview.style.display = 'block';
}

function loadBaseTemplates() {
  const grid = document.getElementById('template-grid');
  grid.innerHTML = '';
  baseTemplates.forEach((t, idx) => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.innerHTML = `<img src="${t.url}"><p>${t.name}</p>`;
    card.onclick = () => { selectedBase = t; document.getElementById('template-name').innerText = t.name; document.querySelectorAll('#template-grid .template-card').forEach(c => c.classList.remove('selected')); card.classList.add('selected'); render(); };
    grid.appendChild(card);
    if (idx === 0) { card.classList.add('selected'); document.getElementById('template-name').innerText = t.name; }
  });
}

function loadStickerTemplates() {
  const grid = document.getElementById('sticker-grid');
  grid.innerHTML = '';
  stickerTemplates.forEach(s => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.innerHTML = `<img src="${s.url}"><p>${s.name}</p>`;
    card.onclick = () => {
      if (selectedSticker && selectedSticker.id === s.id) { selectedSticker = null; stickerObj = null; document.getElementById('sticker-name').innerText = '未选择'; document.getElementById('selected-sticker').style.display = 'none'; }
      else { selectedSticker = s; stickerObj = { img: null, x: canvas.width * 0.75, y: canvas.height * 0.2, scale: 0.2 }; const img = new Image(); img.crossOrigin = 'anonymous'; img.onload = () => { stickerObj.img = img; render(); }; img.src = s.url; document.getElementById('sticker-name').innerText = s.name; document.getElementById('selected-sticker').style.display = 'block'; }
      document.querySelectorAll('#sticker-grid .template-card').forEach(c => c.classList.remove('selected'));
      if (selectedSticker) card.classList.add('selected');
      render();
    };
    grid.appendChild(card);
  });
}

function loadSizes() {
  const box = document.getElementById('size-options');
  box.innerHTML = '';
  Object.keys(sizeMap).forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'size-btn' + (key === selectedSize ? ' selected' : '');
    btn.innerText = key;
    btn.onclick = () => { selectedSize = key; document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); updateCanvasSize(); render(); };
    box.appendChild(btn);
  });
  document.getElementById('size-selector').style.display = 'block';
}

function setupUpload() {
  const input = document.getElementById('photo-upload');
  const area = document.getElementById('upload-area');
  area.onclick = () => input.click();
  input.onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setStatus('抠图中...');
    try { faceURL = await autoCutout(file); } catch (err) { console.warn(err); faceURL = await localRead(file); }
    document.getElementById('photo-preview').src = faceURL;
    document.getElementById('preview-area').style.display = 'block';
    idolObj = { img: null, x: canvas.width / 2, y: canvas.height / 2, scale: 0.7 };
    const img = new Image(); img.crossOrigin = 'anonymous'; img.onload = () => { idolObj.img = img; render(); }; img.src = faceURL;
    updateGenerateButton();
    setStatus('抠图完成');
    render();
  };
}

function setupButtons() {
  document.getElementById('generate-btn').onclick = () => { if (!idolObj || !idolObj.img) { alert('请先上传照片'); return; } render(); };
  document.getElementById('download-btn').onclick = () => { const a = document.createElement('a'); a.href = canvas.toDataURL('image/jpeg', 0.95); a.download = 'idol-material.jpg'; a.click(); };
  document.getElementById('reset-btn').onclick = () => { selectedSticker = null; idolObj = null; stickerObj = null; faceURL = null; document.getElementById('sticker-name').innerText = '未选择'; document.getElementById('selected-sticker').style.display = 'none'; document.getElementById('photo-preview').src = ''; document.getElementById('preview-area').style.display = 'none'; document.querySelectorAll('#sticker-grid .template-card').forEach(c => c.classList.remove('selected')); render(); setStatus('已重置'); };
}

function render() {
  updateCanvasSize();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const base = new Image();
  base.crossOrigin = 'anonymous';
  base.onload = () => {
    ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
    drawObjects();
  };
  base.src = selectedBase.url;
  document.querySelector('.canvas-preview').style.display = 'block';
}

function drawObjects() {
  if (idolObj && idolObj.img) {
    const w = idolObj.img.width * idolObj.scale;
    const h = idolObj.img.height * idolObj.scale;
    ctx.drawImage(idolObj.img, idolObj.x - w / 2, idolObj.y - h / 2, w, h);
  }
  if (stickerObj && stickerObj.img) {
    const w = stickerObj.img.width * stickerObj.scale;
    const h = stickerObj.img.height * stickerObj.scale;
    ctx.drawImage(stickerObj.img, stickerObj.x - w / 2, stickerObj.y - h / 2, w, h);
  }
}

function setupDrag() {
  let active = null;
  canvas.style.cursor = 'grab';

  canvas.addEventListener('pointerdown', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let hit = null;

    if (stickerObj && stickerObj.img) {
      const w = stickerObj.img.width * stickerObj.scale;
      const h = stickerObj.img.height * stickerObj.scale;
      if (x > stickerObj.x - w / 2 && x < stickerObj.x + w / 2 && y > stickerObj.y - h / 2 && y < stickerObj.y + h / 2) {
        hit = stickerObj;
      }
    }
    if (!hit && idolObj && idolObj.img) {
      const w = idolObj.img.width * idolObj.scale;
      const h = idolObj.img.height * idolObj.scale;
      if (x > idolObj.x - w / 2 && x < idolObj.x + w / 2 && y > idolObj.y - h / 2 && y < idolObj.y + h / 2) {
        hit = idolObj;
      }
    }

    if (hit) {
      active = hit;
      dragOffset.x = x - hit.x;
      dragOffset.y = y - hit.y;
      canvas.style.cursor = 'grabbing';
      setStatus(hit === stickerObj ? '拖拽贴纸' : '拖拽人物');
      e.preventDefault();
    }
  });

  canvas.addEventListener('pointermove', e => {
    if (!active) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    active.x = x - dragOffset.x;
    active.y = y - dragOffset.y;
    render();
  });

  canvas.addEventListener('pointerup', () => { active = null; canvas.style.cursor = 'grab'; });
  canvas.addEventListener('pointerleave', () => { active = null; canvas.style.cursor = 'grab'; });

  canvas.addEventListener('wheel', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let target = null;

    if (stickerObj && stickerObj.img) {
      const w = stickerObj.img.width * stickerObj.scale;
      const h = stickerObj.img.height * stickerObj.scale;
      if (x > stickerObj.x - w / 2 && x < stickerObj.x + w / 2 && y > stickerObj.y - h / 2 && y < stickerObj.y + h / 2) target = stickerObj;
    }
    if (!target && idolObj && idolObj.img) {
      const w = idolObj.img.width * idolObj.scale;
      const h = idolObj.img.height * idolObj.scale;
      if (x > idolObj.x - w / 2 && x < idolObj.x + w / 2 && y > idolObj.y - h / 2 && y < idolObj.y + h / 2) target = idolObj;
    }

    if (target) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      target.scale = Math.max(0.2, Math.min(2.5, target.scale + delta));
      render();
      setStatus((target === stickerObj ? '贴纸' : '人物') + '缩放到 ' + target.scale.toFixed(2));
    }
  });
}

function autoCutout(file) { if (CUTOUT_MODE === 'removebg') return removeBgCutout(file); return localRead(file); }
function localRead(file) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); }); }
async function removeBgCutout(file) { const form = new FormData(); form.append('image_file', file); form.append('size', 'auto'); const r = await fetch('https://api.remove.bg/v1.0/removebg', { method: 'POST', headers: { 'X-Api-Key': REMOVE_BG_API_KEY }, body: form }); if (!r.ok) throw new Error('removebg fail'); const blob = await r.blob(); return new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(blob); }); }

document.addEventListener('DOMContentLoaded', init);
