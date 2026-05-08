import { ExternalLink, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';
import { useState } from 'react';

const projects = [
  {
    title: 'RiskLens',
    description: 'AI-powered credit risk assessment platform with real-time scoring and explainable predictions.',
    technologies: ['React', 'TypeScript', 'Python', 'FastAPI', 'LightGBM', 'SHAP', 'Tailwind CSS'],
    github: 'https://github.com/harshjohiya/RiskLens',
    demo: 'https://risklens1.vercel.app',
    image: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Frisklens1.vercel.app?w=1400',
    details: [
      'Built an enterprise-grade credit risk assessment platform with ML models for real-time and batch scoring',
      'Implemented LightGBM model achieving 0.8651 ROC-AUC on 307K+ loan records with class imbalance handling',
      'Integrated SHAP explainability for transparent decision-making with KS statistic of 0.4011',
      'Developed JWT-based authentication, responsive React UI, and FastAPI backend with SQLite database',
      'Created risk scoring system converting Probability of Default to 0-1000 scale with 4 risk bands',
      'Results: Superior discriminative power (LightGBM vs Logistic Regression) with 91.2% improvement in ROC-AUC'
    ]
  },
  {
    title: 'DeepTrust',
    description: 'AI-powered deepfake detection system with explainable predictions and confidence scoring.',
    technologies: ['PyTorch', 'EfficientNet-B0', 'FastAPI', 'React', 'Grad-CAM', 'MediaPipe', 'OpenCV'],
    github: 'https://github.com/harshjohiya/DeepTrust',
    demo: 'https://deeptrust1.vercel.app/',
    image: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fdeeptrust1.vercel.app%2F?w=1400',
    details: [
      'Developed automated deepfake detection for images and videos using EfficientNet-B0 architecture',
      'Implemented Grad-CAM explainability to visualize decision-relevant facial regions influencing predictions',
      'Engineered three-tier classification system (REAL, FAKE, UNCERTAIN) with conservative confidence thresholding',
      'Built face detection and preprocessing pipeline using MediaPipe with 224x224 normalization',
      'Created video processing module with uniform frame sampling and majority voting for temporal consistency',
      'Achieved ~91-92% test accuracy with 93% fake detection recall on Celeb-DF v2 deepfake dataset'
    ]
  },
  {
    title: 'HindiASR',
    description: 'End-to-end Hindi ASR fine-tuning with Whisper model and comprehensive error analysis.',
    technologies: ['Python', 'Whisper', 'PyTorch', 'Transformers', 'Pandas', 'Scikit-learn'],
    github: 'https://github.com/harshjohiya/HindiASR',
    demo: undefined,
    details: [
      'Fine-tuned OpenAI Whisper-small model for in-domain Hindi speech recognition on conversational data',
      'Built data acquisition and preprocessing pipeline with text cleaning, train/val splits, and audio segmentation',
      'Created comprehensive error analysis with taxonomy classification, stratified sampling, and pattern detection',
      'Implemented post-processing techniques: number normalization, English word detection, and lattice-style scoring',
      'Performed baseline vs fine-tuned evaluation with WER metric comparison on validation segments',
      'Delivered detailed error analysis with actionable insights for model improvement and linguistic patterns'
    ]
  },
  {
    title: 'Food Delivery Time Prediction',
    description: 'Full-stack web application predicting food delivery time using ML regression models.',
    technologies: ['FastAPI', 'React', 'TypeScript', 'Scikit-learn', 'Tailwind CSS', 'Vite'],
    github: 'https://github.com/harshjohiya/Food-Delivery-Time-Prediction',
    demo: undefined,
    details: [
      'Built end-to-end application predicting delivery times using trained scikit-learn regression model',
      'Implemented Haversine formula for real-time distance calculation between restaurant and delivery locations',
      'Created production-ready FastAPI backend with Pydantic validation, CORS support, and comprehensive error handling',
      'Developed modern React UI with TypeScript and Tailwind CSS for intuitive user interaction',
      'Engineered features including delivery person age/ratings, order type, vehicle type, and location coordinates',
      'Results: Accurate ETA predictions enabling logistics optimization and improved customer experience estimation'
    ]
  },
];

const githubProfileUrl = 'https://github.com/harshjohiya';

export function Projects() {
  const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>({});

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
    <section
      id="projects"
      className="section-padding bg-muted/20 relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

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
              Featured Projects
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
              A selection of projects showcasing my skills in AI, data science, and web development
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {projects.map((project) => {
              const hasImage = Boolean(project.image) && !imageLoadError[project.title];
              return (
              <motion.div
                key={project.title}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group glass-card rounded-2xl overflow-hidden bg-background/60 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Project Image Placeholder */}
                <div className="h-56 bg-gradient-to-br from-primary/10 via-background to-primary/5 relative overflow-hidden border-b border-border/50">
                  {hasImage ? (
                    <img
                      src={project.image}
                      alt={`${project.title} hero section`}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={() =>
                        setImageLoadError((prev) => ({
                          ...prev,
                          [project.title]: true,
                        }))
                      }
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,hsl(var(--primary)/0.1)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-[shimmer_2s_infinite]" />
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="font-display text-6xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors duration-500">
                          {project.title[0]}
                        </span>
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="font-display text-2xl font-bold mb-4 text-foreground/90 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-base mb-6 font-light leading-relaxed">
                    {project.description}
                  </p>

                  {project.details && (
                    <ul className="mb-6 space-y-2 text-xs text-muted-foreground leading-relaxed">
                      {project.details.slice(0, 3).map((detail) => (
                        <li key={detail} className="flex gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-xs font-medium bg-secondary/50 text-secondary-foreground border border-border/50"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl hover:bg-primary hover:text-primary-foreground border-border/50 hover:border-primary transition-all duration-300"
                      asChild
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github size={18} className="mr-2" />
                        Code
                      </a>
                    </Button>
                    {project.demo && (
                      <Button
                        className="flex-1 rounded-xl bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all duration-300"
                        asChild
                      >
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink size={18} className="mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
            })}
          </div>

          <motion.div
            variants={itemVariants}
            className="flex justify-center mt-16"
          >
            <Button size="lg" asChild className="px-10 py-6 rounded-full text-lg shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-shadow">
              <a href={githubProfileUrl} target="_blank" rel="noopener noreferrer">
                <Github size={20} className="mr-2" />
                Explore More Projects
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
