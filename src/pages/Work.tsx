import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus, Mail, ArrowRight, Github } from "lucide-react";

const services = [
  {
    id: "setup",
    title: "Basic Security Setup & Vulnerability Check",
    description: "I will check your current network and software for vulnerabilities, misconfigurations, and exposure. We'll implement basic security hygiene to protect your data without overcomplicating your workflow.",
    deliverables: ["Network & Software Vulnerability Scan", "Basic Security Setup", "Remediation Checklist"]
  },
  {
    id: "awareness",
    title: "Low Cost Cybersecurity Awareness",
    description: "Customized training and resources for your team. We cover password hygiene, phishing awareness, and secure communications in a way that is accessible, actionable, and free of confusing jargon.",
    deliverables: ["Printouts of what to look for", "Monthly security awareness emails", "Interactive Q&A Session"]
  },
  {
    id: "vCISO",
    title: "Fractional Security Consulting",
    description: "Ongoing strategic guidance for organizations that need expert security leadership but cannot afford a full-time hire. I help build security culture, manage vendors, and navigate compliance requirements.",
    deliverables: ["Monthly Strategy Sessions", "Vendor Risk Assessments", "Policy Development"]
  }
];

export default function Work() {
  const [expandedId, setExpandedId] = useState<string | null>(services[0].id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-10"
    >
      <div className="grid lg:grid-cols-2 gap-16 pb-24">
        <div>
          <header className="py-16">
            <h1 className="font-fraunces text-4xl md:text-6xl mb-6 italic">Consulting</h1>
            <p className="text-lg text-ink-light leading-relaxed mb-8">
              I provide low cost cybersecurity awareness, and basic security setup for small businesses, non-profits, and independent creators.
            </p>
            <p className="text-ink-light leading-relaxed mb-12">
              My approach is rooted in common-sense defense. I don't sell expensive software; I help you build resilient systems using the tools you already have.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:hello@example.com"
                className="inline-flex items-center justify-center gap-2 bg-ink text-cream px-8 py-4 rounded font-medium hover:bg-ink-light transition-colors"
              >
                <Mail className="w-5 h-5" /> Start a Conversation
              </a>
              <a 
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-border text-ink px-8 py-4 rounded font-medium hover:border-ink/30 transition-colors"
              >
                <Github className="w-5 h-5" /> View GitHub
              </a>
            </div>
          </header>

          <div className="aspect-[4/3] rounded overflow-hidden glass-panel p-2 hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
              alt="Collaborative meeting space" 
              className="w-full h-full object-cover rounded-sm filter grayscale-[20%] sepia-[10%]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="lg:py-16">
          <h2 className="font-fraunces text-2xl mb-8">Services & Capabilities</h2>
          
          <div className="space-y-4">
            {services.map((service) => {
              const isExpanded = expandedId === service.id;
              
              return (
                <div 
                  key={service.id}
                  className="border border-border rounded overflow-hidden bg-glass transition-colors hover:border-ink/20"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : service.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-fraunces text-xl">{service.title}</span>
                    <span className="text-ink-light">
                      {isExpanded ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 border-t border-ink/5 mt-2">
                          <p className="text-ink-light mb-6 leading-relaxed">
                            {service.description}
                          </p>
                          <div>
                            <h4 className="font-mono text-xs uppercase tracking-wider text-ink mb-3">Typical Deliverables</h4>
                            <ul className="space-y-2">
                              {service.deliverables.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-ink-light">
                                  <ArrowRight className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
