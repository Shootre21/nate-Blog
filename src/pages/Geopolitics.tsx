import { motion } from "motion/react";
import { ArrowRight, Rss } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Geopolitics() {
  const [articles, setArticles] = useState<any[]>([]);
  const [rssFeeds, setRssFeeds] = useState<any[]>([]);
  const [loadingRss, setLoadingRss] = useState(true);
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    // Fetch Geopolitics posts
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Filter for Geopolitics category
          const geoPosts = data.filter((post: any) => 
            post.category.toLowerCase().includes('geopolitic') || 
            post.category.toLowerCase().includes('world')
          );
          setArticles(geoPosts);
        } else {
          setArticles([]);
        }
      })
      .catch(() => {
        setArticles([]);
      });

    // Fetch RSS Feeds
    fetch('/api/rss')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setRssFeeds(data);
        }
        setLoadingRss(false);
      })
      .catch(() => {
        setLoadingRss(false);
      });

    // Fetch Page Content
    fetch('/api/pages/geopolitics')
      .then(res => res.json())
      .then(data => {
        if (data && data.content) {
          setPageContent(JSON.parse(data.content));
        }
      })
      .catch(console.error);
  }, []);

  const intro = pageContent?.intro || "Analysis of global events, international relations, and macro-security trends.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-10"
    >
      <header className="py-16 max-w-3xl">
        <h1 className="font-fraunces text-4xl md:text-6xl mb-6 italic">Geopolitics</h1>
        <p className="text-lg text-ink-light leading-relaxed">
          {intro}
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12 pb-24">
        {/* Main Content: Blog Posts */}
        <div className="flex flex-col gap-12">
          <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
            <h2 className="font-mono text-sm uppercase tracking-widest text-ink-light">My Analysis</h2>
          </div>
          
          {articles.length > 0 ? articles.map((article, idx) => (
            <motion.article 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[21/9] overflow-hidden rounded glass-panel p-2 mb-6">
                <img 
                  src={article.image || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070&auto=format&fit=crop"} 
                  alt={article.title}
                  className="w-full h-full object-cover rounded-sm filter grayscale-[30%] contrast-125 group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-4 font-mono text-xs text-ink-light mb-4">
                <span>{article.date}</span>
                <span className="w-1 h-1 rounded-full bg-ink/20" />
                <span>{article.category}</span>
                <span className="w-1 h-1 rounded-full bg-ink/20" />
                <span>{article.readTime}</span>
              </div>
              <h3 className="font-fraunces text-2xl md:text-3xl mb-4 group-hover:text-accent transition-colors">
                {article.title}
              </h3>
              <p className="text-ink-light mb-6 leading-relaxed">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-ink group-hover:text-accent transition-colors">
                Read Post <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.article>
          )) : (
            <div className="glass-panel p-8 text-center text-ink-light">
              <p>No geopolitical analysis posts yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar: RSS Feeds */}
        <aside className="flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-border pb-4 mb-2">
            <Rss className="w-4 h-4 text-accent" />
            <h2 className="font-mono text-sm uppercase tracking-widest text-ink-light">Global Intel Feed</h2>
          </div>
          
          <div className="glass-panel p-6 flex flex-col gap-4">
            {loadingRss ? (
              <p className="text-sm text-ink-light animate-pulse">Syncing feeds...</p>
            ) : rssFeeds.length > 0 ? (
              rssFeeds.map((feed, idx) => (
                <a 
                  key={idx} 
                  href={feed.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block group border-b border-border/50 last:border-0 pb-4 last:pb-0"
                >
                  <div className="font-mono text-[10px] text-accent mb-1 uppercase tracking-wider">
                    {feed.source}
                  </div>
                  <h4 className="font-medium text-sm leading-snug group-hover:text-accent transition-colors mb-2">
                    {feed.title}
                  </h4>
                  <div className="font-mono text-[10px] text-ink-light">
                    {new Date(feed.pubDate || feed.isoDate).toLocaleDateString()}
                  </div>
                </a>
              ))
            ) : (
              <p className="text-sm text-ink-light">Unable to load feeds at this time.</p>
            )}
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
