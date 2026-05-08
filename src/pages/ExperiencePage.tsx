import { Experience } from '@/components/portfolio/Experience';
import { Footer } from '@/components/portfolio/Footer';
import { Navbar } from '@/components/portfolio/Navbar';
import { ScrollToTop } from '@/components/portfolio/ScrollToTop';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const ExperiencePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <Navbar />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-24"
      >
        <Experience />
      </motion.main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ExperiencePage;
