import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, Calendar, MapPin, ArrowRight } from 'lucide-react';

const experiences = [
  {
    id: 1,
    company: 'OSCG 26',
    position: 'Open Source Contributor',
    duration: 'Feb 2026',
    location: 'Remote',
    description: 'Contributed to various open source projects',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'PostgreSQL', 'MERN Stack'],
    type: 'past'
  },
  {
    id: 2,
    company: 'Edunet Foundation',
    position: 'Frontend Developer',
    duration: 'Aug 2025 - Sep 2025',
    location: 'Remote',
    description: 'Built front-end interfaces and interactive components for education platforms.',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'PostgreSQL'],
    type: 'past'
  },
  {
    id: 3,
    company: 'Bluestock Fintech',
    position: 'SDE Intern',
    duration: 'Jul 2025 - Aug 2025',
    location: 'Remote',
    description: 'Built full-stack web applications and APIs; implemented features for financial data visualization.',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'Git', 'PostgreSQL', 'MERN Stack', 'REST APIs'],
    type: 'past'
  },
  {
    id: 4,
    company: 'GSSOC',
    position: 'Open Source Contributor',
    duration: 'Jul 2025-Sep 2025',
    location: 'Remote',
    description: 'Contributed to React projects and iterative feature development.',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'Git', 'PostgreSQL', 'MERN Stack', 'REST APIs'],
    type: 'past'
  }
];

const Timeline = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
  };

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const dotY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section id="experience" className="py-20">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <motion.h2
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          Professional <motion.span
            className="text-accent-primary bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary"
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Journey
          </motion.span>
        </motion.h2>
        <motion.p
          className="text-white/60 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          A timeline of my career growth, from early development to leading technical teams.
        </motion.p>
      </motion.div>

      <motion.div
        ref={containerRef}
        className="relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: '0px 0px -200px 0px' }}
      >
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-accent-primary/50 via-accent-secondary/50 to-accent-primary/50" />

        <div className="space-y-12 md:space-y-20">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              variants={itemVariants}
              className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
            >
              {/* Left column: duration */}
              <div className={`md:w-1/2 w-full flex ${index % 2 === 0 ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-6'} justify-center mb-4 md:mb-0`}>
                <motion.div
                  className="text-sm text-accent-primary font-semibold flex items-center gap-2"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.06 }}
                >
                  <Calendar size={14} />
                  {exp.duration}
                </motion.div>
              </div>

              {/* Center: dot */}
              <div className="w-8 flex items-center justify-center">
                <motion.div
                  style={{ y: dotY }}
                  className={`flex items-center justify-center w-4 h-4 rounded-full border-4 ${
                    exp.type === 'current' ? 'border-accent-primary bg-accent-primary shadow-lg shadow-accent-primary/50' : 'border-accent-secondary bg-dark shadow-lg shadow-accent-secondary/30'
                  } relative z-10`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                />
              </div>

              {/* Right column: job card */}
              <div className={`md:w-1/2 w-full flex ${index % 2 === 0 ? 'md:justify-start md:pl-12' : 'md:justify-end md:pr-6'} justify-center`}>
                <motion.div
                  className="glass-card p-6 hover:border-accent-primary/50 transition-all w-full"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.12 }}
                >
                  <h3 className="text-xl font-bold mb-1">{exp.position}</h3>
                  <p className="text-accent-secondary font-semibold mb-2 flex items-center gap-2">
                    <Briefcase size={16} />
                    {exp.company}
                  </p>
                  <p className="text-white/60 text-sm mb-4 flex items-center gap-2">
                    <MapPin size={14} />
                    {exp.location}
                  </p>
                  <p className="text-white/70 mb-4 leading-relaxed">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span key={skill} className="text-xs bg-accent-primary/20 text-accent-primary px-2 py-1 rounded-full border border-accent-primary/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Timeline;
