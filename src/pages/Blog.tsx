import { Navbar } from '@/components/portfolio/Navbar';
import { Footer } from '@/components/portfolio/Footer';
import { ScrollToTop } from '@/components/portfolio/ScrollToTop';
import { motion } from 'framer-motion';

export default function Blog() {
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
        className="pt-32 pb-16"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Blog
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-4" />
            <p className="text-muted-foreground text-lg">Thoughts, learnings, and experiences</p>
          </div>
          
          <motion.article 
            whileHover={{ y: -5 }}
            className="border border-border/50 rounded-2xl p-8 md:p-10 bg-background/60 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10" />
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
              <span className="px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium">Post 01</span>
              <span className="text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                March 2026
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-8 leading-tight text-foreground/90 group-hover:text-primary transition-colors">
              Training a Deep Learning Model on a Personal GPU Is Humbling
            </h2>

            <div className="space-y-6 text-muted-foreground/90 leading-relaxed font-light text-lg">
              <p>
                Training a deep learning model on a personal GPU is humbling.
              </p>
              <p>
                I spent hours debugging why my training kept crashing before a single step ran.
              </p>
              <p>
                The culprit? I was trying to load 4,000+ audio arrays into RAM simultaneously. My machine just said no.
              </p>
              <p>
                The fix was simple in hindsight: save each processed segment to disk as a <code className="bg-muted px-1.5 py-0.5 rounded text-primary">.npy</code> file and load one at a time during training. Memory usage dropped from crashing to barely noticeable.
              </p>
              <p className="font-semibold text-foreground/90 text-xl mt-8">But here&apos;s what I actually learned:</p>

              <ol className="space-y-4 pl-6 list-decimal text-foreground/80 marker:text-primary marker:font-bold">
                <li className="pl-2">
                  <span className="font-medium">MemoryError</span> doesn&apos;t mean your model is wrong. It means your data pipeline is wrong.
                </li>
                <li className="pl-2">The training loop is the last thing you should debug. Fix the data loading first.</li>
                <li className="pl-2">On a 4GB GPU, every architectural decision is a negotiation.</li>
              </ol>

              <div className="p-6 mt-8 rounded-xl bg-primary/5 border-l-4 border-primary">
                <p className="text-foreground font-medium text-xl italic">
                  "Small GPUs teach you to be a better engineer than big ones ever will."
                </p>
              </div>
            </div>
          </motion.article>
        </div>
      </motion.main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
