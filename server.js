// server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || './data/powerbody.db';
const JWT_SECRET = process.env.JWT_SECRET || 'troque_essa_chave';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

const db = new Database(DB_FILE);
db.pragma('foreign_keys = ON');

// static files (client pages)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// multer - avatar upload
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB

// nodemailer transporter (configure via env)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined
});

// helpers
function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch (e) { return null; }
}
function authMiddleware(req, res, next) {
  const token = req.cookies['auth_token'] || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Não autenticado' });
  const data = verifyToken(token);
  if (!data) return res.status(401).json({ error: 'Token inválido' });
  req.user = data;
  next();
}

// ---- ROUTES ----

// GET /api/me -> perfil (autenticado)
app.get('/api/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id,name,email,avatar,is_admin,created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json({ user });
});

// POST /api/register
app.post('/api/register', upload.single('avatar'), async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Dados incompletos' });
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (exists) return res.status(400).json({ error: 'Email já cadastrado' });

  const hash = await bcrypt.hash(password, 10);
  const avatarPath = req.file ? `/uploads/${path.basename(req.file.path)}` : null;
  const info = db.prepare('INSERT INTO users (name,email,password_hash,avatar) VALUES (?,?,?,?)')
    .run(name, email.toLowerCase(), hash, avatarPath);
  const id = info.lastInsertRowid;
  const token = createToken({ id, email: email.toLowerCase() });
  res.cookie('auth_token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true, id, token });
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  const user = db.prepare('SELECT id,password_hash FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) return res.status(400).json({ error: 'Usuário ou senha incorretos' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).json({ error: 'Usuário ou senha incorretos' });
  const token = createToken({ id: user.id, email: email.toLowerCase() });
  res.cookie('auth_token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true, token });
});

// POST /api/logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ ok: true });
});

// POST /api/upload-avatar (autenticado)
app.post('/api/upload-avatar', authMiddleware, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });
  const avatarPath = `/uploads/${path.basename(req.file.path)}`;
  db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatarPath, req.user.id);
  res.json({ ok: true, avatar: avatarPath });
});

// ---- Reset de senha (email) ----

// POST /api/forgot-password { email }
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email é obrigatório' });
  const user = db.prepare('SELECT id,email,name FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) {
    // não vaza informação: responde ok (so log)
    return res.json({ ok: true });
  }
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // 1h
  db.prepare('INSERT INTO password_resets (user_id,token,expires_at) VALUES (?,?,?)')
    .run(user.id, token, expiresAt);

  const resetUrl = `${APP_URL}/reset-password.html?token=${token}`;
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'no-reply@powerbody.local',
    to: user.email,
    subject: 'Redefinir senha • PowerBody',
    text: `Olá ${user.name || ''},\n\nUse este link para redefinir sua senha (expira em 1 hora): ${resetUrl}\n\nSe não pediu, ignore.`,
    html: `<p>Olá ${user.name || ''},</p><p>Use este link para redefinir sua senha (expira em 1 hora): <a href="${resetUrl}">Redefinir senha</a></p>`
  };

  if (transporter) {
    transporter.sendMail(mailOptions).catch(err => console.error('Erro enviando email:', err));
  } else {
    console.warn('SMTP não configurado — token:', token);
  }

  res.json({ ok: true });
});

// POST /api/reset-password { token, password }
app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Dados incompletos' });

  const row = db.prepare('SELECT pr.id pr_id, pr.user_id, pr.expires_at, pr.used, u.email FROM password_resets pr JOIN users u ON pr.user_id = u.id WHERE pr.token = ?').get(token);
  if (!row) return res.status(400).json({ error: 'Token inválido' });
  if (row.used) return res.status(400).json({ error: 'Token já usado' });
  if (new Date(row.expires_at) < new Date()) return res.status(400).json({ error: 'Token expirado' });

  const hash = await bcrypt.hash(password, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, row.user_id);
  db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?').run(row.pr_id);
  res.json({ ok: true });
});

// small health check + index
app.get('/api/ping', (req, res) => res.json({ ok: true, now: Date.now() }));

// fallback: serve public files (login/register/profile) - web UI stored em /public
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});
