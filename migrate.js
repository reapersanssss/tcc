// migrate.js
const Database = require('better-sqlite3');
const db = new Database(process.env.DB_FILE || './data/powerbody.db');

function create() {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      avatar TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // seed admin if not exists
  const row = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@powerbody.local');
  if (!row) {
    const bcrypt = require('bcrypt');
    const pw = 'admin123'; // troque logo após subir
    const hash = bcrypt.hashSync(pw, 10);
    db.prepare('INSERT INTO users (name,email,password_hash,is_admin) VALUES (?,?,?,1)')
      .run('Admin PowerBody','admin@powerbody.local', hash);
    console.log('Admin seed criado: admin@powerbody.local / admin123 (troque a senha)');
  } else {
    console.log('Admin já existe.');
  }
}

create();
console.log('Migrations executadas.');
process.exit(0);
