import { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

const roles = [
  'Aspiring Data Scientist',
  'Machine Learning Engineer',
  'AI & Data Science Enthusiast',
  'Problem Solver',
];

export function Hero() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = roles[currentRole];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < role.length) {
            setDisplayText(role.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentRole((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRole]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
        >
          {/* Profile Picture */}
          <motion.div
            variants={itemVariants}
            className="flex-shrink-0"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse-slow" />
              <motion.img
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                src="/me.png"
                alt="Harsh Johiya"
                className="relative w-56 h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-full object-cover border-4 border-background/50 backdrop-blur-sm shadow-[0_0_40px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_60px_rgba(var(--primary),0.3)] transition-all duration-500"
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Greeting */}
            <motion.p variants={itemVariants} className="text-primary font-medium text-xl md:text-2xl mb-4 tracking-wide">
              Hello, I'm
            </motion.p>

            {/* Name */}
            <motion.h1 variants={itemVariants} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Harsh
            </motion.h1>

            {/* Typing Animation */}
            <motion.div variants={itemVariants} className="h-12 md:h-16 flex items-center justify-center lg:justify-start mb-8">
              <span className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-0.5 h-6 md:h-8 bg-primary ml-1 align-middle"
                />
              </span>
            </motion.div>

            {/* Description */}
            <motion.p variants={itemVariants} className="text-muted-foreground/80 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
             I’m passionate about building intelligent digital products that solve real-world problems.
             Focused on creating clean, efficient, and meaningful user experiences through AI and data.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-full bg-primary text-primary-foreground hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:-translate-y-1 transition-all duration-300"
                onClick={() => {
                  if (location.pathname === '/') {
                    scrollToSection('projects');
                  } else {
                    navigate('/#projects');
                  }
                }}
              >
                View Projects
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-full hover:shadow-xl hover:-translate-y-1 hover:bg-foreground hover:text-background transition-all duration-300 backdrop-blur-sm bg-background/50"
                onClick={() => navigate('/cv')}
              >
                Download CV
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.button
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => scrollToSection('about')}
          className="text-muted-foreground hover:text-primary transition-colors duration-300 p-2 rounded-full hover:bg-muted/50"
        >
          <ArrowDown size={28} />
        </motion.button>
      </motion.div>
    </section>
  );
}
