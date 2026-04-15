import { motion } from "motion/react";
import { ExternalLink, ShieldAlert, ShieldCheck, Terminal } from "lucide-react";

const newsItems = [
  {
    id: 1,
    title: "Critical Vulnerability Found in Popular Open Source Library",
    source: "CyberNews",
    date: "2024-04-14",
    type: "alert",
    summary: "A new zero-day vulnerability has been disclosed affecting millions of servers. Patch immediately if you are using version 2.4.x.",
    link: "#"
  },
  {
    id: 2,
    title: "New Phishing Campaign Targets Small Businesses",
    source: "Security Weekly",
    date: "2024-04-12",
    type: "warning",
    summary: "Attackers are using sophisticated AI-generated emails to bypass standard spam filters. Ensure your team is trained on what to look for.",
    link: "#"
  },
  {
    id: 3,
    title: "Major Tech Company Announces New Privacy Features",
    source: "Tech Daily",
    date: "2024-04-10",
    type: "info",
    summary: "End-to-end encryption is rolling out to all users by default, marking a major win for consumer privacy advocates.",
    link: "#"
  },
  {
    id: 4,
    title: "Ransomware Group Takedown Successful",
    source: "Global Intel",
    date: "2024-04-08",
    type: "success",
    summary: "International law enforcement agencies have successfully seized the servers of a major ransomware syndicate.",
    link: "#"
  },
  {
    id: 5,
    title: "Update Your Browsers: Emergency Patch Released",
    source: "BrowserSec",
    date: "2024-04-05",
    type: "alert",
    summary: "An actively exploited vulnerability in the V8 JavaScript engine requires immediate patching.",
    link: "#"
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case 'alert': return <ShieldAlert className="w-5 h-5 text-red-500" />;
    case 'success': return <ShieldCheck className="w-5 h-5 text-green-600" />;
    case 'warning': return <ShieldAlert className="w-5 h-5 text-yellow-600" />;
    default: return <Terminal className="w-5 h-5 text-accent" />;
  }
};

export default function News() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-10 flex flex-col min-h-[calc(100vh-200px)]"
    >
      <header className="py-16 max-w-3xl">
        <h1 className="font-fraunces text-4xl md:text-6xl mb-6 italic">Cybersecurity News</h1>
        <p className="text-lg text-ink-light leading-relaxed">
          A curated feed of the latest threats, vulnerabilities, and privacy updates you need to know about.
        </p>
      </header>

      <div className="flex-grow pb-24">
        <div className="grid gap-6 max-w-4xl">
          {newsItems.map((item, idx) => (
            <motion.article 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel p-6 md:p-8 rounded group hover:bg-white/60 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-white p-2 rounded shadow-sm border border-border">
                  {getIcon(item.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-ink-light mb-3">
                    <span className="font-semibold text-ink">{item.source}</span>
                    <span className="w-1 h-1 rounded-full bg-ink/20" />
                    <span>{item.date}</span>
                  </div>
                  <h2 className="font-fraunces text-xl md:text-2xl mb-3 group-hover:text-accent transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-ink-light leading-relaxed mb-4">
                    {item.summary}
                  </p>
                  <a href={item.link} className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-accent transition-colors">
                    Read Full Story <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Scrolling Bottom Newsfeed Ticker */}
      <div className="fixed bottom-0 left-0 w-full bg-ink text-cream py-3 overflow-hidden z-50 border-t border-ink-light">
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {newsItems.map((item, idx) => (
            <span key={`ticker-1-${idx}`} className="mx-8 font-mono text-xs flex items-center gap-3">
              <span className="text-accent">[{item.date}]</span> 
              <span className="font-semibold">{item.title}</span>
              <span className="opacity-50">— {item.source}</span>
            </span>
          ))}
          {newsItems.map((item, idx) => (
            <span key={`ticker-2-${idx}`} className="mx-8 font-mono text-xs flex items-center gap-3">
              <span className="text-accent">[{item.date}]</span> 
              <span className="font-semibold">{item.title}</span>
              <span className="opacity-50">— {item.source}</span>
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
