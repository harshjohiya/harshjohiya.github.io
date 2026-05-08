import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const experiences = [
  {
    year: 'Apr 2026 - Present',
    title: 'Quantitative Research Consultant',
    organization: 'WorldQuant (Part-time)',
    description: [
      'Part-time Quantitative Research Consultant at WorldQuant.',
    ],
    type: 'work',
  },
  
  {
    year: 'May 2025 - Jan 2026',
    title: 'AI Internship',
    organization: 'Baseraa (Remote)',
    description: [
      'Trained and fine-tuned YOLOv8 object detection models on large annotated datasets using PyTorch, improving defect detection accuracy across diverse scenes.',
      'Designed an end-to-end ML pipeline integrating detection, segmentation (SAM), and reconstruction, achieving 87% accuracy in damage removal.',
      'Implemented a 3D Gaussian Splatting pipeline for real-time scene reconstruction, optimizing GPU/CPU inference to reduce rendering latency by 30%.',
      'Tech Stack: Python, PyTorch, OpenCV, YOLOv8, SAM, LaMa, Stable Diffusion, NumPy, pandas, 3DGS',
    ],
    type: 'intern',  
  },
  
];

export function Experience() {
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-padding"
    >
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div
            className={cn(
              'text-center mb-16 transition-all duration-700',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              My Journey
            </h2>
            <div className="w-20 h-1 bg-foreground mx-auto rounded-full mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A timeline of education, experience, and key milestones in my development journey
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {experiences.map((experience, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div
                    key={index}
                    className={cn(
                      'relative transition-all duration-700',
                      isVisible ? 'opacity-100' : 'opacity-0',
                      isVisible && isLeft ? 'translate-x-0' : '',
                      isVisible && !isLeft ? 'translate-x-0' : '',
                      !isVisible && isLeft ? '-translate-x-8' : '',
                      !isVisible && !isLeft ? 'translate-x-8' : ''
                    )}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div
                      className={cn(
                        'md:w-1/2 pl-8 md:pl-0',
                        isLeft ? 'md:pr-12' : 'md:ml-auto md:pl-12'
                      )}
                    >
                      {/* Timeline Dot */}
                      <div
                        className={cn(
                          'absolute left-0 md:left-1/2 w-4 h-4 rounded-full border-4 border-background bg-foreground -translate-x-1/2 md:-translate-x-1/2',
                          'top-1'
                        )}
                      />

                      {/* Content Card */}
                      <div className="glass-card rounded-xl p-6 hover-lift">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-display text-2xl font-bold">
                            {experience.year}
                          </span>
                          <span
                            className={cn(
                              'text-xs font-medium px-2 py-1 rounded-full',
                              experience.type === 'education'
                                ? 'bg-foreground/10 text-foreground'
                                : experience.type === 'work'
                                ? 'bg-foreground/20 text-foreground'
                                : 'bg-foreground/5 text-muted-foreground'
                            )}
                          >
                            {experience.type}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-semibold mb-1">
                          {experience.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {experience.organization}
                        </p>
                        {Array.isArray(experience.description) ? (
                          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {experience.description.map((point, pointIndex) => (
                              <li key={pointIndex}>{point}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">
                            {experience.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
