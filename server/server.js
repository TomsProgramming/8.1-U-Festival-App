const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const db = require('./db');
const { sendTo, publicKey } = require('./push');

const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(cors({ origin: (process.env.CORS_ORIGIN || '*').split(','), credentials: false }));

// -------------------------------------------------------------------------
// Health
// -------------------------------------------------------------------------
app.get('/api/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// -------------------------------------------------------------------------
// Stages — `id` in JSON is de slug (stabiel & url-vriendelijk), `numId` is
// de echte numerieke PK uit de DB.
// -------------------------------------------------------------------------
app.get('/api/stages', async (_req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT id AS numId, slug AS id, name, short, img, color,
              desc_nl AS descNL, desc_en AS descEN, capacity
       FROM stages ORDER BY sort`
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Acts — join op genres voor genre-naam + tag-lijst (many-to-many).
// -------------------------------------------------------------------------
app.get('/api/acts', async (_req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id AS numId, a.slug AS id, a.name, a.tag, a.img,
              a.bio_nl AS bioNL, a.bio_en AS bioEN,
              a.ai_blurb_nl AS aiBlurbNL, a.ai_blurb_en AS aiBlurbEN,
              a.youtube_url AS youtubeUrl,
              COALESCE(g.name, '') AS genre,
              (SELECT GROUP_CONCAT(g2.name ORDER BY g2.name SEPARATOR ',')
                 FROM act_genres ag
                 JOIN genres g2 ON g2.id = ag.genre_id
                WHERE ag.act_id = a.id) AS genresCsv
       FROM acts a
       LEFT JOIN genres g ON g.id = a.primary_genre_id
       ORDER BY a.name`
    );
    const out = rows.map((r) => ({
      ...r,
      genres: r.genresCsv ? r.genresCsv.split(',') : [],
      genresCsv: undefined,
    }));
    res.json(out);
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Schedule — join via INT-FKs, retourneert slug-gebaseerde stageId/actId.
// -------------------------------------------------------------------------
app.get('/api/schedule', async (_req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT s.day, st.slug AS stageId, a.slug AS actId,
              s.start_h AS start, s.end_h AS end
       FROM schedule s
       JOIN stages st ON st.id = s.stage_id
       JOIN acts   a  ON a.id  = s.act_id
       ORDER BY s.day, s.start_h`
    );
    const grouped = { saturday: [], sunday: [] };
    for (const r of rows) {
      grouped[r.day].push({
        stageId: r.stageId,
        actId: r.actId,
        start: Number(r.start),
        end: Number(r.end),
      });
    }
    res.json(grouped);
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Map pins — stage_id (FK) → slug
// -------------------------------------------------------------------------
app.get('/api/map-pins', async (_req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT p.slug AS id, p.kind, p.num, p.x, p.y, p.label, st.slug AS stageId
       FROM map_pins p
       LEFT JOIN stages st ON st.id = p.stage_id
       ORDER BY p.kind, p.slug`
    );
    res.json(rows.map((r) => ({ ...r, num: r.num ?? undefined, stageId: r.stageId ?? undefined })));
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Genres (los endpoint — handig voor toekomstige filter-UI)
// -------------------------------------------------------------------------
app.get('/api/genres', async (_req, res, next) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM genres ORDER BY name');
    res.json(rows);
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// FAQ / reach / info
// -------------------------------------------------------------------------
app.get('/api/faqs', async (req, res, next) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'nl';
    const [rows] = await db.query(
      'SELECT question AS q, answer AS a FROM faqs WHERE lang = ? ORDER BY sort',
      [lang]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

app.get('/api/reach', async (req, res, next) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'nl';
    const [rows] = await db.query(
      'SELECT icon, title, descr AS `desc` FROM reach_items WHERE lang = ? ORDER BY sort',
      [lang]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

app.get('/api/info', async (req, res, next) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'nl';
    const [rows] = await db.query(
      'SELECT fkey AS k, value AS v FROM info_facts WHERE lang = ?',
      [lang]
    );
    const out = {};
    for (const r of rows) out[r.k] = r.v;
    res.json(out);
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Devices
// -------------------------------------------------------------------------
app.post('/api/devices', async (req, res, next) => {
  try {
    const id = (req.body && req.body.id) || crypto.randomUUID();
    const lang = req.body?.lang === 'en' ? 'en' : 'nl';
    const theme = req.body?.theme === 'light' ? 'light' : 'dark';
    await db.query(
      `INSERT INTO devices (id, lang, theme)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE lang = VALUES(lang), theme = VALUES(theme), last_seen_at = CURRENT_TIMESTAMP`,
      [id, lang, theme]
    );
    res.json({ id, lang, theme });
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Favorites — client gebruikt slug, server resolvet naar INT-FK.
// -------------------------------------------------------------------------
async function resolveActId(slug) {
  const [[row]] = await db.query('SELECT id FROM acts WHERE slug = ? LIMIT 1', [slug]);
  return row?.id ?? null;
}

app.get('/api/favorites/:deviceId', async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT a.slug AS actId
       FROM favorites f
       JOIN acts a ON a.id = f.act_id
       WHERE f.device_id = ?`,
      [req.params.deviceId]
    );
    res.json(rows.map((r) => r.actId));
  } catch (e) { next(e); }
});

app.post('/api/favorites/:deviceId/:actSlug', async (req, res, next) => {
  try {
    const actId = await resolveActId(req.params.actSlug);
    if (!actId) return res.status(404).json({ error: 'unknown act' });
    await db.query('INSERT IGNORE INTO devices (id) VALUES (?)', [req.params.deviceId]);
    await db.query(
      'INSERT IGNORE INTO favorites (device_id, act_id) VALUES (?, ?)',
      [req.params.deviceId, actId]
    );
    res.json({ ok: true });
  } catch (e) { next(e); }
});

app.delete('/api/favorites/:deviceId/:actSlug', async (req, res, next) => {
  try {
    const actId = await resolveActId(req.params.actSlug);
    if (!actId) return res.status(404).json({ error: 'unknown act' });
    await db.query(
      'DELETE FROM favorites WHERE device_id = ? AND act_id = ?',
      [req.params.deviceId, actId]
    );
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// Bulk-sync — voor het flushen van een offline-queue. Client stuurt de
// huidige set slugs; server vervangt.
app.put('/api/favorites/:deviceId', async (req, res, next) => {
  try {
    const slugs = Array.isArray(req.body?.slugs) ? req.body.slugs.filter((s) => typeof s === 'string') : null;
    if (!slugs) return res.status(400).json({ error: 'slugs[] vereist' });
    await db.query('INSERT IGNORE INTO devices (id) VALUES (?)', [req.params.deviceId]);
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query('DELETE FROM favorites WHERE device_id = ?', [req.params.deviceId]);
      if (slugs.length > 0) {
        const [acts] = await conn.query(
          `SELECT id, slug FROM acts WHERE slug IN (${slugs.map(() => '?').join(',')})`,
          slugs
        );
        if (acts.length > 0) {
          const values = acts.map((a) => [req.params.deviceId, a.id]);
          await conn.query('INSERT INTO favorites (device_id, act_id) VALUES ?', [values]);
        }
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
    res.json({ ok: true, count: slugs.length });
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Push notifications
// -------------------------------------------------------------------------
app.get('/api/push/vapid-public-key', (_req, res) => {
  if (!publicKey) return res.status(503).json({ error: 'push uitgeschakeld' });
  res.json({ key: publicKey });
});

app.post('/api/push/subscribe', async (req, res, next) => {
  try {
    const { deviceId, subscription } = req.body || {};
    if (!deviceId || !subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).json({ error: 'ongeldige subscription' });
    }
    await db.query('INSERT IGNORE INTO devices (id) VALUES (?)', [deviceId]);
    await db.query(
      `INSERT INTO push_subscriptions (device_id, endpoint, p256dh, auth_key)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE device_id = VALUES(device_id), p256dh = VALUES(p256dh), auth_key = VALUES(auth_key)`,
      [deviceId, subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth]
    );
    res.json({ ok: true });
  } catch (e) { next(e); }
});

app.post('/api/push/unsubscribe', async (req, res, next) => {
  try {
    const { endpoint } = req.body || {};
    if (!endpoint) return res.status(400).json({ error: 'endpoint vereist' });
    await db.query('DELETE FROM push_subscriptions WHERE endpoint = ?', [endpoint]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

app.post('/api/push/test', async (req, res, next) => {
  try {
    const { deviceId, title, body, url } = req.body || {};
    if (!deviceId) return res.status(400).json({ error: 'deviceId vereist' });
    const [subs] = await db.query(
      'SELECT endpoint, p256dh, auth_key FROM push_subscriptions WHERE device_id = ?',
      [deviceId]
    );
    if (subs.length === 0) return res.status(404).json({ error: 'geen subscription' });

    const payload = {
      title: title || '❤U Festival',
      body:  body  || 'Test-melding vanuit de server.',
      url:   url   || '/',
    };
    const results = [];
    for (const s of subs) {
      const sub = { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth_key } };
      try {
        await sendTo(sub, payload);
        results.push({ endpoint: s.endpoint, ok: true });
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await db.query('DELETE FROM push_subscriptions WHERE endpoint = ?', [s.endpoint]);
        }
        results.push({ endpoint: s.endpoint, ok: false, status: err.statusCode });
      }
    }
    res.json({ sent: results.filter((r) => r.ok).length, results });
  } catch (e) { next(e); }
});

app.post('/api/push/broadcast-act', async (req, res, next) => {
  try {
    const { actId: actSlug, title, body, url } = req.body || {};
    if (!actSlug) return res.status(400).json({ error: 'actId (slug) vereist' });
    const actId = await resolveActId(actSlug);
    if (!actId) return res.status(404).json({ error: 'unknown act' });

    const [subs] = await db.query(
      `SELECT ps.endpoint, ps.p256dh, ps.auth_key
       FROM push_subscriptions ps
       JOIN favorites f ON f.device_id = ps.device_id
       WHERE f.act_id = ?`,
      [actId]
    );
    const payload = { title: title || '❤U Festival', body: body || 'Je act begint zo!', url: url || '/lineup' };
    let ok = 0;
    for (const s of subs) {
      try {
        await sendTo({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth_key } }, payload);
        ok++;
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await db.query('DELETE FROM push_subscriptions WHERE endpoint = ?', [s.endpoint]);
        }
      }
    }
    await db.query(
      'INSERT INTO notifications (title, body, url, act_id, sent_at) VALUES (?, ?, ?, ?, NOW())',
      [payload.title, payload.body, payload.url, actId]
    );
    res.json({ sent: ok, total: subs.length });
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Error handler
// -------------------------------------------------------------------------
app.use((err, _req, res, _next) => {
  console.error('[api] error:', err);
  res.status(500).json({ error: err.message || 'server error' });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log(`[api] http://localhost:${PORT}`));
