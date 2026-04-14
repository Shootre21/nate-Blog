import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const articles = [
  {
    id: 1,
    title: "My Everyday Carry: Tech Edition",
    excerpt: "A breakdown of the gadgets, cables, and tools I carry with me every day as a cybersecurity professional.",
    date: "2024-04-12",
    readTime: "5 min read",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Basic Security Hygiene for 2024",
    excerpt: "You don't need to be paranoid, but you do need a password manager. Here are the simple steps to secure your digital life.",
    date: "2024-03-28",
    readTime: "8 min read",
    category: "Cybersecurity",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Thoughts on the Latest Web Frameworks",
    excerpt: "React, Vue, Svelte... the landscape keeps changing. Here's what I'm using for my personal projects this year.",
    date: "2024-02-10",
    readTime: "6 min read",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
  }
];

export default function Blog() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-10"
    >
      <header className="py-16 max-w-3xl">
        <h1 className="font-fraunces text-4xl md:text-6xl mb-6 italic">The Blog</h1>
        <p className="text-lg text-ink-light leading-relaxed">
          Everyday thoughts, tech reviews, cybersecurity tips, and whatever else is on my mind.
        </p>
      </header>

      <div className="grid gap-12 md:gap-24 pb-24">
        {articles.map((article, idx) => (
          <motion.article 
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="grid md:grid-cols-12 gap-8 items-center group cursor-pointer"
          >
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="flex items-center gap-4 font-mono text-xs text-ink-light mb-4">
                <span>{article.date}</span>
                <span className="w-1 h-1 rounded-full bg-ink/20" />
                <span>{article.category}</span>
                <span className="w-1 h-1 rounded-full bg-ink/20" />
                <span>{article.readTime}</span>
              </div>
              <h2 className="font-fraunces text-2xl md:text-3xl mb-4 group-hover:text-accent transition-colors">
                {article.title}
              </h2>
              <p className="text-ink-light mb-6 leading-relaxed">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-ink group-hover:text-accent transition-colors">
                Read Post <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            <div className="md:col-span-7 order-1 md:order-2">
              <div className="aspect-[16/9] overflow-hidden rounded glass-panel p-2">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover rounded-sm filter grayscale-[30%] contrast-125 group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}
