import { motion } from "motion/react";
import { Heart, Globe, Shield } from "lucide-react";

export default function Stance() {
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
          While my blog is mostly about technology and my daily life, I believe it's important to be transparent about the values that drive my work and worldview.
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-12 pb-24">
        <div className="lg:col-span-4">
          <div className="sticky top-32 glass-panel p-8 rounded">
            <h3 className="font-fraunces text-xl mb-4">Core Values</h3>
            <p className="text-sm text-ink-light mb-6">
              I am a socialist progressive. I believe in community infrastructure, mutual aid, and technology that serves the public good rather than corporate interests.
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
              <h3 className="font-fraunces text-2xl">Community Over Profit</h3>
            </div>
            <p className="text-ink-light leading-relaxed">
              I advocate for digital autonomy and open-source software. Technology should empower communities, not extract data from them. My consulting work often reflects this, offering low-cost security solutions to non-profits and small businesses.
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
              <h3 className="font-fraunces text-2xl">Privacy as a Human Right</h3>
            </div>
            <p className="text-ink-light leading-relaxed">
              In an era of mass surveillance, privacy is essential for a functioning democracy. I support policies and technologies that protect individual privacy and secure communications for activists and marginalized groups.
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
              <h3 className="font-fraunces text-2xl">Progressive Activism</h3>
            </div>
            <p className="text-ink-light leading-relaxed">
              I actively support labor unions, environmental justice initiatives, and systemic reforms aimed at reducing inequality. I believe we all have a role to play in building a more equitable society.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
