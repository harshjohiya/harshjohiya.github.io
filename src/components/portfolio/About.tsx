import { BookOpen, GraduationCap, School } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const educationItems = [
  {
    icon: GraduationCap,
    title: 'Indian Institute of Science Education and Research, Bhopal',
    details: [
      'BS Engineering Science',
      'August 2024 - April 2028',
    ],
  },
  {
    icon: School,
    title: 'SMB Geeta Sr. Sec. School, Naraingarh',
    details: [
      'Class 12th - Grade: 95.6%',
      'Class 10th - Grade: 100%',
    ],
  },
  {
    icon: BookOpen,
    title: 'Relevant Coursework',
    details: [
      'Data Structures & Algorithms, Introduction to C, Probability & Statistic, Econometric',
    ],
  },
];

export function About() {
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
    <section
      id="about"
      className="section-padding relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 -z-10" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent -z-10" />

      <div className="container mx-auto relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              About Me
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-10" />
              <h3 className="font-display text-2xl md:text-3xl font-semibold mb-6 text-foreground/90">
                Curious about data, ML, and solving real-world problems
              </h3>
              <div className="space-y-6 text-muted-foreground/90 text-lg leading-relaxed font-light">
                <p>
                  I’m a second-year BS Engineering Sciences student at IISER Bhopal, passionate about leveraging data science and machine learning to solve real-world problems. I design intelligent systems, analyze complex datasets, and transform raw data into actionable insights that drive meaningful decisions.
                </p>
                <p>
                 I strongly believe in learning by doing—when an idea comes to mind, I prototype it, test it, and refine it until it works. Through hands-on experimentation and project-based learning, I’ve developed experience in building end-to-end AI solutions, from data collection and model development to evaluation and deployment.
                </p>
              </div>
            </motion.div>

            {/* Education Cards */}
            <motion.div
              variants={containerVariants}
              className="space-y-6 relative"
            >
              
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 mb-8"
              >
                <span className="h-8 w-1.5 rounded-full bg-primary" />
                <h3 className="font-display text-2xl md:text-3xl font-semibold">Education</h3>
              </motion.div>

              {educationItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="glass-card rounded-2xl p-6 border border-border/50 border-l-4 border-l-primary shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur-md relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-display font-semibold text-lg text-foreground/90 leading-tight">
                        {item.title}
                      </h4>
                      {item.details.map((detail) => (
                        <p key={detail} className="text-muted-foreground/80 text-sm md:text-base leading-relaxed">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
