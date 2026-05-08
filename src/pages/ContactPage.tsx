import { useState } from 'react';
import { Github, Linkedin, Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/portfolio/Navbar';
import { Footer } from '@/components/portfolio/Footer';
import { ScrollToTop } from '@/components/portfolio/ScrollToTop';
import { motion, Variants } from 'framer-motion';

// Get your access key from https://web3forms.com
const WEB3FORMS_ACCESS_KEY = '01fa1bc8-bf29-44b1-9ad6-666e1b144c29';

const socialLinks = [
  { icon: Github, href: 'https://github.com/harshjohiya', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/harsh-johiya', label: 'LinkedIn' },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('access_key', WEB3FORMS_ACCESS_KEY);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Message sent!',
          description: "Thank you for reaching out. I'll get back to you soon!",
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <Navbar />
      <ScrollToTop />
      
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-grow pt-32 pb-16"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Get In Touch
              </h1>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
                Have a project in mind or want to collaborate? I'd love to hear from you!
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Info */}
              <motion.div variants={itemVariants} className="relative">
                <h2 className="font-display text-3xl font-bold mb-6 text-foreground/90">
                  Let's create something amazing together
                </h2>
                <p className="text-muted-foreground mb-10 text-lg font-light leading-relaxed">
                  Whether you have a question, a project idea, or just want to connect, 
                  feel free to reach out. I'm always open to discussing new opportunities 
                  and interesting projects.
                </p>

                {/* Contact Details */}
                <div className="space-y-6 mb-10">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-5 p-4 rounded-2xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 font-medium tracking-wide uppercase">Email</p>
                      <a 
                        href="mailto:johiyaharsh@gmail.com" 
                        className="text-lg font-semibold hover:text-primary transition-colors"
                      >
                        johiyaharsh@gmail.com
                      </a>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-5 p-4 rounded-2xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 font-medium tracking-wide uppercase">Location</p>
                      <p className="text-lg font-semibold">Bhopal, India</p>
                    </div>
                  </motion.div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-sm text-muted-foreground mb-4 font-medium tracking-wide uppercase px-4">Find me on</h3>
                  <div className="flex gap-4 px-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-colors shadow-sm"
                        aria-label={social.label}
                      >
                        <social.icon size={22} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div variants={itemVariants}>
                <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 lg:p-10 border border-border/50 shadow-xl bg-background/60 backdrop-blur-xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-3xl pointer-events-none" />
                  <div className="space-y-6 relative z-10">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground/80">
                        Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-xl h-12"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground/80">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-xl h-12"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground/80">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Your message..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={6}
                        className="bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-xl resize-none p-4"
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-xl text-base shadow-[0_0_15px_rgba(var(--primary),0.2)] hover:shadow-[0_0_25px_rgba(var(--primary),0.4)] transition-shadow"
                        size="lg"
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <>
                            Send Message
                            <Send className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
