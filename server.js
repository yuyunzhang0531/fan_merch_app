const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'fan-merch-admin';
const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || 'EtDYCyrywLMrc6MMc5YERjVV';
const REMOVE_BG_UPSTREAM_TIMEOUT_MS = 45000;
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const dbPath = path.join(DATA_DIR, 'fan_merch.db');
const db = new sqlite3.Database(dbPath);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 12 * 1024 * 1024
  },
  fileFilter(req, file, callback) {
    if (!file || !String(file.mimetype || '').startsWith('image/')) {
      callback(new Error('仅支持上传图片文件'));
      return;
    }
    callback(null, true);
  }
});

const sessions = new Map();

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createToken() {
  return crypto.randomBytes(24).toString('hex');
}

async function initDb() {
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  const userColumns = await all('PRAGMA table_info(users)');
  const hasCreditsColumn = userColumns.some((column) => column.name === 'credits');
  if (!hasCreditsColumn) {
    await run('ALTER TABLE users ADD COLUMN credits INTEGER NOT NULL DEFAULT 0');
  }

  await run(`CREATE TABLE IF NOT EXISTS histories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS generated_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    image_data TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, type, name),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  await run(`CREATE TABLE IF NOT EXISTS check_in (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    checked_in_date TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, checked_in_date),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_number TEXT NOT NULL UNIQUE,
    transaction_id TEXT,
    amount REAL NOT NULL,
    credits INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    verified_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
}

function authRequired(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: '未登录或登录已过期' });
  }
  req.userId = sessions.get(token);
  req.token = token;
  next();
}

function adminRequired(req, res, next) {
  const headerKey = String(req.headers['x-admin-key'] || '').trim();
  const queryKey = String(req.query.key || '').trim();
  const providedKey = headerKey || queryKey;
  if (!providedKey || providedKey !== ADMIN_KEY) {
    return res.status(401).json({ error: '管理员密钥无效' });
  }
  next();
}

async function readRemoveBgError(response) {
  try {
    const data = await response.json();
    return data?.errors?.[0]?.title || data?.errors?.[0]?.detail || data?.error || '';
  } catch (jsonError) {
    try {
      return await response.text();
    } catch (textError) {
      return '';
    }
  }
}

function maskApiKey(apiKey) {
  const normalized = String(apiKey || '').trim();
  if (!normalized) return 'empty';
  if (normalized.length <= 10) return `${normalized.slice(0, 2)}***${normalized.slice(-2)}`;
  return `${normalized.slice(0, 6)}***${normalized.slice(-4)}`;
}

function formatRemoveBgError(status, message) {
  const normalizedMessage = String(message || '').trim();
  if (status === 402) {
    return 'remove.bg preview 次数或 API credits 不足。你当前走的是 preview 模式，请检查这个 key 是否还有可用 preview/API 次数。';
  }
  if (status === 401 || status === 403) {
    return 'remove.bg API key 无效或没有调用权限，请检查后端环境变量 REMOVE_BG_API_KEY。';
  }
  if (status === 413) {
    return '上传图片过大，请换一张更小的图片后再试。';
  }
  return normalizedMessage || `抠图失败（${status}）`;
}

app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/admin/stats', adminRequired, async (req, res) => {
  try {
    const [
      usersCountRow,
      usersTodayRow,
      generatedCountRow,
      historyCountRow,
      downloadsCountRow,
      favoritesCountRow,
      checkInCountRow,
      creditsSumRow,
      recentUsers,
      recentHistory
    ] = await Promise.all([
      get('SELECT COUNT(*) AS count FROM users'),
      get("SELECT COUNT(*) AS count FROM users WHERE date(created_at) = date('now', 'localtime')"),
      get('SELECT COUNT(*) AS count FROM generated_images'),
      get('SELECT COUNT(*) AS count FROM histories'),
      get("SELECT COUNT(*) AS count FROM histories WHERE message LIKE '%下载%'"),
      get('SELECT COUNT(*) AS count FROM favorites'),
      get('SELECT COUNT(*) AS count FROM check_in'),
      get('SELECT COALESCE(SUM(credits), 0) AS total FROM users'),
      all('SELECT email, credits, created_at FROM users ORDER BY id DESC LIMIT 12'),
      all(
        `SELECT u.email AS email, h.message AS message, h.created_at AS created_at
         FROM histories h
         JOIN users u ON u.id = h.user_id
         ORDER BY h.id DESC
         LIMIT 20`
      )
    ]);

    res.json({
      ok: true,
      stats: {
        totalUsers: Number(usersCountRow?.count || 0),
        todayUsers: Number(usersTodayRow?.count || 0),
        totalGenerated: Number(generatedCountRow?.count || 0),
        totalUsageLogs: Number(historyCountRow?.count || 0),
        totalDownloads: Number(downloadsCountRow?.count || 0),
        totalFavorites: Number(favoritesCountRow?.count || 0),
        totalCheckIns: Number(checkInCountRow?.count || 0),
        totalCreditsBalance: Number(creditsSumRow?.total || 0),
        activeSessions: sessions.size
      },
      recentUsers: recentUsers.map((row) => ({
        email: row.email,
        credits: Number(row.credits || 0),
        createdAt: row.created_at
      })),
      recentUsage: recentHistory.map((row) => ({
        email: row.email,
        message: row.message,
        createdAt: row.created_at
      }))
    });
  } catch (error) {
    res.status(500).json({ error: '读取后台统计失败' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '').trim();
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少 6 位' });
    }

    const existed = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existed) {
      return res.status(409).json({ error: '邮箱已注册' });
    }

    await run('INSERT INTO users (email, password_hash, credits) VALUES (?, ?, ?)', [email, hashPassword(password), 10]);
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: '注册失败' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '').trim();
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    const user = await get('SELECT id, password_hash FROM users WHERE email = ?', [email]);
    if (!user || user.password_hash !== hashPassword(password)) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const token = createToken();
    sessions.set(token, user.id);

    return res.json({ ok: true, token, email });
  } catch (e) {
    return res.status(500).json({ error: '登录失败' });
  }
});

app.post('/api/auth/logout', authRequired, (req, res) => {
  sessions.delete(req.token);
  res.json({ ok: true });
});

app.get('/api/user/data', authRequired, async (req, res) => {
  try {
    const userRow = await get('SELECT email, credits FROM users WHERE id = ?', [req.userId]);
    const historyRows = await all(
      'SELECT message, created_at FROM histories WHERE user_id = ? ORDER BY id DESC LIMIT 30',
      [req.userId]
    );

    const generatedRows = await all(
      'SELECT image_data, created_at FROM generated_images WHERE user_id = ? ORDER BY id DESC LIMIT 30',
      [req.userId]
    );

    const favoriteRows = await all(
      'SELECT type, name, url FROM favorites WHERE user_id = ? ORDER BY id DESC',
      [req.userId]
    );

    const favorites = { templates: [], stickers: [] };
    favoriteRows.forEach((row) => {
      if (row.type === 'template') favorites.templates.push({ name: row.name, url: row.url || '' });
      if (row.type === 'sticker') favorites.stickers.push({ name: row.name, url: row.url || '' });
    });

    res.json({
      ok: true,
      email: userRow?.email || '',
      credits: Number(userRow?.credits || 0),
      history: historyRows.map((r) => r.message),
      generated: generatedRows.map((r) => ({ id: r.id, image: r.image_data, at: r.created_at })),
      favorites
    });
  } catch (e) {
    res.status(500).json({ error: '读取用户数据失败' });
  }
});

app.post('/api/user/history', authRequired, async (req, res) => {
  try {
    const message = String(req.body.message || '').trim();
    if (!message) return res.status(400).json({ error: 'message 不能为空' });

    await run('INSERT INTO histories (user_id, message) VALUES (?, ?)', [req.userId, message]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: '保存记录失败' });
  }
});

app.post('/api/user/generated', authRequired, async (req, res) => {
  try {
    const image = String(req.body.image || '').trim();
    if (!image) return res.status(400).json({ error: 'image 不能为空' });

    await run('INSERT INTO generated_images (user_id, image_data) VALUES (?, ?)', [req.userId, image]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: '保存作品失败' });
  }
});

app.post('/api/user/generated/delete', authRequired, async (req, res) => {
  try {
    const id = Number(req.body.id || 0);
    if (!id) {
      return res.status(400).json({ error: '作品 id 无效' });
    }

    const result = await run('DELETE FROM generated_images WHERE id = ? AND user_id = ?', [id, req.userId]);
    if (!result.changes) {
      return res.status(404).json({ error: '未找到该作品或无权限删除' });
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: '删除作品失败' });
  }
});

app.post('/api/user/favorite', authRequired, async (req, res) => {
  try {
    const type = String(req.body.type || '').trim();
    const name = String(req.body.name || '').trim();
    const url = String(req.body.url || '').trim();
    if (!['template', 'sticker'].includes(type) || !name) {
      return res.status(400).json({ error: '参数错误' });
    }

    await run(
      'INSERT OR IGNORE INTO favorites (user_id, type, name, url) VALUES (?, ?, ?, ?)',
      [req.userId, type, name, url]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: '保存收藏失败' });
  }
});

app.post('/api/user/deduct-credit', authRequired, async (req, res) => {
  try {
    const result = await run(
      'UPDATE users SET credits = credits - 1 WHERE id = ? AND credits > 0',
      [req.userId]
    );

    if (!result.changes) {
      return res.status(400).json({ error: '积分不足，请先充值' });
    }

    const userRow = await get('SELECT credits FROM users WHERE id = ?', [req.userId]);
    return res.json({ ok: true, credits: Number(userRow?.credits || 0) });
  } catch (e) {
    return res.status(500).json({ error: '扣减积分失败' });
  }
});

app.post('/api/user/recharge', authRequired, async (req, res) => {
  try {
    const amount = Number(req.body.amount || 0);
    if (amount <= 0) {
      return res.status(400).json({ error: '充值金额必须大于 0' });
    }
    const creditsToAdd = Math.floor(amount * 10);
    if (creditsToAdd <= 0) {
      return res.status(400).json({ error: '充值金额过小' });
    }

    await run('UPDATE users SET credits = credits + ? WHERE id = ?', [creditsToAdd, req.userId]);
    const userRow = await get('SELECT credits FROM users WHERE id = ?', [req.userId]);
    return res.json({ ok: true, credits: Number(userRow?.credits || 0), addedCredits: creditsToAdd });
  } catch (e) {
    return res.status(500).json({ error: '充值失败' });
  }
});

async function handleUserCheckIn(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existingCheckIn = await get('SELECT id FROM check_in WHERE user_id = ? AND checked_in_date = ?', [req.userId, today]);
    if (existingCheckIn) {
      return res.status(400).json({ error: '今天已签到过，明天再来' });
    }

    await run('INSERT INTO check_in (user_id, checked_in_date) VALUES (?, ?)', [req.userId, today]);
    await run('UPDATE users SET credits = credits + 2 WHERE id = ?', [req.userId]);
    const userRow = await get('SELECT credits FROM users WHERE id = ?', [req.userId]);
    return res.json({ ok: true, credits: Number(userRow?.credits || 0), addedCredits: 2 });
  } catch (e) {
    return res.status(500).json({ error: '签到失败' });
  }
}

async function handleUserCheckInStatus(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existingCheckIn = await get('SELECT id FROM check_in WHERE user_id = ? AND checked_in_date = ?', [req.userId, today]);
    return res.json({ ok: true, hasCheckedIn: !!existingCheckIn });
  } catch (e) {
    return res.status(500).json({ error: '查询签到状态失败' });
  }
}

app.post('/api/user/check-in', authRequired, handleUserCheckIn);
app.post('/api/user/checkin', authRequired, handleUserCheckIn);
app.post('/api/user/check-in-status', authRequired, handleUserCheckInStatus);
app.post('/api/user/checkin-status', authRequired, handleUserCheckInStatus);
app.get('/api/user/check-in-status', authRequired, handleUserCheckInStatus);
app.get('/api/user/checkin-status', authRequired, handleUserCheckInStatus);

app.post('/api/remove-bg', authRequired, (req, res) => {
  upload.single('image_file')(req, res, async (uploadError) => {
    if (uploadError) {
      const message = uploadError.code === 'LIMIT_FILE_SIZE'
        ? '上传图片不能超过 12MB'
        : (uploadError.message || '上传图片失败');
      res.status(400).json({ error: message });
      return;
    }

    if (!REMOVE_BG_API_KEY) {
      res.status(500).json({ error: '后端未配置 remove.bg API key' });
      return;
    }

    if (!req.file?.buffer) {
      res.status(400).json({ error: '请先上传一张图片' });
      return;
    }

    try {
      const formData = new FormData();
      const mimeType = String(req.file.mimetype || 'image/png');
      const fileName = String(req.file.originalname || 'upload.png');
      formData.append('image_file', new Blob([req.file.buffer], { type: mimeType }), fileName);
      formData.append('size', 'preview');

      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, REMOVE_BG_UPSTREAM_TIMEOUT_MS);

      let response;
      try {
        response = await fetch(REMOVE_BG_API_URL, {
          method: 'POST',
          headers: {
            'X-Api-Key': REMOVE_BG_API_KEY
          },
          body: formData,
          signal: abortController.signal
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        const upstreamMessage = await readRemoveBgError(response);
        console.error('[remove-bg] upstream request failed', {
          status: response.status,
          key: maskApiKey(REMOVE_BG_API_KEY),
          mimeType,
          fileName,
          fileSize: req.file.size,
          message: upstreamMessage || '(empty)'
        });
        res.status(response.status).json({ error: formatRemoveBgError(response.status, upstreamMessage) });
        return;
      }

      const outputBuffer = Buffer.from(await response.arrayBuffer());
      res.setHeader('Content-Type', response.headers.get('content-type') || 'image/png');
      res.setHeader('Cache-Control', 'no-store');
      res.send(outputBuffer);
    } catch (error) {
      console.error('[remove-bg] proxy request crashed', {
        key: maskApiKey(REMOVE_BG_API_KEY),
        fileName: req.file?.originalname || '',
        fileSize: req.file?.size || 0,
        message: error.message || 'unknown error'
      });
      if (error?.name === 'AbortError') {
        res.status(504).json({ error: 'remove.bg 处理超时，请换一张更小的图片后再试。' });
        return;
      }
      res.status(500).json({ error: error.message || '抠图服务暂时不可用' });
    }
  });
});

app.use(express.static(__dirname, {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  setHeaders(res, filePath) {
    if (filePath.includes(`${path.sep}image${path.sep}previews${path.sep}`)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    }
  }
}));
app.use('/api', (req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
