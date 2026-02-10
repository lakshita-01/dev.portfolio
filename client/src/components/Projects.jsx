import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: "ColdCraftAI",
    desc: "AI-based email optimization tool using NLP to improve engagement and personalization..",
    tech: ["React", "Node", "WebSockets", "MongoDB", "Express", "Tailwind CSS", "Puter.js"],
    img: "/images/coldcraft.jpeg",
    category: "web",
    repo: "https://github.com/lakshita-01/ColdCraftAI.git",
    demo: "https://cold-craft-ai.vercel.app/"
  },
  {
    title: "Employee Attrition Risk Predictor",
    desc: "Healthcare portal utilizing RAG to contextualize patient history for physicians.",
    tech: ["Next.js", "LangChain", "OpenAI"],
    img: "/images/emp-attrition.jpeg",
    category: "ml",
    repo: "https://github.com/lakshita-01/Employee_Attrition_Risk_Analysis.git",
    demo: "https://employee-attrition.vercel.app"
  },
  {
    title: "DevPulse",
    desc: "full-stack SaaS application for task management with secure authentication and scalable APIs..",
    tech: ["Node.js", "Google Maps API", "Redis"],
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    category: "web",
    repo: "https://github.com/lakshita-01/devPulse.git",
    demo: "https://devpulse.vercel.app"
  }
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="max-h-screen overflow-auto">
      <motion.div 
        className="flex justify-between items-end mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <motion.h2 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Featured <motion.span 
              className="text-accent-secondary bg-clip-text text-transparent bg-gradient-to-r from-accent-secondary to-accent-primary"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Creations
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-white/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Solving complex problems with elegant code solutions.
          </motion.p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div className="flex gap-3 justify-center mb-12 flex-wrap" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.2 }}>
        {[
          { id: 'all', label: '🎯 All Projects' },
          { id: 'web', label: '💻 Web Development' },
          { id: 'ml', label: '🤖 ML Projects' }
        ].map((filter) => (
          <motion.button
            key={filter.id}
            onClick={() => setActiveCategory(filter.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`px-6 py-2 rounded-full font-semibold capitalize transition-all relative overflow-hidden text-sm ${
              activeCategory === filter.id ? 'bg-accent-secondary text-white shadow-lg shadow-accent-secondary/50' : 'glass-card text-white/70 hover:text-white'
            }`}
          >
            <motion.div
              layoutId="activeFilter"
              className={`absolute inset-0 ${activeCategory === filter.id ? 'bg-accent-secondary' : ''}`}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ zIndex: -1 }}
            />
            {filter.label}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeCategory}
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
        {filteredProjects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative glass-card p-4 hover:border-accent-primary/50 transition-all cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
            
            <div className="aspect-video rounded-xl overflow-hidden mb-6 relative">
              <motion.img 
                src={project.img} 
                alt={project.title} 
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div 
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-accent-primary rounded-full text-white hover:bg-accent-secondary transition-colors"
                >
                  <ExternalLink size={20} />
                </motion.a>
                <motion.a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-accent-secondary rounded-full text-white hover:bg-accent-primary transition-colors"
                >
                  <Github size={20} />
                </motion.a>
              </motion.div>
            </div>
            
            <motion.h3 
              className="text-xl font-bold mb-2 group-hover:text-accent-primary transition-colors"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              {project.title}
            </motion.h3>
            
            <motion.p 
              className="text-white/60 text-sm mb-6 line-clamp-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.15 }}
            >
              {project.desc}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-2 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
            >
              {project.tech.map((t, idx) => (
                <motion.span 
                  key={t}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ y: [0, -6, 0] }}
                    whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false }}
                  transition={{ delay: 0.2 + idx * 0.05, duration: 4, repeat: Infinity }}
                  whileHover={{ scale: 1.12, rotate: -3 }}
                  className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-white/5 rounded border border-white/5 hover:border-accent-primary/50 transition-colors cursor-default shadow-sm"
                  style={{ boxShadow: '0 6px 18px rgba(99,102,241,0.06)' }}
                >
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    {t}
                  </span>
                </motion.span>
              ))}
            </motion.div>
            
            <motion.div 
              className="flex gap-4 relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.25 }}
            >
              <motion.a 
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5, color: 'rgba(99, 102, 241, 1)' }}
                className="flex items-center gap-1 text-xs font-bold hover:text-accent-primary transition-colors"
              >
                <Github size={14} /> REPO
              </motion.a>
              <motion.a 
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5, color: 'rgba(99, 102, 241, 1)' }}
                className="flex items-center gap-1 text-xs font-bold hover:text-accent-primary transition-colors"
              >
                <ExternalLink size={14} /> DEMO
              </motion.a>
            </motion.div>
          </motion.div>
        ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Projects;
