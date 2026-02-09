import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, BrainCircuit, Sparkles, ArrowRight, Linkedin, Github, Mail, Calendar } from 'lucide-react';
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <section className="relative pt-40 pb-20 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-accent-primary/10 to-transparent blur-3xl rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent-primary rounded-full"
          animate={{
            y: [Math.random() * 200, Math.random() * 400],
            x: [Math.random() * 100, Math.random() * -100],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2
          }}
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%'
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto relative text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent-secondary text-sm font-medium mb-8 cursor-default"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
            <Sparkles size={14} />
          </motion.div>
          <motion.span
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Open for Work
          </motion.span>
        </motion.div>

        <motion.h1 
          className="text-6xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          FROM CONCEPT <motion.span 
            className="text-gradient inline-block"
            animate={{
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              backgroundSize: '200%'
            }}
          >
            TO CREATION
          </motion.span> <br />
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            LET'S MAKE IT HAPPEN.
          </motion.span>
        </motion.h1>

        <motion.p 
          className="max-w-2xl mx-auto text-lg text-white/60 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          A Software/ML Engineer specializing in scalable full-stack/ML architectures, 
          AI integration, and high-performance real-time applications.
        </motion.p>

        <motion.div 
          className="flex flex-wrap items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.button
            onClick={() => {
              const element = document.getElementById('projects');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-dark font-bold rounded-2xl transition-all flex items-center gap-2 relative group overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: [-200, 200] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative z-10 flex items-center gap-2">
              View My Work <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><Code2 size={20} /></motion.div>
            </span>
          </motion.button>

          <motion.button
            onClick={() => window.dispatchEvent(new CustomEvent('openChat'))}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 glass-card font-bold transition-all flex items-center gap-2 group"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Ask My Assistant
            </motion.div>
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <BrainCircuit size={20} />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Let's Connect Button */}
        <motion.button
          onClick={() => setIsPopupOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-16 mx-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <span>Let's Connect</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <ArrowRight size={24} />
          </motion.div>
        </motion.button>
      </div>

      {/* Connect Popup */}
      {isPopupOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsPopupOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Let's Connect!</h3>
            <div className="space-y-4">
              <a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <Linkedin className="text-blue-600" size={24} />
                <span className="text-gray-700 font-medium">LinkedIn</span>
              </a>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Github className="text-white" size={24} />
                <span className="text-gray-700 font-medium">GitHub</span>
              </a>
              <a
                href="mailto:your.email@example.com"
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <Mail className="text-green-600" size={24} />
                <span className="text-gray-700 font-medium">Email</span>
              </a>
              <button
                onClick={() => {
                  setIsPopupOpen(false);
                  window.dispatchEvent(new CustomEvent('openHireModal'));
                }}
                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors w-full"
              >
                <Calendar className="text-purple-600" size={24} />
                <span className="text-gray-700 font-medium">Book a Call</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;