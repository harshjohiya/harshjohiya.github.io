import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-muted-foreground text-sm flex items-center gap-1.5">
            Built with 
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <Heart className="w-4 h-4 text-destructive fill-destructive" />
            </motion.span>
            by Harsh
          </p>
          <p className="text-muted-foreground/60 text-xs">
            © {currentYear} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
