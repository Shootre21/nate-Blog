import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogOut, FileText, Navigation, Settings, Plus, Trash2, Edit, LayoutTemplate } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => setUser(data.user))
      .catch(() => navigate('/admin/login'));
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    navigate('/admin/login');
  };

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-white/50 p-6 flex flex-col h-screen sticky top-0">
        <div className="mb-10">
          <h2 className="font-fraunces text-2xl italic">Admin Panel</h2>
          <p className="font-mono text-xs text-ink-light mt-1">Logged in as {user.username}</p>
        </div>

        <nav className="flex-grow space-y-2">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded text-left transition-colors ${activeTab === 'posts' ? 'bg-ink text-cream' : 'hover:bg-border/50'}`}
          >
            <FileText className="w-4 h-4" /> Posts
          </button>
          <button 
            onClick={() => setActiveTab('pages')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded text-left transition-colors ${activeTab === 'pages' ? 'bg-ink text-cream' : 'hover:bg-border/50'}`}
          >
            <LayoutTemplate className="w-4 h-4" /> Pages
          </button>
          <button 
            onClick={() => setActiveTab('nav')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded text-left transition-colors ${activeTab === 'nav' ? 'bg-ink text-cream' : 'hover:bg-border/50'}`}
          >
            <Navigation className="w-4 h-4" /> Navigation
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-border space-y-2">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-2 rounded text-left hover:bg-border/50 text-ink-light transition-colors">
            <Settings className="w-4 h-4" /> View Site
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded text-left hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto">
        {activeTab === 'posts' && <PostsManager />}
        {activeTab === 'pages' && <PagesManager />}
        {activeTab === 'nav' && <NavManager />}
      </main>
    </div>
  );
}

function PostsManager() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('/api/posts').then(res => res.json()).then(setPosts);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = currentPost.id ? `/api/posts/${currentPost.id}` : '/api/posts';
    const method = currentPost.id ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentPost)
    });
    
    setIsEditing(false);
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  if (isEditing) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-fraunces text-3xl">{currentPost.id ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={() => setIsEditing(false)} className="text-ink-light hover:text-ink">Cancel</button>
        </div>
        <form onSubmit={handleSave} className="space-y-4 glass-panel p-6">
          <div>
            <label className="block font-mono text-xs mb-1">TITLE</label>
            <input type="text" value={currentPost.title || ''} onChange={e => setCurrentPost({...currentPost, title: e.target.value})} className="w-full p-2 border border-border rounded" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs mb-1">DATE</label>
              <input type="date" value={currentPost.date || ''} onChange={e => setCurrentPost({...currentPost, date: e.target.value})} className="w-full p-2 border border-border rounded" required />
            </div>
            <div>
              <label className="block font-mono text-xs mb-1">CATEGORY</label>
              <input 
                type="text" 
                list="categories"
                value={currentPost.category || ''} 
                onChange={e => setCurrentPost({...currentPost, category: e.target.value})} 
                className="w-full p-2 border border-border rounded" 
                required 
                placeholder="e.g. Technology, Geopolitics"
              />
              <datalist id="categories">
                <option value="Technology" />
                <option value="Geopolitics" />
                <option value="Personal" />
                <option value="Security" />
              </datalist>
            </div>
          </div>
          <div>
            <label className="block font-mono text-xs mb-1">EXCERPT</label>
            <textarea value={currentPost.excerpt || ''} onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})} className="w-full p-2 border border-border rounded h-20" required />
          </div>
          <div>
            <label className="block font-mono text-xs mb-1">CONTENT (Markdown/HTML)</label>
            <textarea value={currentPost.content || ''} onChange={e => setCurrentPost({...currentPost, content: e.target.value})} className="w-full p-2 border border-border rounded h-64" required />
          </div>
          <div>
            <label className="block font-mono text-xs mb-1">IMAGE URL</label>
            <input type="text" value={currentPost.image || ''} onChange={e => setCurrentPost({...currentPost, image: e.target.value})} className="w-full p-2 border border-border rounded" />
          </div>
          <button type="submit" className="bg-ink text-cream px-6 py-2 rounded">Save Post</button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-fraunces text-3xl">Blog Posts</h2>
        <button 
          onClick={() => { setCurrentPost({}); setIsEditing(true); }}
          className="flex items-center gap-2 bg-ink text-cream px-4 py-2 rounded text-sm"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="grid gap-4">
        {posts.map(post => (
          <div key={post.id} className="glass-panel p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg">{post.title}</h3>
              <p className="font-mono text-xs text-ink-light mt-1">{post.date} &middot; {post.category}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setCurrentPost(post); setIsEditing(true); }} className="p-2 hover:bg-border/50 rounded"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PagesManager() {
  const [pages, setPages] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState<any>({});
  const [parsedContent, setParsedContent] = useState<any>({});

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = () => {
    fetch('/api/pages').then(res => res.json()).then(setPages);
  };

  const handleEdit = (page: any) => {
    setCurrentPage(page);
    try {
      setParsedContent(JSON.parse(page.content));
    } catch (e) {
      setParsedContent({ raw: page.content });
    }
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPage = {
      ...currentPage,
      content: JSON.stringify(parsedContent)
    };
    
    await fetch(`/api/pages/${currentPage.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPage)
    });
    
    setIsEditing(false);
    fetchPages();
  };

  if (isEditing) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-fraunces text-3xl">Edit Page: {currentPage.title}</h2>
          <button onClick={() => setIsEditing(false)} className="text-ink-light hover:text-ink">Cancel</button>
        </div>
        <form onSubmit={handleSave} className="space-y-4 glass-panel p-6">
          <div>
            <label className="block font-mono text-xs mb-1">PAGE TITLE</label>
            <input type="text" value={currentPage.title || ''} onChange={e => setCurrentPage({...currentPage, title: e.target.value})} className="w-full p-2 border border-border rounded" required />
          </div>
          
          <div className="pt-4 border-t border-border">
            <h3 className="font-medium mb-4">Page Content</h3>
            {Object.keys(parsedContent).map(key => (
              <div key={key} className="mb-4">
                <label className="block font-mono text-xs mb-1 uppercase">{key}</label>
                {typeof parsedContent[key] === 'string' ? (
                  <textarea 
                    value={parsedContent[key]} 
                    onChange={e => setParsedContent({...parsedContent, [key]: e.target.value})} 
                    className="w-full p-2 border border-border rounded h-24" 
                  />
                ) : (
                  <textarea 
                    value={JSON.stringify(parsedContent[key], null, 2)} 
                    onChange={e => {
                      try {
                        setParsedContent({...parsedContent, [key]: JSON.parse(e.target.value)})
                      } catch(err) {
                        // ignore invalid json while typing
                      }
                    }} 
                    className="w-full p-2 border border-border rounded h-48 font-mono text-xs" 
                  />
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="bg-ink text-cream px-6 py-2 rounded">Save Page</button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-fraunces text-3xl">Pages</h2>
      </div>

      <div className="grid gap-4">
        {pages.map(page => (
          <div key={page.slug} className="glass-panel p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg">{page.title}</h3>
              <p className="font-mono text-xs text-ink-light mt-1">/{page.slug === 'home' ? '' : page.slug}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(page)} className="p-2 hover:bg-border/50 rounded"><Edit className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function NavManager() {
  const [links, setLinks] = useState<any[]>([]);
  const [newLink, setNewLink] = useState({ name: '', path: '', order_index: 0 });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = () => {
    fetch('/api/nav').then(res => res.json()).then(setLinks);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/nav', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLink)
    });
    setNewLink({ name: '', path: '', order_index: links.length + 1 });
    fetchLinks();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/nav/${id}`, { method: 'DELETE' });
    fetchLinks();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
      <h2 className="font-fraunces text-3xl mb-8">Navigation Links</h2>
      
      <div className="glass-panel p-6 mb-8">
        <h3 className="font-medium mb-4">Add New Link</h3>
        <form onSubmit={handleAdd} className="flex gap-4 items-end">
          <div className="flex-grow">
            <label className="block font-mono text-xs mb-1">NAME</label>
            <input type="text" value={newLink.name} onChange={e => setNewLink({...newLink, name: e.target.value})} className="w-full p-2 border border-border rounded" required />
          </div>
          <div className="flex-grow">
            <label className="block font-mono text-xs mb-1">PATH</label>
            <input type="text" value={newLink.path} onChange={e => setNewLink({...newLink, path: e.target.value})} className="w-full p-2 border border-border rounded" required />
          </div>
          <div className="w-20">
            <label className="block font-mono text-xs mb-1">ORDER</label>
            <input type="number" value={newLink.order_index} onChange={e => setNewLink({...newLink, order_index: parseInt(e.target.value)})} className="w-full p-2 border border-border rounded" required />
          </div>
          <button type="submit" className="bg-ink text-cream px-4 py-2 rounded h-[42px]"><Plus className="w-5 h-5" /></button>
        </form>
      </div>

      <div className="space-y-2">
        {links.map(link => (
          <div key={link.id} className="glass-panel p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-ink-light bg-border/50 px-2 py-1 rounded">{link.order_index}</span>
              <span className="font-medium">{link.name}</span>
              <span className="text-ink-light text-sm">{link.path}</span>
            </div>
            <button onClick={() => handleDelete(link.id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
