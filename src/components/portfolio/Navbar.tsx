import { useState, useEffect } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

const navLinks = [
  { href: '/', label: 'Home', isRoute: true },
  { href: '/experience', label: 'Experience', isRoute: true },
  { href: '/projects', label: 'Projects', isRoute: true },
  { href: '/cv', label: 'CV', isRoute: true },
  { href: '/blog', label: 'Blog', isRoute: true },
  { href: '/contact', label: 'Contact', isRoute: true },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const isHomePage = location.pathname === '/';
  const isDarkTheme = resolvedTheme !== 'light';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navLinks.filter(l => !l.isRoute).map((link) => link.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string, isRoute: boolean) => {
    setIsMobileMenuOpen(false);
    
    if (isRoute) {
      // Navigate to the route
      navigate(href);
    } else {
      // Handle anchor links (like #contact)
      if (isHomePage) {
        // If on home page, scroll to section
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If not on home page, navigate to home first, then scroll
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const isActiveLink = (href: string, isRoute: boolean) => {
    if (isRoute) {
      return location.pathname === href;
    }
    return !isRoute && activeSection === href.slice(1) && location.pathname === '/';
  };

  const toggleTheme = () => {
    setTheme(isDarkTheme ? 'light' : 'dark');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-3 shadow-sm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="font-display text-2xl font-bold tracking-tight cursor-pointer relative group"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Portfolio</span>
          <span className="text-primary font-bold">.</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
        </motion.button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const active = isActiveLink(link.href, link.isRoute);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href, link.isRoute);
                  }}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full hover:text-foreground ${
                    active ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={toggleTheme}
              aria-label={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-2xl border-b border-border/50 shadow-xl overflow-hidden"
          >
            <ul className="container mx-auto px-4 py-6 flex flex-col gap-2">
              {navLinks.map((link, index) => {
                const active = isActiveLink(link.href, link.isRoute);
                return (
                  <motion.li 
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link.href, link.isRoute);
                      }}
                      className={`block px-4 py-3 text-lg font-medium transition-colors rounded-xl ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
