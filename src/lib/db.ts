import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password_hash TEXT
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    excerpt TEXT,
    content TEXT,
    date TEXT,
    readTime TEXT,
    category TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS nav_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    path TEXT,
    order_index INTEGER
  );
`);

// Seed initial admin user if not exists
const adminExists = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!adminExists) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('admin', hash);
}

// Seed initial nav links if empty
const navCount = db.prepare('SELECT COUNT(*) as count FROM nav_links').get() as { count: number };
if (navCount.count === 0) {
  const insertNav = db.prepare('INSERT INTO nav_links (name, path, order_index) VALUES (?, ?, ?)');
  insertNav.run('Home', '/', 1);
  insertNav.run('Blog', '/blog', 2);
  insertNav.run('Cyber News', '/news', 3);
  insertNav.run('About Me', '/about', 4);
  insertNav.run('Consulting', '/work', 5);
}

// Seed initial posts if empty
const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number };
if (postCount.count === 0) {
  const insertPost = db.prepare('INSERT INTO posts (title, excerpt, content, date, readTime, category, image) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertPost.run(
    'My Everyday Carry: Tech Edition',
    'A breakdown of the gadgets, cables, and tools I carry with me every day as a cybersecurity professional.',
    'Full content goes here...',
    '2024-04-12',
    '5 min read',
    'Lifestyle',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
  );
  insertPost.run(
    'Basic Security Hygiene for 2024',
    "You don't need to be paranoid, but you do need a password manager. Here are the simple steps to secure your digital life.",
    'Full content goes here...',
    '2024-03-28',
    '8 min read',
    'Cybersecurity',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop'
  );
  insertPost.run(
    'Thoughts on the Latest Web Frameworks',
    "React, Vue, Svelte... the landscape keeps changing. Here's what I'm using for my personal projects this year.",
    'Full content goes here...',
    '2024-02-10',
    '6 min read',
    'Tech',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'
  );
}

export default db;
