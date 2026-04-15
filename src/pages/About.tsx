import { motion } from "motion/react";
import { Heart, Globe, Shield } from "lucide-react";
import { useState, useEffect } from "react";

export default function About() {
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/pages/about')
      .then(res => res.json())
      .then(data => {
        if (data && data.content) {
          setPageContent(JSON.parse(data.content));
        }
      })
      .catch(console.error);
  }, []);

  const intro = pageContent?.intro || "While my blog is mostly about technology and my daily life, I believe it's important to be transparent about the values that drive my work and worldview.";
  const coreValuesIntro = pageContent?.coreValuesIntro || "I am a socialist progressive. I believe in community infrastructure, mutual aid, and technology that serves the public good rather than corporate interests.";
  
  const value1Title = pageContent?.value1Title || "Community Over Profit";
  const value1Text = pageContent?.value1Text || "I advocate for digital autonomy and open-source software. Technology should empower communities, not extract data from them. My consulting work often reflects this, offering low-cost security solutions to non-profits and small businesses.";
  
  const value2Title = pageContent?.value2Title || "Privacy as a Human Right";
  const value2Text = pageContent?.value2Text || "In an era of mass surveillance, privacy is essential for a functioning democracy. I support policies and technologies that protect individual privacy and secure communications for activists and marginalized groups.";
  
  const value3Title = pageContent?.value3Title || "Progressive Activism";
  const value3Text = pageContent?.value3Text || "I actively support labor unions, environmental justice initiatives, and systemic reforms aimed at reducing inequality. I believe we all have a role to play in building a more equitable society.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-10"
    >
      <header className="py-16 max-w-3xl">
        <h1 className="font-fraunces text-4xl md:text-6xl mb-6 italic">About Me</h1>
        <p className="text-lg text-ink-light leading-relaxed">
          {intro}
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-12 pb-24">
        <div className="lg:col-span-4">
          <div className="sticky top-32 glass-panel p-8 rounded">
            <h3 className="font-fraunces text-xl mb-4">Core Values</h3>
            <p className="text-sm text-ink-light mb-6">
              {coreValuesIntro}
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded border border-border bg-glass"
          >
            <div className="flex items-center gap-4 mb-4">
              <Globe className="w-6 h-6 text-accent" />
              <h3 className="font-fraunces text-2xl">{value1Title}</h3>
            </div>
            <p className="text-ink-light leading-relaxed">
              {value1Text}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded border border-border bg-glass"
          >
            <div className="flex items-center gap-4 mb-4">
              <Shield className="w-6 h-6 text-accent" />
              <h3 className="font-fraunces text-2xl">{value2Title}</h3>
            </div>
            <p className="text-ink-light leading-relaxed">
              {value2Text}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded border border-border bg-glass"
          >
            <div className="flex items-center gap-4 mb-4">
              <Heart className="w-6 h-6 text-accent" />
              <h3 className="font-fraunces text-2xl">{value3Title}</h3>
            </div>
            <p className="text-ink-light leading-relaxed">
              {value3Text}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
