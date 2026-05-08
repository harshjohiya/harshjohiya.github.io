import { useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/portfolio/Navbar';
import { Footer } from '@/components/portfolio/Footer';
import { ScrollToTop } from '@/components/portfolio/ScrollToTop';
import { motion } from 'framer-motion';

export default function CV() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <Navbar />

      {/* PDF Viewer */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-32 pb-16 px-4"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Curriculum Vitae
            </h1>
            <p className="text-muted-foreground">My academic and professional journey</p>
          </div>

          {/* Download Button */}
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2 rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            >
              <a href="/cv.pdf" download="Harsh_Johiya_CV.pdf">
                <Download size={16} />
                Download CV
              </a>
            </Button>
          </div>

          <div className="bg-background/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-border/50">
            <iframe
              src="/cv.pdf"
              className="w-full h-[calc(100vh-16rem)]"
              title="CV PDF Viewer"
            />
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            If the PDF doesn't load, you can{' '}
            <a
              href="/cv.pdf"
              download="Harsh_Johiya_CV.pdf"
              className="text-primary hover:underline font-medium"
            >
              download it here
            </a>
            .
          </p>
        </div>
      </motion.main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
