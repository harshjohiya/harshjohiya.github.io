import { motion, Variants } from 'framer-motion';

const skillCategories = [
  {
    title: 'Programming Languages',
    skills: ['Python', 'SQL', 'C', 'C++'],
  },
  {
    title: 'Machine Learning & Deep Learning',
    skills: ['Scikit-learn', 'TensorFlow', 'Keras', 'PyTorch'],
  },
  {
    title: 'Data Analysis & Visualization',
    skills: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Plotly', 'Tableau', 'Power BI'],
  },
  {
    title: 'Tools & Frameworks',
    skills: ['Jupyter', 'Git', 'GitHub', 'VS Code', 'Colab', 'Streamlit', 'Flask', 'FastAPI', 'CUDA', 'OpenCV'],
  },
];

export function Skills() {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const pillVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 10 }
    },
    hover: {
      scale: 1.05,
      y: -5,
      boxShadow: "0px 5px 15px rgba(var(--primary), 0.3)",
      borderColor: "hsl(var(--primary))",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <section
      id="skills"
      className="section-padding relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.05),transparent_50%)] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.05),transparent_50%)] -z-10" />

      <div className="container mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Skills & Expertise
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
              A comprehensive toolkit built through continuous learning and hands-on experience
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {skillCategories.map((category) => (
              <motion.div
                key={category.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group glass-card rounded-2xl p-8 border border-border/50 border-l-4 border-l-primary shadow-lg bg-background/50 backdrop-blur-md transition-colors hover:bg-muted/30"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground/90">
                    {category.title}
                  </h3>
                </div>
                <motion.div 
                  className="flex flex-wrap gap-3"
                  variants={containerVariants}
                >
                  {category.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={pillVariants}
                      whileHover="hover"
                      className="px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 text-secondary-foreground border border-border/50 backdrop-blur-sm cursor-default flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
