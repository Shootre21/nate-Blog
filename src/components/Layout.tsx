import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { Menu, X, Github, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    fetch('/api/nav')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setNavLinks(data);
        } else {
          setNavLinks([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: "Geopolitical", path: "/geopolitics" },
            { name: "Cyber News", path: "/news" },
            { name: "About Me", path: "/about" },
            { name: "Consulting", path: "/work" },
          ]);
        }
      })
      .catch(() => {
        setNavLinks([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: "Geopolitical", path: "/geopolitics" },
          { name: "Cyber News", path: "/news" },
          { name: "About Me", path: "/about" },
          { name: "Consulting", path: "/work" },
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-accent/20 selection:text-ink">
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-[80px] px-10 flex items-center justify-between border-b border-border bg-glass backdrop-blur-md"
        )}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="font-fraunces text-[24px] font-normal tracking-[-0.5px] z-50 relative"
          >
            Nate's Blog
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-[32px] transition-all duration-500"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative text-[13px] uppercase tracking-[1px] no-underline font-semibold transition-colors",
                    isActive ? "opacity-100 border-b-[1.5px] border-ink pb-1" : "opacity-60 text-ink hover:opacity-100"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-[1px] bg-accent"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4 z-50">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-light hover:text-ink transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
            <Link
              to="/admin/login"
              className="text-ink-light hover:text-ink transition-colors"
              aria-label="Admin Login"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              to="/work"
              className="text-[13px] font-semibold px-4 py-2 rounded border border-border hover:border-ink/30 transition-colors uppercase tracking-[1px]"
            >
              Hire Me
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 text-ink"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <motion.div
          initial={false}
          animate={{
            opacity: mobileMenuOpen ? 1 : 0,
            pointerEvents: mobileMenuOpen ? "auto" : "none",
          }}
          className="fixed inset-0 bg-cream/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="font-fraunces text-3xl text-ink"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-6 mt-8">
            <a href="https://github.com" className="text-ink-light">
              <Github className="w-6 h-6" />
            </a>
            <Link to="/admin/login" className="text-ink-light">
              <User className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>
      </header>

      <main className="flex-grow pt-[120px] pb-24">
        <Outlet />
      </main>

      <footer className="h-[40px] px-10 border-t border-border flex items-center justify-between font-mono text-[10px] tracking-[0.5px] opacity-50 mt-auto">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
          <div>&copy; {new Date().getFullYear()} NATE'S BLOG &middot; OREGON, USA</div>
          <div>STATUS: ONLINE // PUBLIC_DNS: OK</div>
        </div>
      </footer>
    </div>
  );
}
