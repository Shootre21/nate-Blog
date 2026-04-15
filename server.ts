import express from 'express';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './src/lib/db';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // --- API Routes ---

  // Auth Middleware
  const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      (req as any).user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
  };

  // Login
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
    
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ success: true });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  app.get('/api/auth/me', authenticate, (req, res) => {
    res.json({ user: (req as any).user });
  });

  // Nav Links
  app.get('/api/nav', (req, res) => {
    const links = db.prepare('SELECT * FROM nav_links ORDER BY order_index ASC').all();
    res.json(links);
  });

  app.post('/api/nav', authenticate, (req, res) => {
    const { name, path, order_index } = req.body;
    const stmt = db.prepare('INSERT INTO nav_links (name, path, order_index) VALUES (?, ?, ?)');
    const info = stmt.run(name, path, order_index);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete('/api/nav/:id', authenticate, (req, res) => {
    db.prepare('DELETE FROM nav_links WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Posts
  app.get('/api/posts', (req, res) => {
    const posts = db.prepare('SELECT * FROM posts ORDER BY id DESC').all();
    res.json(posts);
  });

  app.post('/api/posts', authenticate, (req, res) => {
    const { title, excerpt, content, date, readTime, category, image } = req.body;
    const stmt = db.prepare('INSERT INTO posts (title, excerpt, content, date, readTime, category, image) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(title, excerpt, content, date, readTime, category, image);
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/posts/:id', authenticate, (req, res) => {
    const { title, excerpt, content, date, readTime, category, image } = req.body;
    const stmt = db.prepare('UPDATE posts SET title=?, excerpt=?, content=?, date=?, readTime=?, category=?, image=? WHERE id=?');
    stmt.run(title, excerpt, content, date, readTime, category, image, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/posts/:id', authenticate, (req, res) => {
    db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
