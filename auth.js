const API_BASE = window.location.origin;

let authToken = localStorage.getItem('fanMerchToken') || '';
let currentUser = localStorage.getItem('fanMerchEmail') || '';
let currentUserData = null;

function persistCredits(credits) {
    localStorage.setItem('fanMerchCredits', String(Number(credits || 0)));
}

function normalizeUserData(data) {
    const nextData = data || {};
    if (!Array.isArray(nextData.history)) nextData.history = [];
    if (!Array.isArray(nextData.generated)) nextData.generated = [];
    if (!nextData.favorites || Array.isArray(nextData.favorites)) {
        nextData.favorites = { templates: [], stickers: [] };
    }
    if (!Array.isArray(nextData.favorites.templates)) nextData.favorites.templates = [];
    if (!Array.isArray(nextData.favorites.stickers)) nextData.favorites.stickers = [];
    nextData.credits = Number(nextData.credits || 0);
    nextData.email = nextData.email || currentUser || '';
    return nextData;
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function apiRequest(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        if (response.status === 404 && path.includes('/api/user/check')) {
            throw new Error('签到接口不存在（404），请确认后端已更新并重启');
        }
        throw new Error(data.error || `请求失败（${response.status}）`);
    }
    return data;
}

function setAuthMessage(message) {
    const el = document.getElementById('auth-msg');
    if (el) el.innerText = message;
}

function getAuthReturnTo() {
    try {
        return sessionStorage.getItem('fanMerchAuthReturnTo') || 'index.html';
    } catch (error) {
        return 'index.html';
    }
}

function consumeAuthMessage() {
    try {
        const message = sessionStorage.getItem('fanMerchAuthMessage') || '';
        if (message) {
            sessionStorage.removeItem('fanMerchAuthMessage');
        }
        return message;
    } catch (error) {
        return '';
    }
}

function goBackToEditor() {
    window.location.href = getAuthReturnTo();
}

async function loadUserData() {
    if (!authToken || !currentUser) {
        currentUserData = null;
        return;
    }
    currentUserData = normalizeUserData(await apiRequest('/api/user/data'));
    persistCredits(currentUserData.credits || 0);
}

function renderAccountInfo() {
    const status = document.getElementById('account-status');
    const info = document.getElementById('account-info');
    const logoutBtn = document.getElementById('logout-btn');
    const historyList = document.getElementById('history-list');
    const galleryGrid = document.getElementById('gallery-grid-user');

    if (!currentUser || !authToken) {
        status.innerText = '未登录';
        info.innerText = '登录后可同步浏览记录和作品图库。';
        logoutBtn.style.display = 'none';
        historyList.innerText = '请先登录查看';
        galleryGrid.innerHTML = '<div class="small-list">请先登录查看</div>';
        return;
    }

    const userData = currentUserData || normalizeUserData({});
    status.innerText = `已登录：${currentUser}`;
    info.innerText = `当前积分：${userData.credits} 分\n浏览记录：${userData.history.length} 条\n已生成作品：${userData.generated.length} 个`;
    logoutBtn.style.display = 'inline-block';

    historyList.innerHTML = userData.history.length
        ? userData.history.slice(-8).reverse().map((item) => `<div class="history-item">${item}</div>`).join('')
        : '暂无浏览记录';

    galleryGrid.innerHTML = userData.generated.length
        ? userData.generated.slice(-8).reverse().map((item) => {
            const imageUrl = typeof item === 'string' ? item : item.image;
            const imageId = typeof item === 'string' ? '' : item.id;
            const createdAt = typeof item === 'string' ? '' : (item.at || '');
            return `
                <div class="gallery-item" data-image-id="${escapeHtml(imageId)}" data-image-url="${escapeHtml(imageUrl)}" data-created-at="${escapeHtml(createdAt)}">
                    <button type="button" class="gallery-preview-btn">查看</button>
                    <img src="${imageUrl}" alt="作品">
                    <div class="gallery-item-actions">
                        <button type="button" class="gallery-action-btn" data-action="download">重新下载</button>
                        <button type="button" class="gallery-action-btn danger" data-action="delete">删除作品</button>
                    </div>
                </div>
            `;
        }).join('')
        : '<div class="small-list">暂无作品</div>';
}

function openGalleryPreview(imageUrl, createdAt) {
    const modal = document.getElementById('gallery-preview-modal');
    const image = document.getElementById('gallery-preview-image');
    const time = document.getElementById('gallery-preview-time');
    if (!modal || !image || !time) return;
    image.src = imageUrl || '';
    time.innerText = createdAt ? `生成时间：${createdAt}` : '作品预览';
    modal.classList.add('show');
}

function closeGalleryPreview() {
    const modal = document.getElementById('gallery-preview-modal');
    const image = document.getElementById('gallery-preview-image');
    if (image) image.src = '';
    modal?.classList.remove('show');
}

function downloadGalleryImage(imageUrl) {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `fan-merch-${Date.now()}.png`;
    link.click();
}

async function deleteGalleryImage(imageId) {
    if (!imageId) {
        alert('作品信息不完整，无法删除');
        return;
    }
    if (!confirm('确认删除这张作品吗？删除后不可恢复。')) {
        return;
    }

    try {
        await apiRequest('/api/user/generated/delete', {
            method: 'POST',
            body: JSON.stringify({ id: imageId })
        });
        await loadUserData();
        renderAccountInfo();
        closeGalleryPreview();
        setAuthMessage('作品已删除');
    } catch (error) {
        setAuthMessage(error.message || '删除作品失败');
    }
}

function setupGalleryEvents() {
    const galleryGrid = document.getElementById('gallery-grid-user');
    const previewModal = document.getElementById('gallery-preview-modal');
    const previewClose = document.getElementById('gallery-preview-close');

    if (galleryGrid) {
        galleryGrid.onclick = async (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;

            const item = target.closest('.gallery-item');
            if (!item) return;

            const imageUrl = item.getAttribute('data-image-url') || '';
            const imageId = item.getAttribute('data-image-id') || '';
            const createdAt = item.getAttribute('data-created-at') || '';

            if (target.classList.contains('gallery-preview-btn') || target.tagName === 'IMG') {
                openGalleryPreview(imageUrl, createdAt);
                return;
            }

            if (target.classList.contains('gallery-action-btn')) {
                const action = target.getAttribute('data-action');
                if (action === 'download') {
                    downloadGalleryImage(imageUrl);
                    return;
                }
                if (action === 'delete') {
                    await deleteGalleryImage(imageId);
                }
            }
        };
    }

    if (previewClose) {
        previewClose.onclick = closeGalleryPreview;
    }

    if (previewModal) {
        previewModal.addEventListener('click', (event) => {
            if (event.target === previewModal) {
                closeGalleryPreview();
            }
        });
    }
}

function initAuthPage() {
    const backHomeBtn = document.getElementById('back-home-btn');
    const backHomeInlineBtn = document.getElementById('back-home-inline-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const checkInBtn = document.getElementById('check-in-btn');
    const email = document.getElementById('auth-email');
    const password = document.getElementById('auth-password');
    const pendingMessage = consumeAuthMessage();

    setupGalleryEvents();

    if (pendingMessage) {
        setAuthMessage(pendingMessage);
    }

    if (backHomeBtn) {
        backHomeBtn.onclick = goBackToEditor;
    }

    if (backHomeInlineBtn) {
        backHomeInlineBtn.onclick = goBackToEditor;
    }

    registerBtn.onclick = async () => {
        const nextEmail = email.value.trim();
        const nextPassword = password.value.trim();
        if (!nextEmail || !nextPassword) {
            setAuthMessage('邮箱和密码不能为空');
            return;
        }
        try {
            await apiRequest('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email: nextEmail, password: nextPassword })
            });
            setAuthMessage('注册成功，请继续登录');
        } catch (error) {
            setAuthMessage(error.message || '注册失败');
        }
    };

    loginBtn.onclick = async () => {
        const nextEmail = email.value.trim();
        const nextPassword = password.value.trim();
        if (!nextEmail || !nextPassword) {
            setAuthMessage('邮箱和密码不能为空');
            return;
        }
        try {
            const data = await apiRequest('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email: nextEmail, password: nextPassword })
            });
            authToken = data.token;
            currentUser = data.email;
            localStorage.setItem('fanMerchToken', authToken);
            localStorage.setItem('fanMerchEmail', currentUser);
            await loadUserData();
            persistCredits(currentUserData?.credits || 0);
            renderAccountInfo();
            updateCheckInStatus();
            setAuthMessage('登录成功，正在返回制图页...');
            window.setTimeout(goBackToEditor, 300);
        } catch (error) {
            setAuthMessage(error.message || '登录失败');
        }
    };

    logoutBtn.onclick = async () => {
        if (authToken) {
            try {
                await apiRequest('/api/auth/logout', { method: 'POST' });
            } catch (error) {
                // ignore network error on logout
            }
        }
        authToken = '';
        currentUser = '';
        currentUserData = null;
        localStorage.removeItem('fanMerchToken');
        localStorage.removeItem('fanMerchEmail');
        localStorage.removeItem('fanMerchCredits');
        renderAccountInfo();
        updateCheckInStatus();
        setAuthMessage('已登出');
    };

    checkInBtn.onclick = async () => {
        if (!authToken || !currentUser) {
            setAuthMessage('请先登录后签到');
            return;
        }
        checkInBtn.disabled = true;
        try {
            const data = await apiRequest('/api/user/check-in', { method: 'POST' });
            currentUserData = normalizeUserData(await apiRequest('/api/user/data'));
            persistCredits(currentUserData?.credits || 0);
            renderAccountInfo();
            updateCheckInStatus();
            alert(`签到成功！已获得 ${data.addedCredits} 积分，总积分：${data.credits}`);
        } catch (error) {
            setAuthMessage(error.message || '签到失败');
            alert(error.message || '签到失败');
        } finally {
            checkInBtn.disabled = false;
        }
    };

    if (authToken && currentUser) {
        loadUserData().then(() => {
            renderAccountInfo();
            updateCheckInStatus();
        }).catch(() => {
            renderAccountInfo();
            updateCheckInStatus();
        });
    } else {
        renderAccountInfo();
        updateCheckInStatus();
    }
}

async function updateCheckInStatus() {
    const checkInBtn = document.getElementById('check-in-btn');
    const checkInStatus = document.getElementById('check-in-status');
    if (!checkInBtn || !checkInStatus) return;

    if (!authToken || !currentUser) {
        checkInBtn.disabled = true;
        checkInBtn.innerText = '🔒 登录后签到';
        checkInStatus.innerText = '';
        return;
    }

    try {
        const data = await apiRequest('/api/user/check-in-status', { method: 'POST' });
        if (data.hasCheckedIn) {
            checkInBtn.disabled = true;
            checkInBtn.innerText = '✓ 今日已签到';
            checkInStatus.innerText = '明天再来签到获得 2 积分吧～';
        } else {
            checkInBtn.disabled = false;
            checkInBtn.innerText = '🎁 今日签到（+2 积分）';
            checkInStatus.innerText = '';
        }
    } catch (error) {
        checkInBtn.disabled = false;
        checkInBtn.innerText = '🎁 今日签到（+2 积分）';
        checkInStatus.innerText = error.message || '签到状态查询失败';
    }
}

document.addEventListener('DOMContentLoaded', initAuthPage);