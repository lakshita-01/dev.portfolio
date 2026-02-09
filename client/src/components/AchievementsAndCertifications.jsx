import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Medal, Trophy, Star } from 'lucide-react';

const achievements = [
  {
    id: 1,
    type: 'achievement',
    title: '3rd position holder',
    description: 'Won Third position in Hack&Chill Hackathon 2025. Developed a Campus Connect Platform to enhance student engagement and live face detection attendance system.',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
    stats: null,
    date: null
  },
  {
    id: 2,
    type: 'achievement',
    title: 'Recognised Certification in German Language',
    description: 'A1 certification holder in german.',
    icon: Medal,
    color: 'from-purple-500 to-pink-500',
    stats: null,
    date: null
  },
  {
    id: 3,
    type: 'achievement',
    title: 'Open Source Contributions',
    description: 'Actively contributed to major open-source projects including React, Node.js, and FastAPI ecosystems.',
    icon: Award,
    color: 'from-green-500 to-emerald-500',
    stats: null,
    date: null
  },
  {
    id: 4,
    type: 'achievement',
    title: 'Participant',
    description: 'Participant in the GDG on Campus Solution Challenge powered by Hack2Skill.',
    icon: Star,
    color: 'from-blue-500 to-cyan-500',
    stats: null,
    date: null
  }
];

const certifications = [
  {
    id: 1,
    name: 'Oracle Certified Gen AI Professional Certificate',
    issuer: 'Oracle University',
    // credentialUrl: '#',
    badge: '🏆',
    color: 'border-orange-500/50 bg-orange-500/10'
  },
  {
    id: 2,
    name: 'Develop GenAI Apps with Gemini and Streamlit Skill Badge',
    issuer: 'Google Cloud',
    // credentialUrl: '#',
    badge: '☁️',
    color: 'border-blue-500/50 bg-blue-500/10'
  },
  {
    id: 3,
    name: 'Completion Certification for Gen AI Exchange Program by Google Cloud',
    issuer: 'Google Cloud',
    // credentialUrl: '#',
    badge: '🤖',
    color: 'border-purple-500/50 bg-purple-500/10'
  },
  {
    id: 4,
    name: 'Postman API Fundamentals Student Expert certification',
    issuer: 'Postman',
    // credentialUrl: '#',
    badge: '⚙️',
    color: 'border-cyan-500/50 bg-cyan-500/10'
  },
  {
    id: 5,
    name: 'Full-Stack Web Development',
    issuer: 'Udemy',
    // credentialUrl: '#',
    badge: '💻',
    color: 'border-green-500/50 bg-green-500/10'
  },
  {
    id: 6,
    name: 'Machine Learning Specialization',
    issuer: 'Udemy',
    // credentialUrl: '#',
    badge: '📊',
    color: 'border-pink-500/50 bg-pink-500/10'
  }
];

const AchievementsAndCertifications = () => {
  const [activeTab, setActiveTab] = useState('achievements');

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    }
  };

  return (
    <section id="achievements" className="py-20">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <motion.h2
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          Achievements <motion.span
            className="text-accent-primary bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary"
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            & Certifications
          </motion.span>
        </motion.h2>
        <motion.p className="text-white/60 max-w-2xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.2, duration: 0.6 }}>
          Recognition of skills, achievements, and professional milestones throughout my career journey.
        </motion.p>
      </motion.div>

      {/* Tab Buttons */}
      <motion.div className="flex gap-4 justify-center mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.2 }}>
        {['achievements', 'certifications'].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`px-6 py-3 rounded-full font-semibold capitalize transition-all relative overflow-hidden ${
              activeTab === tab ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/50' : 'glass-card text-white/70 hover:text-white'
            }`}
          >
            <motion.div
              layoutId="activeTab"
              className={`absolute inset-0 ${activeTab === tab ? 'bg-accent-primary' : ''}`}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ zIndex: -1 }}
            />
            {tab === 'achievements' ? '🏆 Achievements' : '📜 Certifications'}
          </motion.button>
        ))}
      </motion.div>

      {/* Achievements Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            variants={tabVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative glass-card p-8 border border-white/10 hover:border-accent-primary/50 overflow-hidden"
                >
                  {/* Gradient background on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  <div className="relative z-10">
                    {/* Icon and Stats */}
                    <div className="flex items-start justify-between mb-6">
                      <motion.div
                        className={`p-4 rounded-xl bg-gradient-to-br ${achievement.color} text-white`}
                        animate={{ rotate: [0, 6, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Icon size={28} />
                      </motion.div>
                      <motion.div
                        className="text-right"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.15 }}
                      >
                        <div className={`text-3xl font-black bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent`}>{achievement.stats}</div>
                        <p className="text-xs text-white/60 mt-1">{achievement.date}</p>
                      </motion.div>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-accent-primary transition-colors">{achievement.title}</h3>
                    <p className="text-white/70 leading-relaxed mb-6">{achievement.description}</p>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${achievement.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: false }}
                        transition={{ duration: 1, delay: 0.25 }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certifications Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'certifications' && (
          <motion.div
            key="certifications"
            variants={tabVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                transition={{ delay: index * 0.06 }}
                className={`cursor-pointer glass-card p-6 border-2 ${cert.color} rounded-xl transition-all group hover:shadow-lg`}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="text-4xl mb-4 inline-block"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.15 }}
                >
                  {cert.badge}
                </motion.div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold group-hover:text-accent-primary transition-colors line-clamp-2">{cert.name}</h3>
                  <p className="text-sm text-white/70 flex items-center gap-2"><span>📋</span>{cert.issuer}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AchievementsAndCertifications;
