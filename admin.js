const APP_CONFIG = window.FAN_MERCH_CONFIG || {};
const API_BASE = String(APP_CONFIG.apiBase || window.location.origin || '').replace(/\/+$/, '');

function setAdminMessage(message) {
    const el = document.getElementById('admin-msg');
    if (el) el.innerText = message || '';
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function loadAdminStats() {
    const key = String(document.getElementById('admin-key-input')?.value || '').trim();
    if (!key) {
        setAdminMessage('请输入管理员密钥');
        return;
    }

    setAdminMessage('正在加载统计...');

    const response = await fetch(`${API_BASE}/api/admin/stats`, {
        cache: 'no-store',
        headers: {
            'x-admin-key': key
        }
    });

    const contentType = String(response.headers.get('content-type') || '').toLowerCase();
    if (!contentType.includes('application/json')) {
        const rawText = await response.text().catch(() => '');
        const textHint = String(rawText || '').trim().slice(0, 80);
        throw new Error(`后台接口返回异常（HTTP ${response.status}，非 JSON）${textHint ? `：${textHint}` : ''}，请确认服务端已重启到最新版本`);
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('管理员密钥无效，请检查 ADMIN_KEY（默认值是 fan-merch-admin）');
        }
        throw new Error(data?.error || '后台统计加载失败');
    }

    if (!data || typeof data !== 'object' || !data.stats) {
        throw new Error('后台统计返回格式不正确，请确认服务端接口可用');
    }

    renderAdminStats(data);
    localStorage.setItem('fanMerchAdminKey', key);
    setAdminMessage('统计已更新');
}

function renderAdminStats(payload) {
    const stats = payload?.stats || {};
    const recentUsers = Array.isArray(payload?.recentUsers) ? payload.recentUsers : [];
    const recentUsage = Array.isArray(payload?.recentUsage) ? payload.recentUsage : [];

    const setValue = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.innerText = String(value ?? '-');
    };

    setValue('stat-total-users', Number(stats.totalUsers || 0));
    setValue('stat-today-users', Number(stats.todayUsers || 0));
    setValue('stat-total-usage', Number(stats.totalUsageLogs || 0));
    setValue('stat-total-downloads', Number(stats.totalDownloads || 0));
    setValue('stat-total-generated', Number(stats.totalGenerated || 0));
    setValue('stat-active-sessions', Number(stats.activeSessions || 0));

    const recentUsersEl = document.getElementById('admin-recent-users');
    if (recentUsersEl) {
        recentUsersEl.innerHTML = recentUsers.length
            ? recentUsers.map((user) => `
                <div class="history-item">
                    <strong>${escapeHtml(user.email)}</strong><br>
                    注册时间：${escapeHtml(user.createdAt)}<br>
                    积分：${Number(user.credits || 0)}
                </div>
            `).join('')
            : '暂无注册用户';
    }

    const recentUsageEl = document.getElementById('admin-recent-usage');
    if (recentUsageEl) {
        recentUsageEl.innerHTML = recentUsage.length
            ? recentUsage.map((item) => `
                <div class="history-item">
                    <strong>${escapeHtml(item.email)}</strong><br>
                    ${escapeHtml(item.message)}<br>
                    时间：${escapeHtml(item.createdAt)}
                </div>
            `).join('')
            : '暂无使用记录';
    }
}

function initAdminPage() {
    const loadBtn = document.getElementById('admin-load-btn');
    const backBtn = document.getElementById('admin-back-home');
    const keyInput = document.getElementById('admin-key-input');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    const savedKey = localStorage.getItem('fanMerchAdminKey') || '';
    if (keyInput && savedKey) {
        keyInput.value = savedKey;
    }

    if (loadBtn) {
        loadBtn.addEventListener('click', async () => {
            try {
                await loadAdminStats();
            } catch (error) {
                setAdminMessage(error.message || '后台统计加载失败');
            }
        });
    }

    if (keyInput) {
        keyInput.addEventListener('keydown', async (event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            try {
                await loadAdminStats();
            } catch (error) {
                setAdminMessage(error.message || '后台统计加载失败');
            }
        });
    }

    if (savedKey) {
        loadAdminStats().catch((error) => {
            setAdminMessage(error.message || '后台统计加载失败');
        });
    }
}

document.addEventListener('DOMContentLoaded', initAdminPage);