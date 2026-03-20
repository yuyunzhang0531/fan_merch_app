/**
 * 追星物料 AI 生成器
 * 制图页：包含独立账号入口、积分下载和充值弹窗
 */

const API_BASE = window.location.origin;
const ASSET_BASE = (() => {
    const configuredBase = String(window.FAN_MERCH_CONFIG?.assetBase || '').trim();
    return configuredBase ? configuredBase.replace(/\/+$/, '') : '';
})();

function buildAssetUrl(assetPath) {
    const normalizedPath = String(assetPath || '').trim();
    if (!normalizedPath) return '';
    if (/^(https?:)?\/\//i.test(normalizedPath) || normalizedPath.startsWith('data:') || normalizedPath.startsWith('blob:')) {
        return normalizedPath;
    }
    if (!ASSET_BASE) {
        return normalizedPath.replace(/^\/+/, '');
    }
    return `${ASSET_BASE}/${normalizedPath.replace(/^\/+/, '')}`;
}

const baseTemplates = [
    { id: 1, name: '甜酷风吧唧1', category: 'badge', style: 'sweet', url: buildAssetUrl('image/sweet_baji.jpg') },
    { id: 2, name: '横板黑粉爱心小卡1', category: 'photocard', style: 'ins', url: buildAssetUrl('image/hengbanxiaoka 1.2.png') },
    { id: 3, name: '横板黑粉爱心小卡2', category: 'photocard', style: 'ins', url: buildAssetUrl('image/横板 1.1.png') },
    { id: 4, name: '横板黑粉爱心小卡3', category: 'photocard', style: 'ins', url: buildAssetUrl('image/横板 2.1 框.png') },
    { id: 5, name: '横板黑粉爱心小卡4', category: 'photocard', style: 'ins', url: buildAssetUrl('image/横板 2.1.png') },
    { id: 6, name: '横板黑粉爱心小卡5', category: 'photocard', style: 'ins', url: buildAssetUrl('image/横板 2.2.png') },
    { id: 7, name: '横板黑粉爱心小卡6', category: 'photocard', style: 'ins', url: buildAssetUrl('image/横板 3.1.png') },
    { id: 8, name: '横板黑粉爱心小卡7', category: 'photocard', style: 'ins', url: buildAssetUrl('image/横板 3.2.png') },
     { id: 9, name: '横板黑粉小卡8', category: 'photocard', style: 'ins', url: buildAssetUrl('image/横板 4.1.png') },
    { id: 10, name: '横板黑粉小卡9', category: 'photocard', style: 'ins', url: buildAssetUrl('image/横板 4.2.png') },
    { id: 11, name: '蛋糕吧唧1', category: 'badge', style: 'sweet', url: buildAssetUrl('image/蛋糕吧唧1.png') },
    { id: 12, name: '蛋糕吧唧2', category: 'badge', style: 'sweet', url: buildAssetUrl('image/蛋糕吧唧2.png') },
    { id: 13, name: '蛋糕吧唧3', category: 'badge', style: 'sweet', url: buildAssetUrl('image/蛋糕吧唧3.png') },
    { id: 14, name: '猫爪吧唧', category: 'badge', style: 'sweet', url: buildAssetUrl('image/猫爪吧唧.png') },
    { id: 15, name: 'ins风吧唧1', category: 'badge', style: 'ins', url: buildAssetUrl('image/吧唧1cai.png') },
    { id: 16, name: 'ins风吧唧2', category: 'badge', style: 'ins', url: buildAssetUrl('image/吧唧2cai.png') },
    { id: 17, name: '奥利奥卡背', category: 'photocard', style: 'ins', url: buildAssetUrl('image/奥利奥卡背.png') },
    { id: 18, name: '奥利奥小卡正面', category: 'photocard', style: 'ins', url: buildAssetUrl('image/奥利奥小卡正面.png') },
    { id: 19, name: '奥利奥mini三宫格卡背', category: 'photobooth', style: 'ins', url: buildAssetUrl('image/奥利奥mini三宫格卡背.png') },
    { id: 20, name: '奥利奥mini三宫格正面', category: 'photobooth', style: 'ins', url: buildAssetUrl('image/奥利奥mini三宫格正面.png') },
    { id: 21, name: '灌汤包搞怪吧唧1', category: 'badge', style: 'weird', url: buildAssetUrl('image/灌汤包吧唧1.png') },
    { id: 22, name: '灌汤包搞怪吧唧2', category: 'badge', style: 'weird', url: buildAssetUrl('image/灌汤包吧唧2.png') },
    { id: 23, name: '灌汤包小卡1', category: 'photocard', style: 'weird', url: buildAssetUrl('image/灌汤包小卡1.png') },
    { id: 24, name: '灌汤包小卡2', category: 'photocard', style: 'weird', url: buildAssetUrl('image/灌汤包小卡2.png') },
    { id: 25, name: '灌汤包mini三宫格1', category: 'photobooth', style: 'weird', url: buildAssetUrl('image/灌汤包mini三宫格1.png') },
    { id: 26, name: '灌汤包mini三宫格2', category: 'photobooth', style: 'weird', url: buildAssetUrl('image/灌汤包mini三宫格2.png') }
];

const stickerTemplates = [
    { id: 1, name: 'ins贴纸', style: 'ins', url: buildAssetUrl('image/ins贴纸.PNG') },
    { id: 2, name: '甜美风贴纸1', style: 'sweet', url: buildAssetUrl('image/yinfu.png') },
    { id: 3, name: '贴纸2', style: 'sweet', url: buildAssetUrl('image/1Stan海外素材.png') },
    { id: 4, name: '贴纸3', style: 'sweet', url: buildAssetUrl('image/2Stan海外素材.png') },
    { id: 5, name: '贴纸4', style: 'sweet', url: buildAssetUrl('image/3Stan海外素材.png') },
    { id: 6, name: '贴纸5', style: 'sweet', url: buildAssetUrl('image/4Stan海外素材.png') },
    { id: 7, name: '贴纸6', style: 'sweet', url: buildAssetUrl('image/5Stan海外素材.png') },
    { id: 8, name: '贴纸7', style: 'sweet', url: buildAssetUrl('image/6Stan海外素材.png') },
    { id: 9, name: '贴纸8', style: 'sweet', url: buildAssetUrl('image/7Stan海外素材.png') },
    { id: 10, name: '贴纸9', style: 'sweet', url: buildAssetUrl('image/8Stan海外素材.png') },
    { id: 11, name: 'Stan海外贴纸10', style: 'sweet', url: buildAssetUrl('image/10Stan海外素材.png') },
    { id: 12, name: 'Stan海外贴纸11', style: 'sweet', url: buildAssetUrl('image/11Stan海外素材.png') },
    { id: 13, name: 'Stan海外贴纸13', style: 'sweet', url: buildAssetUrl('image/13Stan海外素材.png') },
    { id: 14, name: 'Stan海外贴纸22', style: 'sweet', url: buildAssetUrl('image/22Stan海外素材.png') },
    { id: 15, name: 'Stan海外贴纸24', style: 'sweet', url: buildAssetUrl('image/24Stan海外素材.png') },
    { id: 16, name: 'Stan海外贴纸25', style: 'sweet', url: buildAssetUrl('image/25Stan海外素材.png') },
    { id: 17, name: 'Stan海外贴纸26', style: 'sweet', url: buildAssetUrl('image/26Stan海外素材.png') },
    { id: 18, name: 'Stan海外贴纸27', style: 'sweet', url: buildAssetUrl('image/27Stan海外素材.png') },
    { id: 19, name: 'Stan海外贴纸45', style: 'sweet', url: buildAssetUrl('image/45Stan海外素材.png') },
    { id: 20, name: 'Stan海外贴纸49', style: 'sweet', url: buildAssetUrl('image/49Stan海外素材.png') },
    { id: 21, name: 'Stan海外贴纸50', style: 'sweet', url: buildAssetUrl('image/50Stan海外素材.png') },
    { id: 22, name: 'Stan海外贴纸56', style: 'sweet', url: buildAssetUrl('image/56Stan海外素材.png') },
    { id: 23, name: 'Stan海外贴纸58', style: 'sweet', url: buildAssetUrl('image/58Stan海外素材.png') },
    { id: 24, name: 'Stan海外贴纸61', style: 'sweet', url: buildAssetUrl('image/61Stan海外素材.png') },
    { id: 25, name: '日杂贴纸1', style: 'magazine', url: buildAssetUrl('image/1.png') },
    { id: 26, name: '日杂贴纸2', style: 'magazine', url: buildAssetUrl('image/2.png') }
];

const REMOVE_BG_API_KEY = 'GBL88ZG76BJBKp4VF52VQtvq';
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const DOWNLOAD_RECOVERY_KEY = 'fanMerchDownloadRecovery';
const DRAFT_STORAGE_KEY = 'fanMerchCanvasDraft';
const CUTOUT_LIBRARY_DB_NAME = 'fanMerchLocalAssets';
const CUTOUT_LIBRARY_STORE = 'cutouts';
const MAX_LOCAL_CUTOUTS = 12;
const MOBILE_ASSET_BATCH_SIZE = 3;
const DESKTOP_ASSET_BATCH_SIZE = 6;
const TEXT_STYLE_PRESETS = {
    default: { fontFamily: 'Microsoft YaHei', fontWeight: '700' },
    cute: { fontFamily: 'YouYuan, Microsoft YaHei, sans-serif', fontWeight: '700' },
    handwrite: { fontFamily: 'STXingkai, KaiTi, FangSong, cursive', fontWeight: '700' },
    bold: { fontFamily: 'Microsoft YaHei, PingFang SC, sans-serif', fontWeight: '900' }
};

let canvas;
let templateImage = null;
let templateLocked = false;
let idolObj = null;
let pendingFile = null;
let currentCategory = 'all';
let currentStyle = 'all';
let currentStickerStyle = 'all';
let visibleTemplateCount = 0;
let visibleStickerCount = 0;
let authToken = localStorage.getItem('fanMerchToken') || '';
let currentUser = {
    email: localStorage.getItem('fanMerchEmail') || '',
    credits: Number(localStorage.getItem('fanMerchCredits') || 0)
};

let cropMode = false;
let cropStartX = 0;
let cropStartY = 0;
let cropEndX = 0;
let cropEndY = 0;
let cropObjectId = null;
let originalCanvasObjects = [];
let pendingCropRect = null;
let cropDragging = false;
let templateLoadToken = 0;
let downloadInProgress = false;
let draftSaveTimer = null;
let suppressDraftSave = false;
let cutoutDbPromise = null;
let responsiveCanvasFrame = 0;
let assetAutoLoadFrame = 0;
let stickerCutoutState = {
    sourceUrl: '',
    sourceName: '',
    image: null,
    maskCanvas: null,
    maskedPreviewCanvas: null,
    drawRect: null,
    fitScale: 1,
    isDrawing: false,
    lastPoint: null,
    brushSize: 28,
    isLoading: false
};

function syncResponsiveCanvas() {
    if (!canvas) return;

    const wrapper = document.querySelector('.canvas-container-wrapper');
    if (!wrapper) return;

    const wrapperStyles = window.getComputedStyle(wrapper);
    const horizontalPadding = (parseFloat(wrapperStyles.paddingLeft) || 0) + (parseFloat(wrapperStyles.paddingRight) || 0);
    const availableWidth = Math.max((wrapper.clientWidth || 0) - horizontalPadding, 0);
    if (!availableWidth) return;

    const nextDisplaySize = Math.min(availableWidth, CANVAS_WIDTH);
    const scale = nextDisplaySize / CANVAS_WIDTH;

    canvas.setDimensions({ width: nextDisplaySize, height: nextDisplaySize });
    canvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);
    canvas.getObjects().forEach((obj) => obj.setCoords());
    canvas.calcOffset();
    canvas.requestRenderAll();
}

function scheduleResponsiveCanvasSync() {
    if (responsiveCanvasFrame) {
        window.cancelAnimationFrame(responsiveCanvasFrame);
    }
    responsiveCanvasFrame = window.requestAnimationFrame(() => {
        responsiveCanvasFrame = 0;
        syncResponsiveCanvas();
    });
}

function getStickerCutoutElements() {
    return {
        modal: document.getElementById('sticker-cutout-modal'),
        canvas: document.getElementById('sticker-cutout-canvas'),
        title: document.getElementById('sticker-cutout-title'),
        loading: document.getElementById('sticker-cutout-loading'),
        brushInput: document.getElementById('sticker-brush-size'),
        brushValue: document.getElementById('sticker-brush-size-value'),
        closeBtn: document.getElementById('close-sticker-cutout-btn'),
        resetBtn: document.getElementById('reset-sticker-cutout-btn'),
        directBtn: document.getElementById('sticker-cutout-direct-btn'),
        applyBtn: document.getElementById('sticker-cutout-apply-btn')
    };
}

function setStickerCutoutLoading(isLoading, message = '') {
    const { modal, title, loading, canvas, brushInput, resetBtn, directBtn, applyBtn } = getStickerCutoutElements();
    stickerCutoutState.isLoading = isLoading;

    if (modal) {
        modal.classList.toggle('is-loading', isLoading);
    }

    if (title && message) {
        title.innerText = message;
    }

    if (loading) {
        loading.hidden = !isLoading;
    }

    if (canvas) {
        canvas.style.visibility = isLoading ? 'hidden' : 'visible';
    }

    if (brushInput) {
        brushInput.disabled = isLoading;
    }

    if (resetBtn) {
        resetBtn.disabled = isLoading;
    }

    if (directBtn) {
        directBtn.disabled = isLoading;
    }

    if (applyBtn) {
        applyBtn.disabled = isLoading;
    }
}

function resizeStickerCutoutCanvas() {
    const { canvas } = getStickerCutoutElements();
    if (!canvas) return;
    const shell = canvas.parentElement;
    const shellWidth = shell ? shell.clientWidth : 0;
    const nextSize = Math.max(260, Math.min(shellWidth || 520, 520));
    canvas.width = nextSize;
    canvas.height = nextSize;
}

function ensureStickerCutoutBuffers() {
    const image = stickerCutoutState.image;
    if (!image) return;
    if (!stickerCutoutState.maskCanvas) {
        stickerCutoutState.maskCanvas = document.createElement('canvas');
        stickerCutoutState.maskCanvas.width = image.naturalWidth;
        stickerCutoutState.maskCanvas.height = image.naturalHeight;
    }
    if (!stickerCutoutState.maskedPreviewCanvas) {
        stickerCutoutState.maskedPreviewCanvas = document.createElement('canvas');
        stickerCutoutState.maskedPreviewCanvas.width = image.naturalWidth;
        stickerCutoutState.maskedPreviewCanvas.height = image.naturalHeight;
    }
}

function computeStickerCutoutLayout() {
    const { canvas } = getStickerCutoutElements();
    const image = stickerCutoutState.image;
    if (!canvas || !image) return null;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const fitScale = Math.min(canvasWidth / image.naturalWidth, canvasHeight / image.naturalHeight);
    const drawWidth = image.naturalWidth * fitScale;
    const drawHeight = image.naturalHeight * fitScale;
    const drawX = (canvasWidth - drawWidth) / 2;
    const drawY = (canvasHeight - drawHeight) / 2;
    stickerCutoutState.fitScale = fitScale;
    stickerCutoutState.drawRect = { x: drawX, y: drawY, width: drawWidth, height: drawHeight };
    return stickerCutoutState.drawRect;
}

function renderStickerCutoutPreview() {
    const { canvas } = getStickerCutoutElements();
    const image = stickerCutoutState.image;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ensureStickerCutoutBuffers();
    const drawRect = computeStickerCutoutLayout();
    if (!drawRect) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f7f2fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, drawRect.x, drawRect.y, drawRect.width, drawRect.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillRect(drawRect.x, drawRect.y, drawRect.width, drawRect.height);

    const previewCanvas = stickerCutoutState.maskedPreviewCanvas;
    const previewCtx = previewCanvas.getContext('2d');
    const maskCanvas = stickerCutoutState.maskCanvas;
    if (!previewCtx || !maskCanvas) return;

    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.drawImage(image, 0, 0);
    previewCtx.globalCompositeOperation = 'destination-in';
    previewCtx.drawImage(maskCanvas, 0, 0);
    previewCtx.globalCompositeOperation = 'source-over';

    ctx.drawImage(previewCanvas, drawRect.x, drawRect.y, drawRect.width, drawRect.height);
    ctx.strokeStyle = 'rgba(255, 121, 170, 0.9)';
    ctx.lineWidth = 2;
    ctx.strokeRect(drawRect.x + 1, drawRect.y + 1, Math.max(drawRect.width - 2, 0), Math.max(drawRect.height - 2, 0));
}

function getStickerCutoutPointerPosition(event) {
    const { canvas } = getStickerCutoutElements();
    const drawRect = stickerCutoutState.drawRect;
    if (!canvas || !drawRect) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX ?? event.touches?.[0]?.clientX;
    const clientY = event.clientY ?? event.touches?.[0]?.clientY;
    if (typeof clientX !== 'number' || typeof clientY !== 'number') return null;
    const localX = ((clientX - rect.left) / rect.width) * canvas.width;
    const localY = ((clientY - rect.top) / rect.height) * canvas.height;
    if (localX < drawRect.x || localX > drawRect.x + drawRect.width || localY < drawRect.y || localY > drawRect.y + drawRect.height) {
        return null;
    }
    const sourceX = (localX - drawRect.x) / stickerCutoutState.fitScale;
    const sourceY = (localY - drawRect.y) / stickerCutoutState.fitScale;
    return { x: sourceX, y: sourceY };
}

function paintStickerCutoutPoint(fromPoint, toPoint) {
    const maskCanvas = stickerCutoutState.maskCanvas;
    if (!maskCanvas) return;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;
    maskCtx.save();
    maskCtx.strokeStyle = '#ffffff';
    maskCtx.fillStyle = '#ffffff';
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.lineWidth = stickerCutoutState.brushSize / Math.max(stickerCutoutState.fitScale, 0.001);
    if (!fromPoint) {
        maskCtx.beginPath();
        maskCtx.arc(toPoint.x, toPoint.y, maskCtx.lineWidth / 2, 0, Math.PI * 2);
        maskCtx.fill();
    } else {
        maskCtx.beginPath();
        maskCtx.moveTo(fromPoint.x, fromPoint.y);
        maskCtx.lineTo(toPoint.x, toPoint.y);
        maskCtx.stroke();
    }
    maskCtx.restore();
    renderStickerCutoutPreview();
}

function resetStickerCutoutMask() {
    if (stickerCutoutState.maskCanvas) {
        const ctx = stickerCutoutState.maskCanvas.getContext('2d');
        ctx?.clearRect(0, 0, stickerCutoutState.maskCanvas.width, stickerCutoutState.maskCanvas.height);
    }
    renderStickerCutoutPreview();
}

function getStickerCutoutBounds() {
    const maskCanvas = stickerCutoutState.maskCanvas;
    if (!maskCanvas) return null;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return null;
    const width = maskCanvas.width;
    const height = maskCanvas.height;
    const { data } = ctx.getImageData(0, 0, width, height);
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    for (let index = 3; index < data.length; index += 4) {
        if (data[index] <= 0) continue;
        const pixelIndex = (index - 3) / 4;
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    }
    if (maxX < minX || maxY < minY) return null;
    return {
        x: minX,
        y: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1
    };
}

function extractStickerCutoutDataUrl() {
    const image = stickerCutoutState.image;
    const maskCanvas = stickerCutoutState.maskCanvas;
    if (!image || !maskCanvas) return '';
    const bounds = getStickerCutoutBounds();
    if (!bounds) return '';

    const mergedCanvas = document.createElement('canvas');
    mergedCanvas.width = image.naturalWidth;
    mergedCanvas.height = image.naturalHeight;
    const mergedCtx = mergedCanvas.getContext('2d');
    if (!mergedCtx) return '';
    mergedCtx.drawImage(image, 0, 0);
    mergedCtx.globalCompositeOperation = 'destination-in';
    mergedCtx.drawImage(maskCanvas, 0, 0);
    mergedCtx.globalCompositeOperation = 'source-over';

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = bounds.width;
    exportCanvas.height = bounds.height;
    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return '';
    exportCtx.drawImage(mergedCanvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
    return exportCanvas.toDataURL('image/png');
}

function closeStickerCutoutModal() {
    const { modal } = getStickerCutoutElements();
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    stickerCutoutState.isDrawing = false;
    stickerCutoutState.lastPoint = null;
    stickerCutoutState.isLoading = false;
}

function openStickerCutoutModal(url, name = '') {
    if (!requireEditorLogin('选择贴纸')) return;
    const { modal, title } = getStickerCutoutElements();
    if (!modal) return;

    stickerCutoutState.sourceUrl = url;
    stickerCutoutState.sourceName = name || '贴纸';
    stickerCutoutState.image = null;
    stickerCutoutState.maskCanvas = null;
    stickerCutoutState.maskedPreviewCanvas = null;
    stickerCutoutState.lastPoint = null;
    stickerCutoutState.isDrawing = false;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    resizeStickerCutoutCanvas();
    setStickerCutoutLoading(true, `正在载入 ${stickerCutoutState.sourceName}，马上进入涂抹/整张导入选择区...`);

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
        stickerCutoutState.image = image;
        stickerCutoutState.maskCanvas = null;
        stickerCutoutState.maskedPreviewCanvas = null;
        stickerCutoutState.lastPoint = null;
        if (title) {
            title.innerText = `当前素材：${stickerCutoutState.sourceName}。涂抹要保留的图案，再单独加入画布。`;
        }
        resizeStickerCutoutCanvas();
        resetStickerCutoutMask();
        setStickerCutoutLoading(false);
    };
    image.onerror = () => {
        setStickerCutoutLoading(false, '贴纸加载失败，请重新选择其他素材。');
        closeStickerCutoutModal();
        alert('贴纸素材加载失败，请检查图片路径');
    };
    image.src = url;
}

function setupStickerCutoutTools() {
    const { modal, canvas, brushInput, brushValue, closeBtn, resetBtn, directBtn, applyBtn } = getStickerCutoutElements();
    if (!modal || !canvas || !brushInput || !closeBtn || !resetBtn || !directBtn || !applyBtn) return;

    const syncBrushValue = () => {
        stickerCutoutState.brushSize = Number(brushInput.value || 28);
        if (brushValue) {
            brushValue.innerText = String(stickerCutoutState.brushSize);
        }
    };

    brushInput.addEventListener('input', syncBrushValue);
    syncBrushValue();

    const beginDraw = (event) => {
        if (stickerCutoutState.isLoading) return;
        event.preventDefault();
        const point = getStickerCutoutPointerPosition(event);
        if (!point) return;
        stickerCutoutState.isDrawing = true;
        stickerCutoutState.lastPoint = point;
        paintStickerCutoutPoint(null, point);
    };

    const moveDraw = (event) => {
        if (stickerCutoutState.isLoading) return;
        if (!stickerCutoutState.isDrawing) return;
        event.preventDefault();
        const point = getStickerCutoutPointerPosition(event);
        if (!point) return;
        paintStickerCutoutPoint(stickerCutoutState.lastPoint, point);
        stickerCutoutState.lastPoint = point;
    };

    const endDraw = () => {
        stickerCutoutState.isDrawing = false;
        stickerCutoutState.lastPoint = null;
    };

    canvas.addEventListener('pointerdown', beginDraw);
    canvas.addEventListener('pointermove', moveDraw);
    canvas.addEventListener('pointerup', endDraw);
    canvas.addEventListener('pointerleave', endDraw);
    canvas.addEventListener('pointercancel', endDraw);

    closeBtn.addEventListener('click', closeStickerCutoutModal);
    resetBtn.addEventListener('click', resetStickerCutoutMask);
    directBtn.addEventListener('click', () => {
        addStickerToCanvas(stickerCutoutState.sourceUrl, stickerCutoutState.sourceName);
        closeStickerCutoutModal();
    });
    applyBtn.addEventListener('click', () => {
        const dataUrl = extractStickerCutoutDataUrl();
        if (!dataUrl) {
            alert('请先在贴纸图上涂抹要保留的图案');
            return;
        }
        addStickerToCanvas(dataUrl, `${stickerCutoutState.sourceName}-选中图案`);
        closeStickerCutoutModal();
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeStickerCutoutModal();
        }
    });

    window.addEventListener('resize', () => {
        if (!modal.classList.contains('show')) return;
        resizeStickerCutoutCanvas();
        renderStickerCutoutPreview();
    });
}

function isTextObject(obj) {
    return Boolean(obj && ['i-text', 'textbox', 'text'].includes(obj.type));
}

function syncWindowCurrentUser() {
    window.currentUser = currentUser;
}

function persistCurrentUser() {
    syncWindowCurrentUser();
    if (currentUser.email) {
        localStorage.setItem('fanMerchEmail', currentUser.email);
    } else {
        localStorage.removeItem('fanMerchEmail');
    }
    localStorage.setItem('fanMerchCredits', String(Number(currentUser.credits || 0)));
}

async function apiRequest(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || '请求失败');
    }
    return data;
}

function getCurrentCredits() {
    return Number(currentUser?.credits || 0);
}

function isUserLoggedIn() {
    return Boolean(authToken && currentUser.email);
}

function goToAuthPage(actionText = '') {
    try {
        sessionStorage.setItem('fanMerchAuthReturnTo', 'index.html');
        if (actionText) {
            sessionStorage.setItem('fanMerchAuthMessage', `请先登录后再${actionText}`);
        } else {
            sessionStorage.removeItem('fanMerchAuthMessage');
        }
    } catch (error) {
        // ignore sessionStorage write failure
    }
    window.location.assign('auth.html');
}

function confirmAuthRedirect(actionText = '进行操作') {
    const shouldRedirect = window.confirm(`请先登录后再${actionText}。\n点击“确定”前往登录/注册页面。`);
    if (!shouldRedirect) {
        return false;
    }
    goToAuthPage(actionText);
    return true;
}

function requireEditorLogin(actionText = '进行制作') {
    if (isUserLoggedIn()) return true;
    confirmAuthRedirect(actionText);
    return false;
}

function updateCropModeUI() {
    const btn = document.getElementById('btn-crop-mode');
    const cropActionBar = document.getElementById('crop-action-bar');
    const canvasWrapper = document.querySelector('.canvas-container-wrapper');
    const cropGestureLayer = document.getElementById('crop-gesture-layer');

    if (btn) {
        btn.style.background = cropMode ? '#ff5252' : '#ff9800';
        btn.innerText = cropMode ? '✂️ 裁剪中' : '✂️ 裁剪模式';
    }

    if (cropActionBar) {
        cropActionBar.hidden = !cropMode;
    }

    if (canvasWrapper) {
        canvasWrapper.classList.toggle('is-crop-mode', cropMode);
    }

    if (cropGestureLayer) {
        cropGestureLayer.hidden = !cropMode;
        cropGestureLayer.classList.toggle('is-active', cropMode);
    }

    if (canvas?.upperCanvasEl) {
        canvas.upperCanvasEl.style.touchAction = cropMode ? 'none' : 'manipulation';
        canvas.upperCanvasEl.style.pointerEvents = cropMode ? 'none' : '';
    }
}

function updateDownloadButtonState(isBusy) {
    const downloadBtn = document.getElementById('download-btn');
    if (!downloadBtn) return;
    downloadBtn.disabled = Boolean(isBusy);
    downloadBtn.innerText = isBusy ? '⏳ 下载处理中...' : '⬇️ 下载作品';
}

function updateTextSizeLabel(sizeValue) {
    const sizeLabel = document.getElementById('text-size-value');
    if (!sizeLabel) return;
    sizeLabel.innerText = `${sizeValue}px`;
}

function updateRangeValueLabel(labelId, value, suffix = '') {
    const label = document.getElementById(labelId);
    if (!label) return;
    label.innerText = `${value}${suffix}`;
}

function getTextStylePresetValue(textObject) {
    if (textObject?.textStylePreset && TEXT_STYLE_PRESETS[textObject.textStylePreset]) {
        return textObject.textStylePreset;
    }

    const fontFamily = String(textObject?.fontFamily || '').toLowerCase();
    const fontWeight = String(textObject?.fontWeight || '');
    if (fontFamily.includes('youyuan')) return 'cute';
    if (fontFamily.includes('stxingkai') || fontFamily.includes('kaiti') || fontFamily.includes('fangsong')) return 'handwrite';
    if (fontWeight === '900' || fontWeight.toLowerCase() === 'bold') return 'bold';
    return 'default';
}

function buildTextShadow(shadowColor, shadowBlur) {
    const blur = Number(shadowBlur || 0);
    if (blur <= 0) return null;
    const offset = Math.max(2, Math.round(blur / 3));
    return new fabric.Shadow({
        color: shadowColor || '#ff9ac3',
        blur,
        offsetX: offset,
        offsetY: offset
    });
}

function getTextToolValues() {
    const textInput = document.getElementById('text-input');
    const colorInput = document.getElementById('text-color');
    const sizeInput = document.getElementById('text-size');
    const stylePresetInput = document.getElementById('text-style-preset');
    const strokeColorInput = document.getElementById('text-stroke-color');
    const strokeWidthInput = document.getElementById('text-stroke-width');
    const shadowColorInput = document.getElementById('text-shadow-color');
    const shadowBlurInput = document.getElementById('text-shadow-blur');
    const stylePreset = stylePresetInput?.value || 'default';
    const presetConfig = TEXT_STYLE_PRESETS[stylePreset] || TEXT_STYLE_PRESETS.default;

    return {
        text: String(textInput?.value || '').trim(),
        fill: colorInput?.value || '#ff4f93',
        fontSize: Number(sizeInput?.value || 42),
        textStylePreset: stylePreset,
        fontFamily: presetConfig.fontFamily,
        fontWeight: presetConfig.fontWeight,
        stroke: strokeColorInput?.value || '#ffffff',
        strokeWidth: Number(strokeWidthInput?.value || 0),
        shadowColor: shadowColorInput?.value || '#ff9ac3',
        shadowBlur: Number(shadowBlurInput?.value || 0)
    };
}

function applyTextAppearance(targetObject, textOptions) {
    targetObject.set({
        text: textOptions.text,
        fill: textOptions.fill,
        fontSize: textOptions.fontSize,
        fontFamily: textOptions.fontFamily,
        fontWeight: textOptions.fontWeight,
        stroke: textOptions.strokeWidth > 0 ? textOptions.stroke : null,
        strokeWidth: textOptions.strokeWidth,
        shadow: buildTextShadow(textOptions.shadowColor, textOptions.shadowBlur),
        textStylePreset: textOptions.textStylePreset
    });
}

function syncTextToolState() {
    const statusEl = document.getElementById('text-tool-status');
    const textInput = document.getElementById('text-input');
    const colorInput = document.getElementById('text-color');
    const sizeInput = document.getElementById('text-size');
    const stylePresetInput = document.getElementById('text-style-preset');
    const strokeColorInput = document.getElementById('text-stroke-color');
    const strokeWidthInput = document.getElementById('text-stroke-width');
    const shadowColorInput = document.getElementById('text-shadow-color');
    const shadowBlurInput = document.getElementById('text-shadow-blur');
    if (!statusEl || !textInput || !colorInput || !sizeInput || !stylePresetInput || !strokeColorInput || !strokeWidthInput || !shadowColorInput || !shadowBlurInput) return;

    const activeObject = canvas?.getActiveObject();
    if (!isTextObject(activeObject)) {
        statusEl.innerText = '输入文字后可添加到画布';
        updateTextSizeLabel(sizeInput.value);
        updateRangeValueLabel('text-stroke-width-value', strokeWidthInput.value, 'px');
        updateRangeValueLabel('text-shadow-blur-value', shadowBlurInput.value);
        return;
    }

    textInput.value = activeObject.text || '';
    colorInput.value = activeObject.fill || '#ff4f93';
    sizeInput.value = String(Math.round(Number(activeObject.fontSize || 42)));
    stylePresetInput.value = getTextStylePresetValue(activeObject);
    strokeColorInput.value = activeObject.stroke || '#ffffff';
    strokeWidthInput.value = String(Math.round(Number(activeObject.strokeWidth || 0)));
    shadowColorInput.value = activeObject.shadow?.color || '#ff9ac3';
    shadowBlurInput.value = String(Math.round(Number(activeObject.shadow?.blur || 0)));
    updateTextSizeLabel(sizeInput.value);
    updateRangeValueLabel('text-stroke-width-value', strokeWidthInput.value, 'px');
    updateRangeValueLabel('text-shadow-blur-value', shadowBlurInput.value);
    statusEl.innerText = '已选中文字，可直接修改字体、描边和阴影';
}

function addTextToCanvas() {
    if (!requireEditorLogin('添加文字')) return;

    const textOptions = getTextToolValues();
    if (!textOptions.text) {
        alert('请先输入文字内容');
        return;
    }

    const textObj = new fabric.IText(textOptions.text, {
        left: CANVAS_WIDTH / 2,
        top: CANVAS_HEIGHT / 2,
        originX: 'center',
        originY: 'center',
        textAlign: 'center',
        editable: true,
        selectable: true,
        evented: true,
        cornerColor: '#ff8fc5',
        borderColor: '#ff8fc5',
        transparentCorners: false,
        objectRole: 'text'
    });

    applyTextAppearance(textObj, textOptions);

    textObj.setControlsVisibility({ mtr: true });
    canvas.add(textObj);
    textObj.bringToFront();
    canvas.setActiveObject(textObj);
    canvas.renderAll();
    applyEditorPermission();
    syncTextToolState();
    scheduleDraftSave();
}

function applyTextStyleToSelectedObject() {
    if (!requireEditorLogin('编辑文字')) return;

    const activeObject = canvas.getActiveObject();
    if (!isTextObject(activeObject)) {
        alert('请先选中文字对象');
        return;
    }

    const textOptions = getTextToolValues();
    if (!textOptions.text) {
        alert('文字内容不能为空');
        return;
    }

    applyTextAppearance(activeObject, textOptions);
    activeObject.setCoords();
    canvas.renderAll();
    syncTextToolState();
    scheduleDraftSave();
}

function setupTextControls() {
    const addTextBtn = document.getElementById('add-text-btn');
    const applyTextBtn = document.getElementById('apply-text-style-btn');
    const sizeInput = document.getElementById('text-size');
    const textInput = document.getElementById('text-input');
    const colorInput = document.getElementById('text-color');
    const stylePresetInput = document.getElementById('text-style-preset');
    const strokeColorInput = document.getElementById('text-stroke-color');
    const strokeWidthInput = document.getElementById('text-stroke-width');
    const shadowColorInput = document.getElementById('text-shadow-color');
    const shadowBlurInput = document.getElementById('text-shadow-blur');

    if (addTextBtn) {
        addTextBtn.onclick = addTextToCanvas;
    }

    if (applyTextBtn) {
        applyTextBtn.onclick = applyTextStyleToSelectedObject;
    }

    if (sizeInput) {
        updateTextSizeLabel(sizeInput.value);
        sizeInput.oninput = () => {
            updateTextSizeLabel(sizeInput.value);
            const activeObject = canvas?.getActiveObject();
            if (!isTextObject(activeObject)) return;
            activeObject.set('fontSize', Number(sizeInput.value));
            activeObject.setCoords();
            canvas.renderAll();
            scheduleDraftSave();
        };
    }

    if (strokeWidthInput) {
        updateRangeValueLabel('text-stroke-width-value', strokeWidthInput.value, 'px');
        strokeWidthInput.oninput = () => {
            updateRangeValueLabel('text-stroke-width-value', strokeWidthInput.value, 'px');
            const activeObject = canvas?.getActiveObject();
            if (!isTextObject(activeObject)) return;
            activeObject.set({
                strokeWidth: Number(strokeWidthInput.value),
                stroke: Number(strokeWidthInput.value) > 0 ? (strokeColorInput?.value || '#ffffff') : null
            });
            activeObject.setCoords();
            canvas.renderAll();
            scheduleDraftSave();
        };
    }

    if (shadowBlurInput) {
        updateRangeValueLabel('text-shadow-blur-value', shadowBlurInput.value);
        shadowBlurInput.oninput = () => {
            updateRangeValueLabel('text-shadow-blur-value', shadowBlurInput.value);
            const activeObject = canvas?.getActiveObject();
            if (!isTextObject(activeObject)) return;
            activeObject.set('shadow', buildTextShadow(shadowColorInput?.value || '#ff9ac3', Number(shadowBlurInput.value)));
            canvas.renderAll();
            scheduleDraftSave();
        };
    }

    if (textInput) {
        textInput.addEventListener('input', () => {
            const activeObject = canvas?.getActiveObject();
            if (!isTextObject(activeObject) || !activeObject.isEditing) return;
            activeObject.text = textInput.value;
            canvas.renderAll();
            scheduleDraftSave();
        });
    }

    if (colorInput) {
        colorInput.addEventListener('input', () => {
            const activeObject = canvas?.getActiveObject();
            if (!isTextObject(activeObject)) return;
            activeObject.set('fill', colorInput.value);
            canvas.renderAll();
            scheduleDraftSave();
        });
    }

    if (stylePresetInput) {
        stylePresetInput.addEventListener('change', () => {
            const activeObject = canvas?.getActiveObject();
            if (!isTextObject(activeObject)) return;
            const preset = TEXT_STYLE_PRESETS[stylePresetInput.value] || TEXT_STYLE_PRESETS.default;
            activeObject.set({
                fontFamily: preset.fontFamily,
                fontWeight: preset.fontWeight,
                textStylePreset: stylePresetInput.value
            });
            activeObject.setCoords();
            canvas.renderAll();
            scheduleDraftSave();
        });
    }

    if (strokeColorInput) {
        strokeColorInput.addEventListener('input', () => {
            const activeObject = canvas?.getActiveObject();
            if (!isTextObject(activeObject)) return;
            if (Number(strokeWidthInput?.value || 0) <= 0) return;
            activeObject.set('stroke', strokeColorInput.value);
            canvas.renderAll();
            scheduleDraftSave();
        });
    }

    if (shadowColorInput) {
        shadowColorInput.addEventListener('input', () => {
            const activeObject = canvas?.getActiveObject();
            if (!isTextObject(activeObject)) return;
            if (Number(shadowBlurInput?.value || 0) <= 0) return;
            activeObject.set('shadow', buildTextShadow(shadowColorInput.value, Number(shadowBlurInput.value)));
            canvas.renderAll();
            scheduleDraftSave();
        });
    }
}

function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getAssetBatchSize() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = Boolean(connection?.saveData);
    const effectiveType = String(connection?.effectiveType || '').toLowerCase();
    if (isMobile && (saveData || effectiveType.includes('2g'))) {
        return 2;
    }
    return isMobile ? MOBILE_ASSET_BATCH_SIZE : DESKTOP_ASSET_BATCH_SIZE;
}

function getPreviewAssetUrl(url) {
    if (typeof url !== 'string') {
        return url;
    }
    if (url.startsWith('image/')) {
        return url.replace(/^image\//, 'image/previews/');
    }
    return url.replace('/image/', '/image/previews/');
}

function isLocalImageAsset(url) {
    return typeof url === 'string' && (url.startsWith('image/') || url.includes('/image/'));
}

function shouldUseLightweightCanvasAssets() {
    return window.matchMedia('(max-width: 768px)').matches;
}

function getCanvasAssetSources(url) {
    const originalSrc = url;
    const previewSrc = isLocalImageAsset(url) ? getPreviewAssetUrl(url) : '';
    const displaySrc = shouldUseLightweightCanvasAssets() && previewSrc ? previewSrc : originalSrc;
    return {
        originalSrc,
        previewSrc,
        displaySrc
    };
}

function loadImageElementWithFallback(primarySrc, fallbackSrc = '') {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = () => resolve(image);
        image.onerror = () => {
            if (fallbackSrc && primarySrc !== fallbackSrc) {
                image.src = fallbackSrc;
                return;
            }
            reject(new Error('图片加载失败'));
        };

        image.src = primarySrc;
    });
}

function buildExportCanvasJson() {
    const canvasJson = canvas.toJSON(['objectRole', 'id', 'isCropPreview', 'originalSrc', 'previewSrc']);
    canvasJson.objects = (canvasJson.objects || []).filter((obj) => !obj.isCropPreview).map((obj) => {
        if (obj && obj.type === 'image' && obj.originalSrc) {
            return { ...obj, src: obj.originalSrc };
        }
        return obj;
    });
    return canvasJson;
}

function shouldRenderTemplateAssets() {
    const templateDrawer = document.querySelector('.template-drawer');
    if (!window.matchMedia('(max-width: 768px)').matches) {
        return true;
    }
    return Boolean(templateDrawer?.open);
}

function shouldRenderStickerAssets() {
    const stickerDrawer = document.querySelector('.sticker-drawer');
    if (!window.matchMedia('(max-width: 768px)').matches) {
        return true;
    }
    return Boolean(stickerDrawer?.open);
}

function createAssetCard(name, previewUrl, originalUrl, onClick) {
    const div = document.createElement('div');
    div.className = 'template-card';

    const img = document.createElement('img');
    img.alt = name;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.fetchPriority = 'low';
    img.className = 'asset-preview is-loading';
    img.draggable = false;
    img.src = previewUrl || originalUrl;
    img.addEventListener('load', () => {
        img.classList.remove('is-loading');
        img.classList.add('is-ready');
    });
    img.addEventListener('error', () => {
        if (img.src !== originalUrl) {
            img.src = originalUrl;
            return;
        }
        img.classList.remove('is-loading');
    });
    img.addEventListener('dragstart', (event) => event.preventDefault());

    const title = document.createElement('p');
    title.innerText = name;

    div.appendChild(img);
    div.appendChild(title);
    div.onclick = (event) => {
        event.preventDefault();
        onClick();
    };

    return div;
}

function updateAssetLoadMoreButton(buttonId, visibleCount, totalCount, label) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    const hasMore = totalCount > visibleCount;
    button.hidden = !hasMore;
    button.style.display = hasMore ? 'block' : 'none';
    button.innerText = hasMore ? `${label}（剩余 ${totalCount - visibleCount}）` : label;
}

function updateAssetLoadStatus(statusId, visibleCount, totalCount, noun) {
    const status = document.getElementById(statusId);
    if (!status) return;
    if (!totalCount) {
        status.innerText = '';
        return;
    }
    status.innerText = `已显示 ${Math.min(visibleCount, totalCount)} / ${totalCount} 个${noun}`;
}

function autoLoadMoreAssetsIfNeeded() {
    return;
}

function scheduleAutoLoadMoreAssets() {
    return;
}

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('图片读取失败'));
        reader.readAsDataURL(blob);
    });
}

function getCutoutLibraryDb() {
    if (cutoutDbPromise) return cutoutDbPromise;
    cutoutDbPromise = new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject(new Error('当前浏览器不支持本地人物库'));
            return;
        }

        const request = window.indexedDB.open(CUTOUT_LIBRARY_DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(CUTOUT_LIBRARY_STORE)) {
                db.createObjectStore(CUTOUT_LIBRARY_STORE, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('本地人物库打开失败'));
    });
    return cutoutDbPromise;
}

async function getAllCutoutRecords() {
    const db = await getCutoutLibraryDb();
    return new Promise((resolve, reject) => {
        const request = db.transaction(CUTOUT_LIBRARY_STORE, 'readonly').objectStore(CUTOUT_LIBRARY_STORE).getAll();
        request.onsuccess = () => {
            const records = Array.isArray(request.result) ? request.result : [];
            records.sort((left, right) => Number(right.createdAt || 0) - Number(left.createdAt || 0));
            resolve(records);
        };
        request.onerror = () => reject(request.error || new Error('读取本地人物库失败'));
    });
}

async function getCutoutRecordById(recordId) {
    const db = await getCutoutLibraryDb();
    return new Promise((resolve, reject) => {
        const request = db.transaction(CUTOUT_LIBRARY_STORE, 'readonly').objectStore(CUTOUT_LIBRARY_STORE).get(recordId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error || new Error('读取人物失败'));
    });
}

async function putCutoutRecord(record) {
    const db = await getCutoutLibraryDb();
    return new Promise((resolve, reject) => {
        const request = db.transaction(CUTOUT_LIBRARY_STORE, 'readwrite').objectStore(CUTOUT_LIBRARY_STORE).put(record);
        request.onsuccess = () => resolve(record);
        request.onerror = () => reject(request.error || new Error('保存本地人物失败'));
    });
}

async function deleteCutoutRecord(recordId) {
    const db = await getCutoutLibraryDb();
    return new Promise((resolve, reject) => {
        const request = db.transaction(CUTOUT_LIBRARY_STORE, 'readwrite').objectStore(CUTOUT_LIBRARY_STORE).delete(recordId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error('删除本地人物失败'));
    });
}

async function trimCutoutLibrary() {
    try {
        const records = await getAllCutoutRecords();
        const overflow = records.slice(MAX_LOCAL_CUTOUTS);
        await Promise.all(overflow.map((record) => deleteCutoutRecord(record.id)));
    } catch (error) {
        // ignore trim failure
    }
}

async function saveCutoutToLibrary(imageData, name = '人物抠图') {
    if (!imageData) return;
    const record = {
        id: `cutout-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        name: String(name || '人物抠图'),
        imageData,
        createdAt: Date.now()
    };

    await putCutoutRecord(record);
    await trimCutoutLibrary();
    await renderCutoutLibrary();
}

async function renderCutoutLibrary() {
    const statusEl = document.getElementById('cutout-library-status');
    const gridEl = document.getElementById('cutout-library-grid');
    if (!statusEl || !gridEl) return;

    statusEl.innerText = '正在读取本地人物库...';

    try {
        const records = await getAllCutoutRecords();
        if (!records.length) {
            statusEl.innerText = '暂无本地人物。先抠一次图，后面就能直接复用。';
            gridEl.innerHTML = '<div class="cutout-library-empty">还没有保存的人物抠图</div>';
            return;
        }

        statusEl.innerText = `已保存 ${records.length} 个本地人物`; 
        gridEl.innerHTML = records.map((record) => `
            <div class="cutout-library-card">
                <img src="${record.imageData}" alt="${escapeHtml(record.name)}">
                <div class="cutout-library-name">${escapeHtml(record.name)}</div>
                <div class="cutout-library-time">${formatTimestamp(record.createdAt)}</div>
                <div class="cutout-library-actions">
                    <button type="button" class="cutout-library-btn use" data-cutout-action="use" data-cutout-id="${record.id}">放回画布</button>
                    <button type="button" class="cutout-library-btn delete" data-cutout-action="delete" data-cutout-id="${record.id}">删除</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        statusEl.innerText = error.message || '本地人物库读取失败';
        gridEl.innerHTML = '<div class="cutout-library-empty">当前浏览器暂时无法读取本地人物库</div>';
    }
}

function addIdolToCanvas(imageSrc) {
    return new Promise((resolve, reject) => {
        fabric.Image.fromURL(imageSrc, (img) => {
            if (!img) {
                reject(new Error('人物载入失败'));
                return;
            }

            if (idolObj) canvas.remove(idolObj);
            img.set({
                left: CANVAS_WIDTH / 2,
                top: CANVAS_HEIGHT / 2,
                originX: 'center',
                originY: 'center',
                selectable: true,
                evented: true,
                borderColor: '#ff69b4',
                cornerColor: '#ff69b4',
                cornerSize: 12,
                objectRole: 'idol'
            });
            img.scaleToWidth(360);
            idolObj = img;
            canvas.add(img);

            if (templateImage) {
                const templateIndex = canvas.getObjects().indexOf(templateImage);
                if (templateIndex > 0) {
                    img.moveTo(templateIndex - 1);
                }
            }

            canvas.setActiveObject(img);
            canvas.renderAll();
            applyEditorPermission();
            scheduleDraftSave();
            resolve(img);
        }, { crossOrigin: 'anonymous' });
    });
}

async function placeCutoutFromLibrary(recordId) {
    if (!requireEditorLogin('使用本地人物库')) return;

    try {
        const record = await getCutoutRecordById(recordId);
        if (!record?.imageData) {
            alert('这个人物素材不存在了');
            await renderCutoutLibrary();
            return;
        }

        pendingFile = null;
        const uploadText = document.getElementById('upload-area')?.querySelector('p');
        if (uploadText) {
            uploadText.innerText = `📚 已从本地库载入：${record.name}`;
        }
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.disabled = true;
        }

        await addIdolToCanvas(record.imageData);
    } catch (error) {
        alert(error.message || '读取本地人物失败');
    }
}

async function removeCutoutFromLibrary(recordId) {
    try {
        await deleteCutoutRecord(recordId);
        await renderCutoutLibrary();
    } catch (error) {
        alert(error.message || '删除失败');
    }
}

function setupCutoutLibraryEvents() {
    const refreshBtn = document.getElementById('refresh-cutout-library-btn');
    const gridEl = document.getElementById('cutout-library-grid');

    if (refreshBtn) {
        refreshBtn.onclick = () => {
            renderCutoutLibrary();
        };
    }

    if (gridEl) {
        gridEl.onclick = async (event) => {
            const actionBtn = event.target.closest('[data-cutout-action]');
            if (!actionBtn) return;

            event.preventDefault();
            const action = actionBtn.getAttribute('data-cutout-action');
            const recordId = actionBtn.getAttribute('data-cutout-id');
            if (!recordId) return;

            if (action === 'use') {
                await placeCutoutFromLibrary(recordId);
                return;
            }

            if (action === 'delete') {
                const confirmed = window.confirm('确定删除这张本地抠图吗？');
                if (!confirmed) return;
                await removeCutoutFromLibrary(recordId);
            }
        };
    }
}

function buildCanvasRecoveryState() {
    if (!canvas) return null;
    const canvasJson = canvas.toJSON(['objectRole', 'id', 'isCropPreview', 'originalSrc', 'previewSrc']);
    canvasJson.objects = (canvasJson.objects || []).filter((obj) => !obj.isCropPreview);

    return {
        savedAt: Date.now(),
        backgroundColor: canvas.backgroundColor || '#ffffff',
        templateLocked: Boolean(templateLocked),
        templateName: document.getElementById('template-name')?.innerText || '未选择',
        uploadText: document.getElementById('upload-area')?.querySelector('p')?.innerText || '📸 点击上传爱豆照片',
        generateDisabled: Boolean(document.getElementById('generate-btn')?.disabled),
        canvasJson
    };
}

function saveDraftState() {
    if (suppressDraftSave) return;

    try {
        const state = buildCanvasRecoveryState();
        const objects = state?.canvasJson?.objects || [];
        if (!objects.length) {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            return;
        }
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        // ignore draft save failure
    }
}

function scheduleDraftSave() {
    if (suppressDraftSave) return;
    window.clearTimeout(draftSaveTimer);
    draftSaveTimer = window.setTimeout(() => {
        saveDraftState();
    }, 120);
}

function clearDraftState() {
    window.clearTimeout(draftSaveTimer);
    try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (error) {
        // ignore draft cleanup failure
    }
}

function saveCanvasRecoveryState() {
    try {
        const state = buildCanvasRecoveryState();
        if (!state) return;
        sessionStorage.setItem(DOWNLOAD_RECOVERY_KEY, JSON.stringify(state));
    } catch (error) {
        // ignore recovery snapshot failure
    }
}

function clearCanvasRecoveryState() {
    try {
        sessionStorage.removeItem(DOWNLOAD_RECOVERY_KEY);
    } catch (error) {
        // ignore storage cleanup failure
    }
}

function restoreCanvasState(rawState, shouldClearRecovery = false) {
    return new Promise((resolve) => {
        if (!rawState) {
            resolve(false);
            return;
        }

        let state;
        try {
            state = JSON.parse(rawState);
        } catch (error) {
            if (shouldClearRecovery) {
                clearCanvasRecoveryState();
            }
            resolve(false);
            return;
        }

        if (!state?.canvasJson) {
            if (shouldClearRecovery) {
                clearCanvasRecoveryState();
            }
            resolve(false);
            return;
        }

        suppressDraftSave = true;
        canvas.loadFromJSON(state.canvasJson, () => {
            canvas.backgroundColor = state.backgroundColor || '#ffffff';
            templateLocked = Boolean(state.templateLocked);
            templateImage = null;
            idolObj = null;
            pendingFile = null;

            canvas.getObjects().forEach((obj) => {
                if (obj.objectRole === 'template') {
                    templateImage = obj;
                }
                if (obj.objectRole === 'idol') {
                    idolObj = obj;
                }
            });

            const templateNameEl = document.getElementById('template-name');
            if (templateNameEl) {
                templateNameEl.innerText = state.templateName || '未选择';
            }

            const uploadTextEl = document.getElementById('upload-area')?.querySelector('p');
            if (uploadTextEl) {
                uploadTextEl.innerText = state.uploadText || '📸 点击上传爱豆照片';
            }

            const generateBtn = document.getElementById('generate-btn');
            if (generateBtn) {
                generateBtn.disabled = true;
            }

            updateTemplateLockButton();
            applyTemplateLockState();
            applyEditorPermission();
            canvas.renderAll();

            if (shouldClearRecovery) {
                clearCanvasRecoveryState();
            }

            suppressDraftSave = false;
            scheduleDraftSave();
            resolve(true);
        });
    });
}

function restoreCanvasRecoveryState() {
    let rawState = '';
    try {
        rawState = sessionStorage.getItem(DOWNLOAD_RECOVERY_KEY) || '';
    } catch (error) {
        return Promise.resolve(false);
    }

    return restoreCanvasState(rawState, true);
}

function restoreDraftState() {
    let rawState = '';
    try {
        rawState = localStorage.getItem(DRAFT_STORAGE_KEY) || '';
    } catch (error) {
        return Promise.resolve(false);
    }

    return restoreCanvasState(rawState, false);
}

function applyEditorPermission() {
    if (!canvas) return;
    canvas.selection = !cropMode;
    canvas.skipTargetFind = false;

    canvas.forEachObject((obj) => {
        if (obj.isCropPreview) return;
        const isTpl = obj === templateImage;
        obj.lockMovementX = false;
        obj.lockMovementY = false;
        obj.lockScalingX = false;
        obj.lockScalingY = false;
        obj.lockRotation = false;
        obj.selectable = true;
        obj.evented = true;
        obj.hasControls = true;

        if (isTpl) {
            obj.selectable = !templateLocked;
            obj.evented = !templateLocked;
            obj.hasControls = !templateLocked;
        }
    });

    canvas.requestRenderAll();
}

async function syncCurrentUserState() {
    if (!authToken || !currentUser.email) {
        currentUser = { email: '', credits: 0 };
        persistCurrentUser();
        updateAuthEntryUI();
        return;
    }

    try {
        const data = await apiRequest('/api/user/data');
        currentUser = {
            email: data.email || currentUser.email,
            credits: Number(data.credits || 0)
        };
        persistCurrentUser();
    } catch (error) {
        authToken = '';
        currentUser = { email: '', credits: 0 };
        localStorage.removeItem('fanMerchToken');
        persistCurrentUser();
    }

    updateAuthEntryUI();
}

async function logoutSession() {
    if (authToken) {
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${authToken}` }
            });
        } catch (error) {
            // ignore network error on logout
        }
    }
    authToken = '';
    currentUser = { email: '', credits: 0 };
    localStorage.removeItem('fanMerchToken');
    persistCurrentUser();
    updateAuthEntryUI();
}

function updateAuthEntryUI() {
    const status = document.getElementById('account-status');
    const logoutBtn = document.getElementById('logout-btn');
    const rechargeBtn = document.getElementById('recharge-btn');
    const mobileStatus = document.getElementById('mobile-nav-status');
    const mobileRechargeBtn = document.getElementById('mobile-nav-recharge');
    const mobileLogoutBtn = document.getElementById('mobile-nav-logout');
    if (!status || !logoutBtn) return;

    if (currentUser.email) {
        status.innerText = `已登录：${currentUser.email} ｜ 积分：${getCurrentCredits()}`;
        if (mobileStatus) mobileStatus.innerText = `已登录：${currentUser.email} ｜ 积分：${getCurrentCredits()}`;
        logoutBtn.style.display = 'inline-flex';
        if (rechargeBtn) rechargeBtn.style.display = 'inline-flex';
        if (mobileRechargeBtn) mobileRechargeBtn.style.display = 'inline-flex';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'inline-flex';
    } else {
        status.innerText = '未登录 ｜ 积分：0';
        if (mobileStatus) mobileStatus.innerText = '未登录 ｜ 积分：0';
        logoutBtn.style.display = 'none';
        if (rechargeBtn) rechargeBtn.style.display = 'none';
        if (mobileRechargeBtn) mobileRechargeBtn.style.display = 'none';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
    }

}

function setupMobileNavMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navDrawer = document.getElementById('mobile-nav-drawer');
    const navBackdrop = document.getElementById('mobile-nav-backdrop');
    const closeBtn = document.getElementById('mobile-nav-close');
    const authBtn = document.getElementById('mobile-nav-auth');
    const recordsBtn = document.getElementById('mobile-nav-records');
    const rechargeBtn = document.getElementById('mobile-nav-recharge');
    const logoutBtn = document.getElementById('mobile-nav-logout');

    if (!menuToggle || !navDrawer || !navBackdrop) return;

    const openNav = () => {
        navDrawer.classList.add('is-open');
        navDrawer.setAttribute('aria-hidden', 'false');
        navBackdrop.hidden = false;
        navBackdrop.classList.add('show');
    };

    const closeNav = () => {
        navDrawer.classList.remove('is-open');
        navDrawer.setAttribute('aria-hidden', 'true');
        navBackdrop.hidden = true;
        navBackdrop.classList.remove('show');
    };

    menuToggle.onclick = openNav;
    if (closeBtn) closeBtn.onclick = closeNav;
    navBackdrop.onclick = closeNav;

    if (authBtn) {
        authBtn.onclick = () => {
            closeNav();
            window.location.href = 'auth.html';
        };
    }

    if (recordsBtn) {
        recordsBtn.onclick = () => {
            closeNav();
            window.location.href = 'auth.html';
        };
    }

    if (rechargeBtn) {
        rechargeBtn.onclick = () => {
            closeNav();
            if (!authToken || !currentUser.email) {
                confirmAuthRedirect('充值');
                return;
            }
            openRechargeModal('随时充值，赶快增加积分吧！');
        };
    }

    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            closeNav();
            await logoutSession();
        };
    }
}

function buildRechargeOptions() {
    const quickBtns = document.querySelectorAll('.quick-recharge-btn');
    if (!quickBtns.length) return;
    
    quickBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const amount = Number(btn.getAttribute('data-amount'));
            const customInput = document.getElementById('recharge-custom-amount');
            if (customInput) customInput.value = amount;
            handleRechargeConfirm();
        });
    });
}

function openRechargeModal(message) {
    const modal = document.getElementById('recharge-modal');
    const messageBox = document.getElementById('recharge-message');
    if (!modal || !messageBox) return;
    buildRechargeOptions();
    messageBox.innerText = message || '下载作品需要 1 个积分，当前积分不足，请先充值。';
    modal.classList.add('show');
}

function closeRechargeModal() {
    document.getElementById('recharge-modal')?.classList.remove('show');
}

async function appendUserHistory(message) {
    if (!isUserLoggedIn()) return;
    const text = String(message || '').trim();
    if (!text) return;
    try {
        await apiRequest('/api/user/history', {
            method: 'POST',
            body: JSON.stringify({ message: text })
        });
    } catch (error) {
        // ignore history write failure
    }
}

async function saveGeneratedToLibrary(imageData) {
    if (!isUserLoggedIn() || !imageData) return;
    try {
        await apiRequest('/api/user/generated', {
            method: 'POST',
            body: JSON.stringify({ image: imageData })
        });
    } catch (error) {
        // ignore gallery write failure
    }
}

async function handleRechargeConfirm() {
    if (!authToken || !currentUser.email) {
        confirmAuthRedirect('充值');
        return;
    }

    const customInput = document.getElementById('recharge-custom-amount');
    const amount = customInput?.value ? Number(customInput.value) : null;
    
    if (!amount || amount <= 0) {
        alert('请输入有效的充值金额');
        return;
    }

    const confirmBtn = document.getElementById('confirm-recharge-btn');
    if (confirmBtn) confirmBtn.disabled = true;

    try {
        const data = await apiRequest('/api/user/recharge', {
            method: 'POST',
            body: JSON.stringify({ amount })
        });
        currentUser.credits = Number(data.credits || 0);
        persistCurrentUser();
        updateAuthEntryUI();
        closeRechargeModal();
        alert(`充值成功，已到账 ${data.addedCredits || 0} 积分`);
    } catch (error) {
        alert(error.message || '充值失败');
    } finally {
        if (confirmBtn) confirmBtn.disabled = false;
    }
}

function initAuthEntry() {
    const openAuthBtn = document.getElementById('open-auth-btn');
    const openRecordsBtn = document.getElementById('open-records-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const rechargeBtn = document.getElementById('recharge-btn');
    const closeRechargeBtn = document.getElementById('close-recharge-btn');
    const cancelRechargeBtn = document.getElementById('cancel-recharge-btn');
    const confirmRechargeBtn = document.getElementById('confirm-recharge-btn');
    const rechargeModal = document.getElementById('recharge-modal');

    if (openAuthBtn) {
        openAuthBtn.onclick = () => {
            window.location.href = 'auth.html';
        };
    }
    if (openRecordsBtn) {
        openRecordsBtn.onclick = () => {
            window.location.href = 'auth.html';
        };
    }
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            logoutSession();
        };
    }
    if (rechargeBtn) {
        rechargeBtn.onclick = () => {
            if (!authToken || !currentUser.email) {
                confirmAuthRedirect('充值');
                return;
            }
            openRechargeModal('随时充值，赶快增加积分吧！');
        };
    }
    if (closeRechargeBtn) {
        closeRechargeBtn.onclick = closeRechargeModal;
    }
    if (cancelRechargeBtn) {
        cancelRechargeBtn.onclick = closeRechargeModal;
    }
    if (confirmRechargeBtn) {
        confirmRechargeBtn.onclick = handleRechargeConfirm;
    }
    if (rechargeModal) {
        rechargeModal.addEventListener('click', (event) => {
            if (event.target === rechargeModal) {
                closeRechargeModal();
            }
        });
    }

    buildRechargeOptions();
    updateAuthEntryUI();
}

function fitImageIntoCanvas(imageObject) {
    const scale = Math.min(CANVAS_WIDTH / imageObject.width, CANVAS_HEIGHT / imageObject.height);
    imageObject.scale(scale);
    imageObject.set({
        left: CANVAS_WIDTH / 2,
        top: CANVAS_HEIGHT / 2,
        originX: 'center',
        originY: 'center'
    });
}

function constrainObjectWithinCanvas(obj) {
    if (!obj) return;
    if (obj.isCropPreview) return;

    const bounds = obj.getBoundingRect(true, true);
    if (!bounds || !Number.isFinite(bounds.left) || !Number.isFinite(bounds.top)) return;

    let deltaX = 0;
    let deltaY = 0;

    if (bounds.left < 0) {
        deltaX += -bounds.left;
    }
    if (bounds.top < 0) {
        deltaY += -bounds.top;
    }
    if (bounds.left + bounds.width > CANVAS_WIDTH) {
        deltaX -= (bounds.left + bounds.width - CANVAS_WIDTH);
    }
    if (bounds.top + bounds.height > CANVAS_HEIGHT) {
        deltaY -= (bounds.top + bounds.height - CANVAS_HEIGHT);
    }

    const nextLeft = Number(obj.left || 0) + deltaX;
    const nextTop = Number(obj.top || 0) + deltaY;

    if (!Number.isFinite(nextLeft) || !Number.isFinite(nextTop)) return;
    obj.set({ left: nextLeft, top: nextTop });
    obj.setCoords();
}

function applyTemplateLockState() {
    if (!templateImage) return;
    const isLocked = Boolean(templateLocked);
    templateImage.set({
        selectable: !isLocked,
        evented: !isLocked,
        hasControls: !isLocked,
        hoverCursor: isLocked ? 'default' : 'move'
    });
    if (isLocked && canvas.getActiveObject() === templateImage) {
        canvas.discardActiveObject();
    }
    canvas.requestRenderAll();
}

function updateTemplateLockButton() {
    const lockBtn = document.getElementById('btn-toggle-template-lock');
    if (!lockBtn) return;
    const hasTemplate = Boolean(templateImage);
    lockBtn.disabled = !hasTemplate;
    lockBtn.innerText = templateLocked ? '🔓 解锁模板' : '🔒 锁定模板';
    lockBtn.classList.toggle('is-locked', templateLocked);
}

function toggleTemplateLock() {
    if (!requireEditorLogin('操作模板')) return;
    if (!templateImage) {
        alert('请先选择一个模板');
        return;
    }
    templateLocked = !templateLocked;
    applyTemplateLockState();
    updateTemplateLockButton();

    if (!templateLocked) {
        canvas.setActiveObject(templateImage);
        canvas.requestRenderAll();
    }

    scheduleDraftSave();
}

function loadTemplate(url, name = '') {
    if (!requireEditorLogin('选择模板')) return;

    if (cropMode) {
        exitCropMode();
    }

    const currentToken = ++templateLoadToken;
    const previousTemplate = templateImage;
    const assetSources = getCanvasAssetSources(url);
    loadImageElementWithFallback(assetSources.displaySrc, assetSources.originalSrc).then((image) => {
        if (currentToken !== templateLoadToken) return;
        try {
            const nextTemplate = new fabric.Image(image, {
                selectable: true,
                evented: true,
                hoverCursor: 'move',
                borderColor: '#f57ab8',
                cornerColor: '#f57ab8',
                cornerSize: 12,
                visible: true,
                opacity: 1,
                objectCaching: false,
                originalSrc: assetSources.originalSrc,
                previewSrc: assetSources.previewSrc
            });

            fitImageIntoCanvas(nextTemplate);
            constrainObjectWithinCanvas(nextTemplate);

            if (templateImage && canvas.getObjects().includes(templateImage)) {
                canvas.remove(templateImage);
            }

            templateImage = nextTemplate;
            templateImage.objectRole = 'template';
            templateLocked = true;
            applyTemplateLockState();
            canvas.add(templateImage);
            templateImage.bringToFront();

            // 如果已有AI人物，保持它存在并位于模板下一层，避免切模板时人物消失
            if (idolObj && canvas.getObjects().includes(idolObj)) {
                const templateIndex = canvas.getObjects().indexOf(templateImage);
                if (templateIndex > 0) {
                    idolObj.moveTo(templateIndex - 1);
                }
            }

            if (!canvas.getObjects().includes(templateImage)) {
                canvas.add(templateImage);
            }
            templateImage.visible = true;
            templateImage.opacity = 1;
            templateImage.setCoords();

            // 模板默认锁定，不再强制设为选中态，避免锁定态和选中态冲突导致重绘异常
            canvas.discardActiveObject();
            canvas.renderAll();
            document.getElementById('template-name').innerText = name || url.split('/').pop();
            updateTemplateLockButton();
            applyEditorPermission();
            scheduleDraftSave();
        } catch (error) {
            // 发生异常时回退到旧模板，避免“模板消失”
            if (previousTemplate && !canvas.getObjects().includes(previousTemplate)) {
                canvas.add(previousTemplate);
                previousTemplate.bringToFront();
            }
            templateImage = previousTemplate || null;
            canvas.renderAll();
            alert('模板加载失败，请重试');
        }
    }).catch(() => {
        if (currentToken !== templateLoadToken) return;
        alert('模板图片加载失败，请检查素材路径');
    });
}

function addStickerToCanvas(url, name = '') {
    if (!requireEditorLogin('添加贴纸')) return;
    const assetSources = getCanvasAssetSources(url);
    loadImageElementWithFallback(assetSources.displaySrc, assetSources.originalSrc)
        .then((image) => {
            const img = new fabric.Image(image, {
                left: CANVAS_WIDTH / 2,
                top: CANVAS_HEIGHT / 2,
                originX: 'center',
                originY: 'center',
                borderColor: '#82d3ff',
                selectable: true,
                evented: true,
                cornerColor: '#82d3ff',
                cornerSize: 12,
                originalSrc: assetSources.originalSrc,
                previewSrc: assetSources.previewSrc
            });
            img.scaleToWidth(160);
            canvas.add(img);
            img.bringToFront();
            canvas.setActiveObject(img);
            canvas.renderAll();
            applyEditorPermission();
            scheduleDraftSave();
        })
        .catch(() => {
            alert('贴纸素材加载失败，请检查素材路径');
        });
}

function exportCanvasSnapshot() {
    return new Promise((resolve, reject) => {
        const exportElement = document.createElement('canvas');
        exportElement.width = CANVAS_WIDTH;
        exportElement.height = CANVAS_HEIGHT;

        const exportCanvas = new fabric.StaticCanvas(exportElement, {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            backgroundColor: canvas.backgroundColor || '#ffffff'
        });

        exportCanvas.loadFromJSON(buildExportCanvasJson(), () => {
            try {
                exportCanvas.renderAll();
                const dataUrl = exportCanvas.toDataURL({ format: 'png' });
                exportCanvas.dispose();
                resolve(dataUrl);
            } catch (error) {
                exportCanvas.dispose();
                reject(error);
            }
        });
    });
}

function dataUrlToBlob(dataUrl) {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/data:(.*?);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const binary = atob(parts[1]);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return new Blob([bytes], { type: mimeType });
}

function triggerImageDownload(dataUrl, filename = 'star-design.png') {
    const blob = dataUrlToBlob(dataUrl);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
    }, 1000);
}

async function performCanvasDownload() {
    const dataUrl = await exportCanvasSnapshot();
    triggerImageDownload(dataUrl);
    return dataUrl;
}

async function finalizeDownloadAfterExport(generatedImage) {
    try {
        const data = await apiRequest('/api/user/deduct-credit', {
            method: 'POST',
            body: JSON.stringify({ reason: 'download' })
        });
        currentUser.credits = Number(data.credits || 0);
        persistCurrentUser();
        updateAuthEntryUI();
        await saveGeneratedToLibrary(generatedImage);
        await appendUserHistory('下载并保存作品到生成图库');
        clearCanvasRecoveryState();
    } catch (error) {
        await syncCurrentUserState();
        alert(error.message || '作品已下载，但积分或图库保存失败，请稍后重试');
    } finally {
        downloadInProgress = false;
        updateDownloadButtonState(false);
    }
}

async function handleDownloadClick(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (downloadInProgress) return;
    if (!requireEditorLogin('下载作品')) return;
    if (getCurrentCredits() <= 0) {
        openRechargeModal(currentUser.email ? '当前积分为 0，充值后才能下载作品。' : '请先登录并充值积分后再下载作品。');
        return;
    }

    downloadInProgress = true;
    updateDownloadButtonState(true);

    try {
        saveCanvasRecoveryState();
        const generatedImage = await performCanvasDownload();
        window.setTimeout(() => {
            finalizeDownloadAfterExport(generatedImage);
        }, 0);
    } catch (error) {
        downloadInProgress = false;
        updateDownloadButtonState(false);
        clearCanvasRecoveryState();
        openRechargeModal(error.message || '积分不足，请先充值');
    }
}

function resetDesigner() {
    if (!requireEditorLogin('进行重置')) return;
    clearCanvasRecoveryState();
    clearDraftState();
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    templateImage = null;
    templateLocked = false;
    idolObj = null;
    pendingFile = null;
    document.getElementById('template-name').innerText = '未选择';
    document.getElementById('generate-btn').disabled = true;
    document.getElementById('upload-area').querySelector('p').innerText = '📸 点击上传爱豆照片';
    updateTemplateLockButton();
    canvas.renderAll();
}

function duplicateActiveObject() {
    if (!requireEditorLogin('复制图像')) return;
    const obj = canvas.getActiveObject();
    if (!obj) {
        alert('请先选中要复制的对象');
        return;
    }
    if (obj.type !== 'image' && !isTextObject(obj)) {
        alert('当前只支持复制图像或文字对象');
        return;
    }
    if (obj === templateImage) {
        alert('模板不支持复制');
        return;
    }

    obj.clone((cloned) => {
        if (!cloned) return;

        cloned.set({
            left: Number(obj.left || 0) + 24,
            top: Number(obj.top || 0) + 24,
            selectable: true,
            evented: true,
            originalSrc: obj.originalSrc || '',
            previewSrc: obj.previewSrc || ''
        });

        canvas.add(cloned);

        // 如果模板在最上层，复制件也保持在模板下方
        if (templateImage) {
            const templateIndex = canvas.getObjects().indexOf(templateImage);
            if (templateIndex > 0) {
                cloned.moveTo(templateIndex - 1);
            }
        }

        // 复制AI人物时，更新idolObj为最新复制件，便于后续裁剪
        if (obj === idolObj) {
            obj.objectRole = '';
            cloned.objectRole = 'idol';
            idolObj = cloned;
        }

        canvas.setActiveObject(cloned);
        canvas.renderAll();
        applyEditorPermission();
        syncTextToolState();
        scheduleDraftSave();
    });
}

function setupLayerControls() {
    const toggleTemplateLockBtn = document.getElementById('btn-toggle-template-lock');

    document.getElementById('btn-bring-front').onclick = () => {
        if (!requireEditorLogin('操作图层')) return;
        const obj = canvas.getActiveObject();
        if (!obj) return;
        obj.bringToFront();
        canvas.renderAll();
        scheduleDraftSave();
    };

    document.getElementById('btn-forward').onclick = () => {
        if (!requireEditorLogin('操作图层')) return;
        const obj = canvas.getActiveObject();
        if (!obj) return;
        obj.bringForward();
        canvas.renderAll();
        scheduleDraftSave();
    };

    document.getElementById('btn-backward').onclick = () => {
        if (!requireEditorLogin('操作图层')) return;
        const obj = canvas.getActiveObject();
        if (!obj) return;
        obj.sendBackwards();
        canvas.renderAll();
        scheduleDraftSave();
    };

    document.getElementById('btn-send-back').onclick = () => {
        if (!requireEditorLogin('操作图层')) return;
        const obj = canvas.getActiveObject();
        if (!obj) return;
        obj.sendToBack();
        canvas.renderAll();
        scheduleDraftSave();
    };

    document.getElementById('delete-btn').onclick = () => {
        if (!requireEditorLogin('删除对象')) return;
        const obj = canvas.getActiveObject();
        if (!obj || obj === templateImage) return;
        if (obj === idolObj) idolObj = null;
        canvas.remove(obj);
        canvas.discardActiveObject();
        canvas.renderAll();
        syncTextToolState();
        scheduleDraftSave();
    };

    const duplicateBtn = document.getElementById('duplicate-btn');
    if (duplicateBtn) {
        duplicateBtn.onclick = duplicateActiveObject;
    }

    if (toggleTemplateLockBtn) {
        toggleTemplateLockBtn.onclick = toggleTemplateLock;
    }

    updateTemplateLockButton();
}

function setupUpload() {
    const area = document.getElementById('upload-area');
    const input = document.getElementById('photo-upload');

    area.onclick = () => {
        if (!requireEditorLogin('上传照片')) return;
        input.click();
    };
    input.onchange = (event) => {
        if (!requireEditorLogin('上传照片')) {
            input.value = '';
            return;
        }
        const file = event.target.files[0];
        if (!file) return;
        pendingFile = file;
        area.querySelector('p').innerText = `✅ 已选：${file.name}`;
        document.getElementById('generate-btn').disabled = false;
    };
}

function renderUI() {
    const filteredTemplates = baseTemplates.filter((item) => {
        const categoryMatch = currentCategory === 'all' || item.category === currentCategory;
        const styleMatch = currentStyle === 'all' || item.style === currentStyle;
        return categoryMatch && styleMatch;
    });

    const shouldRenderTemplates = shouldRenderTemplateAssets();
    if (!visibleTemplateCount && shouldRenderTemplates) {
        visibleTemplateCount = getAssetBatchSize();
    }

    const templateGrid = document.getElementById('template-grid');
    templateGrid.innerHTML = '';
    if (shouldRenderTemplates) {
        filteredTemplates.slice(0, visibleTemplateCount).forEach((template) => {
            templateGrid.appendChild(createAssetCard(template.name, getPreviewAssetUrl(template.url), template.url, () => {
                loadTemplate(template.url, template.name);
            }));
        });
    }
    updateAssetLoadMoreButton(
        'template-load-more-btn',
        shouldRenderTemplates ? Math.min(visibleTemplateCount, filteredTemplates.length) : 0,
        shouldRenderTemplates ? filteredTemplates.length : 0,
        '加载更多模板'
    );
    updateAssetLoadStatus(
        'template-load-status',
        shouldRenderTemplates ? Math.min(visibleTemplateCount, filteredTemplates.length) : 0,
        shouldRenderTemplates ? filteredTemplates.length : 0,
        '模板'
    );

    const filteredStickers = stickerTemplates.filter((item) => {
        return currentStickerStyle === 'all' || item.style === currentStickerStyle;
    });

    const shouldRenderStickers = shouldRenderStickerAssets();
    if (!visibleStickerCount && shouldRenderStickers) {
        visibleStickerCount = getAssetBatchSize();
    }

    const stickerGrid = document.getElementById('sticker-grid');
    stickerGrid.innerHTML = '';
    if (shouldRenderStickers) {
        filteredStickers.slice(0, visibleStickerCount).forEach((sticker) => {
            stickerGrid.appendChild(createAssetCard(sticker.name, getPreviewAssetUrl(sticker.url), sticker.url, () => {
                openStickerCutoutModal(sticker.url, sticker.name);
            }));
        });
    }
    updateAssetLoadMoreButton('sticker-load-more-btn', shouldRenderStickers ? Math.min(visibleStickerCount, filteredStickers.length) : 0, shouldRenderStickers ? filteredStickers.length : 0, '加载更多贴纸');
    updateAssetLoadStatus(
        'sticker-load-status',
        shouldRenderStickers ? Math.min(visibleStickerCount, filteredStickers.length) : 0,
        shouldRenderStickers ? filteredStickers.length : 0,
        '贴纸'
    );

    scheduleAutoLoadMoreAssets();
}

function setupFilterEvents() {
    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', function() {
            currentCategory = this.getAttribute('data-category');
            visibleTemplateCount = getAssetBatchSize();
            document.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('active'));
            this.classList.add('active');
            renderUI();
        });
    });

    document.querySelectorAll('.style-btn').forEach((btn) => {
        btn.addEventListener('click', function() {
            currentStyle = this.getAttribute('data-style');
            visibleTemplateCount = getAssetBatchSize();
            document.querySelectorAll('.style-btn').forEach((item) => item.classList.remove('active'));
            this.classList.add('active');
            renderUI();
        });
    });

    document.querySelectorAll('.sticker-style-btn').forEach((btn) => {
        btn.addEventListener('click', function() {
            currentStickerStyle = this.getAttribute('data-sticker-style');
            visibleStickerCount = getAssetBatchSize();
            document.querySelectorAll('.sticker-style-btn').forEach((item) => item.classList.remove('active'));
            this.classList.add('active');
            renderUI();
        });
    });

    const templateLoadMoreBtn = document.getElementById('template-load-more-btn');
    if (templateLoadMoreBtn) {
        templateLoadMoreBtn.addEventListener('click', () => {
            visibleTemplateCount += getAssetBatchSize();
            renderUI();
        });
    }

    const stickerLoadMoreBtn = document.getElementById('sticker-load-more-btn');
    if (stickerLoadMoreBtn) {
        stickerLoadMoreBtn.addEventListener('click', () => {
            visibleStickerCount += getAssetBatchSize();
            renderUI();
        });
    }

    document.querySelectorAll('.asset-drawer').forEach((drawer) => {
        drawer.addEventListener('toggle', () => {
            if (drawer.classList.contains('template-drawer') && drawer.open && !visibleTemplateCount) {
                visibleTemplateCount = getAssetBatchSize();
            }
            if (drawer.classList.contains('sticker-drawer') && drawer.open && !visibleStickerCount) {
                visibleStickerCount = getAssetBatchSize();
            }
            renderUI();
        });
    });

    window.addEventListener('resize', () => {
        const minimumBatch = getAssetBatchSize();
        visibleTemplateCount = Math.max(visibleTemplateCount || 0, minimumBatch);
        if (visibleStickerCount) {
            visibleStickerCount = Math.max(visibleStickerCount, minimumBatch);
        }
        renderUI();
    });

}

function setupMobileWorkspace() {
    const tabButtons = Array.from(document.querySelectorAll('.mobile-tool-tab'));
    const panels = Array.from(document.querySelectorAll('.editor-tool-panel'));
    const templateDrawer = document.querySelector('.template-drawer');
    const stickerDrawer = document.querySelector('.sticker-drawer');
    const editorToolStack = document.querySelector('.editor-tool-stack');
    const backdrop = document.getElementById('mobile-sheet-backdrop');
    const confirmButtons = Array.from(document.querySelectorAll('.mobile-panel-confirm'));

    if (!tabButtons.length || !panels.length) return;

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    const openBackdrop = () => {
        if (!backdrop) return;
        backdrop.hidden = false;
        backdrop.classList.add('show');
    };

    const syncBackdropState = () => {
        if (!backdrop) return;
        const hasOpenSheet = document.body.classList.contains('mobile-tool-sheet-open') || document.body.classList.contains('mobile-template-open');
        backdrop.hidden = !hasOpenSheet;
        backdrop.classList.toggle('show', hasOpenSheet);
    };

    const closeToolSheet = () => {
        if (editorToolStack) {
            editorToolStack.classList.remove('is-open');
        }
        document.body.classList.remove('mobile-tool-sheet-open');
        tabButtons.forEach((button) => {
            button.classList.remove('is-active');
        });
        if (isMobile()) {
            panels.forEach((panel) => panel.classList.remove('is-active'));
        }
        syncBackdropState();
    };

    const closeTemplateSheet = () => {
        if (templateDrawer) {
            templateDrawer.classList.remove('is-mobile-open');
        }
        document.body.classList.remove('mobile-template-open');
        syncBackdropState();
    };

    const closeAssetDrawer = (drawer) => {
        if (!drawer) return;
        drawer.classList.remove('is-mobile-open');
        drawer.open = false;
    };

    const activatePanel = (target) => {
        tabButtons.forEach((button) => {
            button.classList.toggle('is-active', button.getAttribute('data-tool-target') === target);
        });

        panels.forEach((panel) => {
            panel.classList.toggle('is-active', panel.getAttribute('data-tool-panel') === target);
        });
    };

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tool-target');
            if (!target) return;

            if (target === 'template') {
                if (!isMobile()) {
                    if (templateDrawer) {
                        templateDrawer.open = true;
                    }
                    return;
                }

                closeToolSheet();
                if (templateDrawer) {
                    templateDrawer.open = true;
                    templateDrawer.classList.add('is-mobile-open');
                }
                document.body.classList.add('mobile-template-open');
                openBackdrop();
                return;
            }

            activatePanel(target);

            if (isMobile()) {
                closeTemplateSheet();
                if (editorToolStack) {
                    editorToolStack.classList.add('is-open');
                }
            }
        });
    });

    confirmButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const closeTarget = button.getAttribute('data-mobile-close');
            if (closeTarget === 'template') {
                closeAssetDrawer(templateDrawer);
                closeTemplateSheet();
                return;
            }
            if (closeTarget === 'sticker') {
                closeAssetDrawer(stickerDrawer);
                return;
            }
            closeToolSheet();
        });
    });

    if (backdrop) {
        backdrop.addEventListener('click', () => {
            closeToolSheet();
            closeTemplateSheet();
        });
    }

    window.addEventListener('resize', () => {
        if (isMobile()) return;
        closeToolSheet();
        closeTemplateSheet();
        if (templateDrawer) {
            templateDrawer.open = true;
        }
        panels.forEach((panel, index) => {
            panel.classList.toggle('is-active', index === 0);
        });
    });

    if (!isMobile()) {
        if (templateDrawer) {
            templateDrawer.open = true;
        }
        return;
    }

    closeToolSheet();
    closeTemplateSheet();
}

async function handleGenerate() {
    if (!requireEditorLogin('开始制作')) return;
    if (!pendingFile) {
        alert('请先上传照片');
        return;
    }

    const loading = document.getElementById('loading-status');
    const generateBtn = document.getElementById('generate-btn');
    loading.style.display = 'block';
    generateBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append('image_file', pendingFile);
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: { 'X-Api-Key': REMOVE_BG_API_KEY },
            body: formData
        });
        if (!response.ok) throw new Error('抠图失败');
        const blob = await response.blob();
        const imageData = await blobToDataUrl(blob);
        await addIdolToCanvas(imageData);
        try {
            await saveCutoutToLibrary(imageData, pendingFile?.name || '人物抠图');
        } catch (libraryError) {
            alert(libraryError.message || '抠图已完成，但保存到本地人物库失败');
        }
    } catch (error) {
        alert(error.message || '抠图失败');
    } finally {
        loading.style.display = 'none';
        generateBtn.disabled = false;
    }
}

function initCanvas() {
    if (canvas) return;
    canvas = new fabric.Canvas('main-canvas', {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
        allowTouchScrolling: false
    });
    canvas.renderAll();
    setupCropGestureLayerEvents();
    canvas.on('object:moving', (event) => {
        if (!event || !event.target) return;
        if (cropMode) return;
        if (event.target === templateImage && templateLocked) return;
        constrainObjectWithinCanvas(event.target);
    });
    canvas.on('object:modified', () => {
        scheduleDraftSave();
    });
    canvas.on('object:added', (event) => {
        if (event?.target?.isCropPreview) return;
        scheduleDraftSave();
    });
    canvas.on('object:removed', (event) => {
        if (event?.target?.isCropPreview) return;
        scheduleDraftSave();
    });
    canvas.on('selection:created', syncTextToolState);
    canvas.on('selection:updated', syncTextToolState);
    canvas.on('selection:cleared', syncTextToolState);
    canvas.on('text:changed', () => {
        syncTextToolState();
        scheduleDraftSave();
    });

    applyEditorPermission();
    scheduleResponsiveCanvasSync();
    window.addEventListener('resize', scheduleResponsiveCanvasSync);
}

function toggleCropMode() {
    if (!requireEditorLogin('裁剪人物')) return;

    if (!cropMode) {
        const selectedObj = canvas.getActiveObject();
        if (!selectedObj) {
            alert('请先选中要裁剪的人物图像');
            return;
        }
        if (selectedObj.type !== 'image') {
            alert('只能裁剪图像对象');
            return;
        }
        if (!idolObj || selectedObj !== idolObj) {
            alert('当前仅支持裁剪 AI 抠图后的人物对象，请先选中人物');
            return;
        }

        cropMode = true;
        pendingCropRect = null;
        cropObjectId = selectedObj.id || Date.now();
        selectedObj.id = cropObjectId;

        originalCanvasObjects = canvas.getObjects().map((obj) => ({
            id: obj.id,
            selectable: obj.selectable,
            evented: obj.evented
        }));

        canvas.selection = false;
        canvas.forEachObject((obj) => {
            obj.selectable = false;
            obj.evented = false;
        });

        canvas.discardActiveObject();
        canvas.renderAll();
        updateCropModeUI();
        return;
    }

    if (!pendingCropRect) {
        alert('请先拖拽选择要保留的区域，再点击“确定裁剪”');
        return;
    }

    performCrop(pendingCropRect.left, pendingCropRect.top, pendingCropRect.width, pendingCropRect.height);
}

function getCropPointerFromEvent(event) {
    if (!canvas || !event) return null;
    const wrapper = document.querySelector('.canvas-container-wrapper');
    const canvasEl = canvas.upperCanvasEl || canvas.lowerCanvasEl;
    if (!wrapper || !canvasEl) return null;

    const clientX = event.clientX ?? event.touches?.[0]?.clientX;
    const clientY = event.clientY ?? event.touches?.[0]?.clientY;
    if (typeof clientX !== 'number' || typeof clientY !== 'number') return null;

    const canvasRect = canvasEl.getBoundingClientRect();
    if (
        clientX < canvasRect.left ||
        clientX > canvasRect.right ||
        clientY < canvasRect.top ||
        clientY > canvasRect.bottom
    ) {
        return null;
    }

    const x = ((clientX - canvasRect.left) / canvasRect.width) * canvas.getWidth();
    const y = ((clientY - canvasRect.top) / canvasRect.height) * canvas.getHeight();
    return { x, y };
}

function renderCropGestureBox() {
    const box = document.getElementById('crop-gesture-box');
    const wrapper = document.querySelector('.canvas-container-wrapper');
    const canvasEl = canvas?.upperCanvasEl || canvas?.lowerCanvasEl;
    if (!box || !wrapper || !canvasEl) return;

    const width = Math.abs(cropEndX - cropStartX);
    const height = Math.abs(cropEndY - cropStartY);
    if (!cropDragging || width <= 6 || height <= 6) {
        box.hidden = true;
        return;
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const canvasRect = canvasEl.getBoundingClientRect();
    const scaleX = canvasRect.width / canvas.getWidth();
    const scaleY = canvasRect.height / canvas.getHeight();

    const left = Math.min(cropStartX, cropEndX) * scaleX + (canvasRect.left - wrapperRect.left);
    const top = Math.min(cropStartY, cropEndY) * scaleY + (canvasRect.top - wrapperRect.top);

    box.hidden = false;
    box.style.left = `${left}px`;
    box.style.top = `${top}px`;
    box.style.width = `${width * scaleX}px`;
    box.style.height = `${height * scaleY}px`;
}

function clearCropPreviewRect() {
    const box = document.getElementById('crop-gesture-box');
    if (box) {
        box.hidden = true;
        box.style.width = '0px';
        box.style.height = '0px';
    }
    if (!canvas) return;
    const previewRect = canvas.getObjects().find((obj) => obj.isCropPreview);
    if (previewRect) {
        canvas.remove(previewRect);
    }
}

function beginCropDrag(pointer) {
    if (!cropMode || !pointer) return;
    cropStartX = pointer.x;
    cropStartY = pointer.y;
    cropEndX = pointer.x;
    cropEndY = pointer.y;
    cropDragging = true;
    pendingCropRect = null;
    clearCropPreviewRect();
}

function updateCropDrag(pointer) {
    if (!cropMode || !cropDragging || !pointer) return;

    cropEndX = pointer.x;
    cropEndY = pointer.y;
    renderCropGestureBox();
}

function finishCropDrag(pointer = null) {
    if (!cropMode) return;
    if (pointer) {
        cropEndX = pointer.x;
        cropEndY = pointer.y;
    }

    const width = Math.abs(cropEndX - cropStartX);
    const height = Math.abs(cropEndY - cropStartY);
    if (cropDragging && width > 6 && height > 6) {
        pendingCropRect = {
            left: Math.min(cropStartX, cropEndX),
            top: Math.min(cropStartY, cropEndY),
            width,
            height
        };
    }

    cropStartX = 0;
    cropStartY = 0;
    cropEndX = 0;
    cropEndY = 0;
    cropDragging = false;
    clearCropPreviewRect();
}

function setupCropGestureLayerEvents() {
    const layer = document.getElementById('crop-gesture-layer');
    if (!layer || layer.dataset.cropGestureReady === 'true') return;

    layer.dataset.cropGestureReady = 'true';

    layer.addEventListener('pointerdown', (event) => {
        if (!cropMode) return;
        const pointer = getCropPointerFromEvent(event);
        if (!pointer) return;
        event.preventDefault();
        layer.setPointerCapture?.(event.pointerId);
        beginCropDrag(pointer);
    }, { passive: false });

    layer.addEventListener('pointermove', (event) => {
        if (!cropMode || !cropDragging) return;
        const pointer = getCropPointerFromEvent(event);
        if (!pointer) return;
        event.preventDefault();
        updateCropDrag(pointer);
    }, { passive: false });

    const finishPointer = (event) => {
        if (!cropMode) return;
        const pointer = getCropPointerFromEvent(event);
        event.preventDefault();
        finishCropDrag(pointer || null);
        layer.releasePointerCapture?.(event.pointerId);
    };

    layer.addEventListener('pointerup', finishPointer, { passive: false });
    layer.addEventListener('pointercancel', finishPointer, { passive: false });
}

function exitCropMode() {
    cropMode = false;
    cropObjectId = null;
    pendingCropRect = null;
    cropDragging = false;
    cropStartX = 0;
    cropStartY = 0;
    cropEndX = 0;
    cropEndY = 0;

    clearCropPreviewRect();

    canvas.selection = true;
    canvas.forEachObject((obj) => {
        const prev = originalCanvasObjects.find((item) => item.id === obj.id);
        if (prev) {
            obj.selectable = prev.selectable;
            obj.evented = prev.evented;
        } else {
            obj.selectable = true;
            obj.evented = true;
        }
    });

    originalCanvasObjects = [];
    updateCropModeUI();
    canvas.renderAll();
}

function performCrop(cropX, cropY, cropWidth, cropHeight) {
    const objects = canvas.getObjects();
    const cropObj = objects.find(obj => obj.id === cropObjectId);
    
    if (!cropObj || cropObj.type !== 'image') {
        alert('找不到要裁剪的图像');
        return;
    }
    
    // 当前版本先限制未旋转对象，避免旋转矩阵导致裁剪偏移
    if (Math.abs(Number(cropObj.angle || 0)) > 0.01) {
        alert('当前对象有旋转，请先将角度调回 0° 再裁剪');
        return;
    }

    const leftTop = cropObj.getPointByOrigin('left', 'top');
    const scaleX = Number(cropObj.scaleX || 1);
    const scaleY = Number(cropObj.scaleY || 1);
    const displayedW = Number(cropObj.width || 0) * scaleX;
    const displayedH = Number(cropObj.height || 0) * scaleY;

    const intersectLeft = Math.max(cropX, leftTop.x);
    const intersectTop = Math.max(cropY, leftTop.y);
    const intersectRight = Math.min(cropX + cropWidth, leftTop.x + displayedW);
    const intersectBottom = Math.min(cropY + cropHeight, leftTop.y + displayedH);

    if (intersectRight <= intersectLeft || intersectBottom <= intersectTop) {
        alert('裁剪框与人物没有重叠，请重新框选');
        return;
    }

    const sx = Math.floor((intersectLeft - leftTop.x) / scaleX);
    const sy = Math.floor((intersectTop - leftTop.y) / scaleY);
    const sw = Math.floor((intersectRight - intersectLeft) / scaleX);
    const sh = Math.floor((intersectBottom - intersectTop) / scaleY);

    if (sw <= 1 || sh <= 1) {
        alert('裁剪区域过小，请重新框选');
        return;
    }

    const sourceEl = cropObj.getElement();
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sw;
    tempCanvas.height = sh;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) {
        alert('裁剪失败：无法创建临时画布');
        return;
    }
    ctx.drawImage(sourceEl, sx, sy, sw, sh, 0, 0, sw, sh);

    const croppedDataUrl = tempCanvas.toDataURL('image/png');

    fabric.Image.fromURL(croppedDataUrl, (newImg) => {
        if (!newImg) {
            alert('裁剪失败：无法生成新图像');
            return;
        }

        const prevIndex = canvas.getObjects().indexOf(cropObj);
        canvas.remove(cropObj);

        newImg.set({
            left: intersectLeft,
            top: intersectTop,
            scaleX: scaleX,
            scaleY: scaleY,
            angle: Number(cropObj.angle || 0),
            selectable: true,
            evented: true,
            cornerColor: '#ff69b4',
            borderColor: '#ff69b4',
            transparentCorners: false,
            id: cropObjectId,
            objectRole: 'idol'
        });

        canvas.insertAt(newImg, Math.max(prevIndex, 0));
        idolObj = newImg;
        canvas.setActiveObject(newImg);
        exitCropMode();
        scheduleDraftSave();
        alert('裁剪完成');
    }, { crossOrigin: 'anonymous' });
}

async function init() {
    initCanvas();
    initAuthEntry();
    setupMobileNavMenu();
    await syncCurrentUserState();
    renderUI();
    setupFilterEvents();
    setupMobileWorkspace();
    setupUpload();
    setupCutoutLibraryEvents();
    setupStickerCutoutTools();
    setupTextControls();
    setupLayerControls();
    const recoveredFromDownload = await restoreCanvasRecoveryState();
    if (!recoveredFromDownload) {
        await restoreDraftState();
    }
    await renderCutoutLibrary();
    document.getElementById('generate-btn').onclick = handleGenerate;
    document.getElementById('download-btn').onclick = handleDownloadClick;
    document.getElementById('reset-btn').onclick = resetDesigner;
    document.getElementById('btn-crop-mode').onclick = toggleCropMode;
    const cropApplyBtn = document.getElementById('crop-apply-btn');
    const cropCancelBtn = document.getElementById('crop-cancel-btn');
    if (cropApplyBtn) {
        cropApplyBtn.onclick = () => {
            if (!cropMode) return;
            if (!pendingCropRect) {
                alert('请先在人物上框选要保留的区域');
                return;
            }
            performCrop(pendingCropRect.left, pendingCropRect.top, pendingCropRect.width, pendingCropRect.height);
        };
    }
    if (cropCancelBtn) {
        cropCancelBtn.onclick = exitCropMode;
    }
    updateCropModeUI();
    syncTextToolState();
    scheduleResponsiveCanvasSync();
}

syncWindowCurrentUser();

document.addEventListener('DOMContentLoaded', () => {
    init();
});