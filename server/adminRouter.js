const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { requireAdmin, SECRET } = require('./auth');
const { sendTo } = require('./push');

const router = express.Router();

// -------------------------------------------------------------------------
// Auth
// -------------------------------------------------------------------------
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password)
      return res.status(400).json({ error: 'Gebruikersnaam en wachtwoord verplicht' });

    const [rows] = await db.query('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (!rows.length) return res.status(401).json({ error: 'Ongeldige inloggegevens' });

    const ok = await bcrypt.compare(password, rows[0].pw_hash);
    if (!ok) return res.status(401).json({ error: 'Ongeldige inloggegevens' });

    const token = jwt.sign({ username }, SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (e) { next(e); }
});

// Alle routes hieronder vereisen admin-authenticatie
router.use(requireAdmin);

// -------------------------------------------------------------------------
// Stages
// -------------------------------------------------------------------------
router.get('/stages', async (_req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM stages ORDER BY sort');
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/stages', async (req, res, next) => {
  try {
    const { slug, name, short, img, color, desc_nl, desc_en, capacity, sort } = req.body;
    const [result] = await db.query(
      'INSERT INTO stages (slug, name, short, img, color, desc_nl, desc_en, capacity, sort) VALUES (?,?,?,?,?,?,?,?,?)',
      [slug, name, short, img, color, desc_nl, desc_en, capacity, sort ?? 0]
    );
    const [rows] = await db.query('SELECT * FROM stages WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.put('/stages/:id', async (req, res, next) => {
  try {
    const { slug, name, short, img, color, desc_nl, desc_en, capacity, sort } = req.body;
    await db.query(
      'UPDATE stages SET slug=?, name=?, short=?, img=?, color=?, desc_nl=?, desc_en=?, capacity=?, sort=? WHERE id=?',
      [slug, name, short, img, color, desc_nl, desc_en, capacity, sort ?? 0, req.params.id]
    );
    const [rows] = await db.query('SELECT * FROM stages WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/stages/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM stages WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Genres
// -------------------------------------------------------------------------
router.get('/genres', async (_req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM genres ORDER BY name');
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/genres', async (req, res, next) => {
  try {
    const [result] = await db.query('INSERT INTO genres (name) VALUES (?)', [req.body.name]);
    const [rows] = await db.query('SELECT * FROM genres WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.put('/genres/:id', async (req, res, next) => {
  try {
    await db.query('UPDATE genres SET name=? WHERE id=?', [req.body.name, req.params.id]);
    const [rows] = await db.query('SELECT * FROM genres WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/genres/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM genres WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Acts
// -------------------------------------------------------------------------
router.get('/acts', async (_req, res, next) => {
  try {
    const [acts] = await db.query('SELECT * FROM acts ORDER BY name');
    const [genres] = await db.query('SELECT act_id, genre_id FROM act_genres');
    const genreMap = {};
    for (const { act_id, genre_id } of genres) {
      if (!genreMap[act_id]) genreMap[act_id] = [];
      genreMap[act_id].push(genre_id);
    }
    res.json(acts.map(a => ({ ...a, genre_ids: genreMap[a.id] || [] })));
  } catch (e) { next(e); }
});

router.post('/acts', async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { slug, name, tag, img, bio_nl, bio_en, ai_blurb_nl, ai_blurb_en, youtube_url, primary_genre_id, genre_ids = [] } = req.body;
    const [result] = await conn.query(
      'INSERT INTO acts (slug,name,tag,img,bio_nl,bio_en,ai_blurb_nl,ai_blurb_en,youtube_url,primary_genre_id) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [slug, name, tag, img, bio_nl, bio_en, ai_blurb_nl, ai_blurb_en, youtube_url, primary_genre_id || null]
    );
    const actId = result.insertId;
    if (genre_ids.length) {
      await conn.query(
        'INSERT INTO act_genres (act_id, genre_id) VALUES ' + genre_ids.map(() => '(?,?)').join(','),
        genre_ids.flatMap(gid => [actId, gid])
      );
    }
    await conn.commit();
    const [rows] = await conn.query('SELECT * FROM acts WHERE id = ?', [actId]);
    res.status(201).json({ ...rows[0], genre_ids });
  } catch (e) { await conn.rollback(); next(e); }
  finally { conn.release(); }
});

router.put('/acts/:id', async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { slug, name, tag, img, bio_nl, bio_en, ai_blurb_nl, ai_blurb_en, youtube_url, primary_genre_id, genre_ids = [] } = req.body;
    await conn.query(
      'UPDATE acts SET slug=?,name=?,tag=?,img=?,bio_nl=?,bio_en=?,ai_blurb_nl=?,ai_blurb_en=?,youtube_url=?,primary_genre_id=? WHERE id=?',
      [slug, name, tag, img, bio_nl, bio_en, ai_blurb_nl, ai_blurb_en, youtube_url, primary_genre_id || null, req.params.id]
    );
    await conn.query('DELETE FROM act_genres WHERE act_id = ?', [req.params.id]);
    if (genre_ids.length) {
      await conn.query(
        'INSERT INTO act_genres (act_id, genre_id) VALUES ' + genre_ids.map(() => '(?,?)').join(','),
        genre_ids.flatMap(gid => [req.params.id, gid])
      );
    }
    await conn.commit();
    const [rows] = await conn.query('SELECT * FROM acts WHERE id = ?', [req.params.id]);
    res.json({ ...rows[0], genre_ids });
  } catch (e) { await conn.rollback(); next(e); }
  finally { conn.release(); }
});

router.delete('/acts/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM acts WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Schedule
// -------------------------------------------------------------------------
router.get('/schedule', async (_req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, st.name AS stage_name, a.name AS act_name
      FROM schedule s
      JOIN stages st ON s.stage_id = st.id
      JOIN acts a ON s.act_id = a.id
      ORDER BY s.day, s.start_h
    `);
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/schedule', async (req, res, next) => {
  try {
    const { day, stage_id, act_id, start_h, end_h } = req.body;
    const [result] = await db.query(
      'INSERT INTO schedule (day, stage_id, act_id, start_h, end_h) VALUES (?,?,?,?,?)',
      [day, stage_id, act_id, start_h, end_h]
    );
    const [rows] = await db.query(`
      SELECT s.*, st.name AS stage_name, a.name AS act_name
      FROM schedule s JOIN stages st ON s.stage_id=st.id JOIN acts a ON s.act_id=a.id
      WHERE s.id=?
    `, [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.put('/schedule/:id', async (req, res, next) => {
  try {
    const { day, stage_id, act_id, start_h, end_h } = req.body;
    await db.query(
      'UPDATE schedule SET day=?, stage_id=?, act_id=?, start_h=?, end_h=? WHERE id=?',
      [day, stage_id, act_id, start_h, end_h, req.params.id]
    );
    const [rows] = await db.query(`
      SELECT s.*, st.name AS stage_name, a.name AS act_name
      FROM schedule s JOIN stages st ON s.stage_id=st.id JOIN acts a ON s.act_id=a.id
      WHERE s.id=?
    `, [req.params.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/schedule/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM schedule WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Map Pins
// -------------------------------------------------------------------------
router.get('/map-pins', async (_req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM map_pins ORDER BY kind, num');
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/map-pins', async (req, res, next) => {
  try {
    const { slug, kind, num, x, y, label, stage_id } = req.body;
    const [result] = await db.query(
      'INSERT INTO map_pins (slug, kind, num, x, y, label, stage_id) VALUES (?,?,?,?,?,?,?)',
      [slug, kind, num || null, x, y, label, stage_id || null]
    );
    const [rows] = await db.query('SELECT * FROM map_pins WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.put('/map-pins/:id', async (req, res, next) => {
  try {
    const { slug, kind, num, x, y, label, stage_id } = req.body;
    await db.query(
      'UPDATE map_pins SET slug=?, kind=?, num=?, x=?, y=?, label=?, stage_id=? WHERE id=?',
      [slug, kind, num || null, x, y, label, stage_id || null, req.params.id]
    );
    const [rows] = await db.query('SELECT * FROM map_pins WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/map-pins/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM map_pins WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// FAQs
// -------------------------------------------------------------------------
router.get('/faqs', async (_req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM faqs ORDER BY lang, sort');
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/faqs', async (req, res, next) => {
  try {
    const { lang, question, answer, sort } = req.body;
    const [result] = await db.query(
      'INSERT INTO faqs (lang, question, answer, sort) VALUES (?,?,?,?)',
      [lang, question, answer, sort ?? 0]
    );
    const [rows] = await db.query('SELECT * FROM faqs WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.put('/faqs/:id', async (req, res, next) => {
  try {
    const { lang, question, answer, sort } = req.body;
    await db.query(
      'UPDATE faqs SET lang=?, question=?, answer=?, sort=? WHERE id=?',
      [lang, question, answer, sort ?? 0, req.params.id]
    );
    const [rows] = await db.query('SELECT * FROM faqs WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/faqs/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM faqs WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Reach Items
// -------------------------------------------------------------------------
router.get('/reach', async (_req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM reach_items ORDER BY lang, sort');
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/reach', async (req, res, next) => {
  try {
    const { lang, icon, title, descr, sort } = req.body;
    const [result] = await db.query(
      'INSERT INTO reach_items (lang, icon, title, descr, sort) VALUES (?,?,?,?,?)',
      [lang, icon, title, descr, sort ?? 0]
    );
    const [rows] = await db.query('SELECT * FROM reach_items WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.put('/reach/:id', async (req, res, next) => {
  try {
    const { lang, icon, title, descr, sort } = req.body;
    await db.query(
      'UPDATE reach_items SET lang=?, icon=?, title=?, descr=?, sort=? WHERE id=?',
      [lang, icon, title, descr, sort ?? 0, req.params.id]
    );
    const [rows] = await db.query('SELECT * FROM reach_items WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/reach/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM reach_items WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Info Facts
// -------------------------------------------------------------------------
router.get('/info', async (_req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM info_facts ORDER BY lang, fkey');
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/info', async (req, res, next) => {
  try {
    const { fkey, lang, value } = req.body;
    const [result] = await db.query(
      'INSERT INTO info_facts (fkey, lang, value) VALUES (?,?,?)',
      [fkey, lang, value]
    );
    const [rows] = await db.query('SELECT * FROM info_facts WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.put('/info/:id', async (req, res, next) => {
  try {
    const { fkey, lang, value } = req.body;
    await db.query(
      'UPDATE info_facts SET fkey=?, lang=?, value=? WHERE id=?',
      [fkey, lang, value, req.params.id]
    );
    const [rows] = await db.query('SELECT * FROM info_facts WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/info/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM info_facts WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Push Notifications
// -------------------------------------------------------------------------
router.get('/push/stats', async (_req, res, next) => {
  try {
    const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM push_subscriptions');
    res.json({ subscribers: Number(count) });
  } catch (e) { next(e); }
});

router.post('/push/broadcast', async (req, res, next) => {
  try {
    const { title, body, url } = req.body;
    const [subs] = await db.query('SELECT endpoint, p256dh, auth_key FROM push_subscriptions');
    const payload = JSON.stringify({ title, body, url: url || '/' });
    let sent = 0, failed = 0;
    for (const sub of subs) {
      try {
        await sendTo({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } }, payload);
        sent++;
      } catch { failed++; }
    }
    await db.query(
      'INSERT INTO notifications (title, body, url, sent_at) VALUES (?,?,?,NOW())',
      [title, body, url || '/']
    );
    res.json({ sent, failed });
  } catch (e) { next(e); }
});

// -------------------------------------------------------------------------
// Dashboard stats
// -------------------------------------------------------------------------
router.get('/dashboard', async (_req, res, next) => {
  try {
    const [[{ stages }]] = await db.query('SELECT COUNT(*) AS stages FROM stages');
    const [[{ acts }]] = await db.query('SELECT COUNT(*) AS acts FROM acts');
    const [[{ slots }]] = await db.query('SELECT COUNT(*) AS slots FROM schedule');
    const [[{ pins }]] = await db.query('SELECT COUNT(*) AS pins FROM map_pins');
    const [[{ subscribers }]] = await db.query('SELECT COUNT(*) AS subscribers FROM push_subscriptions');
    const [notifications] = await db.query(
      'SELECT title, body, sent_at FROM notifications ORDER BY sent_at DESC LIMIT 5'
    );
    res.json({
      counts: { stages: Number(stages), acts: Number(acts), slots: Number(slots), pins: Number(pins), subscribers: Number(subscribers) },
      notifications
    });
  } catch (e) { next(e); }
});

module.exports = router;
