import express from 'express';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './src/lib/db';
import path from 'path';
import Parser from 'rss-parser';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';
const rssParser = new Parser();

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

  // Pages
  app.get('/api/pages', (req, res) => {
    const pages = db.prepare('SELECT * FROM pages').all();
    res.json(pages);
  });

  app.get('/api/pages/:slug', (req, res) => {
    const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get(req.params.slug);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.json(page);
  });

  app.put('/api/pages/:slug', authenticate, (req, res) => {
    const { title, content } = req.body;
    const stmt = db.prepare('UPDATE pages SET title=?, content=? WHERE slug=?');
    stmt.run(title, content, req.params.slug);
    res.json({ success: true });
  });

  // RSS Feeds
  app.get('/api/rss', async (req, res) => {
    try {
      const feeds = [
        'https://www.crisisgroup.org/rss',
        'https://www.foreignaffairs.com/rss.xml',
        'https://thediplomat.com/feed',
        'https://geopoliticalfutures.com/feed'
      ];
      
      const feedPromises = feeds.map(url => 
        rssParser.parseURL(url).catch(e => {
          console.error(`Failed to fetch RSS from ${url}:`, e.message);
          return { items: [] };
        })
      );
      
      const results = await Promise.all(feedPromises);
      
      let allItems: any[] = [];
      results.forEach((result: any) => {
        if (result && result.items) {
          // Add source title to items
          const sourceTitle = result.title || 'Geopolitics News';
          const itemsWithSource = result.items.slice(0, 5).map((item: any) => ({
            ...item,
            source: sourceTitle
          }));
          allItems = allItems.concat(itemsWithSource);
        }
      });
      
      // Sort by date descending
      allItems.sort((a, b) => {
        const dateA = new Date(a.pubDate || a.isoDate || 0).getTime();
        const dateB = new Date(b.pubDate || b.isoDate || 0).getTime();
        return dateB - dateA;
      });
      
      res.json(allItems.slice(0, 20));
    } catch (error) {
      console.error('RSS Error:', error);
      res.status(500).json({ error: 'Failed to fetch RSS feeds' });
    }
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
