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

  CREATE TABLE IF NOT EXISTS pages (
    slug TEXT PRIMARY KEY,
    title TEXT,
    content TEXT
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
  insertNav.run('Geopolitical', '/geopolitics', 3);
  insertNav.run('Cyber News', '/news', 4);
  insertNav.run('About Me', '/about', 5);
  insertNav.run('Consulting', '/work', 6);
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
  insertPost.run(
    'The Shifting Sands of Digital Sovereignty',
    'How nation-states are increasingly viewing data localization and infrastructure control as a matter of national security.',
    'Full content goes here...',
    '2024-04-15',
    '10 min read',
    'Geopolitics',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070&auto=format&fit=crop'
  );
}

// Seed initial pages if empty
const pageCount = db.prepare('SELECT COUNT(*) as count FROM pages').get() as { count: number };
if (pageCount.count === 0) {
  const insertPage = db.prepare('INSERT INTO pages (slug, title, content) VALUES (?, ?, ?)');
  
  insertPage.run('home', 'Home', JSON.stringify({
    heroTitle: "Thoughts on\ntech, security,\nand life.",
    heroText: "I'm Nate, a cybersecurity professional and Oregon State University alum. This is my personal corner of the internet where I write about technology, everyday observations, and my consulting work.",
    quickThought: "\"Just finished migrating my home server to a new NAS setup. There's something incredibly satisfying about organizing your own digital space...\""
  }));

  insertPage.run('about', 'About Me', JSON.stringify({
    intro: "While my blog is mostly about technology and my daily life, I believe it's important to be transparent about the values that drive my work and worldview.",
    coreValuesIntro: "I am a socialist progressive. I believe in community infrastructure, mutual aid, and technology that serves the public good rather than corporate interests.",
    value1Title: "Community Over Profit",
    value1Text: "I advocate for digital autonomy and open-source software. Technology should empower communities, not extract data from them. My consulting work often reflects this, offering low-cost security solutions to non-profits and small businesses.",
    value2Title: "Privacy as a Human Right",
    value2Text: "In an era of mass surveillance, privacy is essential for a functioning democracy. I support policies and technologies that protect individual privacy and secure communications for activists and marginalized groups.",
    value3Title: "Progressive Activism",
    value3Text: "I actively support labor unions, environmental justice initiatives, and systemic reforms aimed at reducing inequality. I believe we all have a role to play in building a more equitable society."
  }));

  insertPage.run('work', 'Consulting', JSON.stringify({
    intro1: "I provide low cost cybersecurity awareness, and basic security setup for small businesses, non-profits, and independent creators.",
    intro2: "My approach is rooted in common-sense defense. I don't sell expensive software; I help you build resilient systems using the tools you already have.",
    service1Title: "Basic Security Setup & Vulnerability Check",
    service1Desc: "I will check your current network and software for vulnerabilities, misconfigurations, and exposure. We'll implement basic security hygiene to protect your data without overcomplicating your workflow.",
    service2Title: "Low Cost Cybersecurity Awareness",
    service2Desc: "Customized training and resources for your team. We cover password hygiene, phishing awareness, and secure communications in a way that is accessible, actionable, and free of confusing jargon.",
    service3Title: "Fractional Security Consulting",
    service3Desc: "Ongoing strategic guidance for organizations that need expert security leadership but cannot afford a full-time hire. I help build security culture, manage vendors, and navigate compliance requirements."
  }));

  insertPage.run('news', 'Cybersecurity News', JSON.stringify({
    intro: "A curated feed of the latest threats, vulnerabilities, and privacy updates you need to know about."
  }));

  insertPage.run('geopolitics', 'Geopolitics', JSON.stringify({
    intro: "Analysis of global events, international relations, and macro-security trends."
  }));
}

export default db;
