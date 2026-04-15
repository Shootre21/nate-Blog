import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function Home() {
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setRecentPosts(data.slice(0, 2));
        }
      })
      .catch(console.error);

    fetch('/api/pages/home')
      .then(res => res.json())
      .then(data => {
        if (data && data.content) {
          setPageContent(JSON.parse(data.content));
        }
      })
      .catch(console.error);
  }, []);

  const heroTitle = pageContent?.heroTitle || "Thoughts on\ntech, security,\nand life.";
  const heroText = pageContent?.heroText || "I'm Nate, a cybersecurity professional and Oregon State University alum. This is my personal corner of the internet where I write about technology, everyday observations, and my consulting work.";
  const quickThought = pageContent?.quickThought || "\"Just finished migrating my home server to a new NAS setup. There's something incredibly satisfying about organizing your own digital space...\"";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto px-10 py-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-10"
    >
      {/* Hero Section */}
      <section className="flex flex-col justify-end relative pb-10">
        <div className="absolute top-10 right-0 w-[120px] h-[120px] border border-dashed border-accent opacity-20 -z-10" />
        
        <motion.div variants={item} className="font-mono text-[12px] text-accent mb-4 block">
          HELLO_WORLD: WELCOME
        </motion.div>
        
        <motion.h1 variants={item} className="font-fraunces text-[64px] md:text-[82px] leading-[0.95] font-normal mb-6 italic text-balance whitespace-pre-line">
          {heroTitle}
        </motion.h1>
        
        <motion.p variants={item} className="text-[18px] leading-[1.6] max-w-[500px] text-black/70 mb-8">
          {heroText}
        </motion.p>
        
        <motion.div variants={item} className="flex flex-wrap items-center gap-2">
          <span className="inline-block px-3 py-1 border border-border rounded-full text-[11px] font-semibold">Cybersecurity</span>
          <span className="inline-block px-3 py-1 border border-border rounded-full text-[11px] font-semibold">Personal Blog</span>
        </motion.div>
      </section>

      {/* Sidebar Modules */}
      <section className="flex flex-col gap-6">
        {/* Writing Module */}
        <motion.div variants={item} className="glass-panel p-6">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
            <span className="font-mono text-[11px] uppercase tracking-[1.5px] opacity-50">Recent Posts</span>
            <span className="font-mono text-[10px] opacity-50">/ BLOG</span>
          </div>
          {recentPosts.length > 0 ? recentPosts.map(post => (
            <Link key={post.id} to="/blog" className="block text-ink mb-3 no-underline group">
              <h3 className="font-fraunces text-[20px] font-normal mb-1 group-hover:text-accent transition-colors">{post.title}</h3>
              <span className="font-mono text-[10px] opacity-50">{post.date} &middot; {post.readTime}</span>
            </Link>
          )) : (
            <p className="text-ink-light text-sm">No recent posts.</p>
          )}
        </motion.div>

        {/* Community Module */}
        <motion.div variants={item} className="glass-panel p-6">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
            <span className="font-mono text-[11px] uppercase tracking-[1.5px] opacity-50">Quick Thought</span>
            <span className="font-mono text-[10px] opacity-50">/ NOTES</span>
          </div>
          <p className="text-[14px] leading-[1.5] text-black/60 italic">
            {quickThought}
          </p>
        </motion.div>

        {/* Work Module */}
        <motion.div variants={item} className="bg-accent text-white p-6 rounded flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-white/70">Transparency</span>
          <h2 className="font-fraunces text-[24px] font-normal">About Me</h2>
          <p className="text-[14px] leading-[1.4] opacity-90">While this blog focuses on tech and daily life, I believe in being upfront about my progressive values.</p>
          <Link to="/about" className="font-mono text-[11px] mt-2 text-white hover:opacity-80 transition-opacity">READ MORE &rarr;</Link>
        </motion.div>
      </section>
    </motion.div>
  );
}
