import { Navbar } from '@/components/portfolio/Navbar';
import { Hero } from '@/components/portfolio/Hero';
import { About } from '@/components/portfolio/About';
import { Skills } from '@/components/portfolio/Skills';
import { Projects } from '@/components/portfolio/Projects';
import { Contact } from '@/components/portfolio/Contact';
import { Footer } from '@/components/portfolio/Footer';
import { Preloader } from '@/components/portfolio/Preloader';
import { ScrollToTop } from '@/components/portfolio/ScrollToTop';

const Index = () => {
  return (
    <>
      <Preloader />
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
      <ScrollToTop />
    </>
  );
};

export default Index;
