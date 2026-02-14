import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Terminal, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import HireModal from './HireModal';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenHireModal = () => setIsHireModalOpen(true);
    window.addEventListener('openHireModal', handleOpenHireModal);
    return () => window.removeEventListener('openHireModal', handleOpenHireModal);
  }, []);

  const handleNavClick = (e, id) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, null, `#${id}`);
      }
    }
  };

  const navLinks = [
    { label: 'Stack', id: 'skills' },
    { label: 'Experience', id: 'experience' },
    { label: 'Awards', id: 'achievements' },
    { label: 'Projects', id: 'projects' },
    { label: 'Admin', path: '/admin' }
  ];

  const socialIcons = [
    { icon: Github, href: 'https://github.com' },
    { icon: Linkedin, href: 'https://linkedin.com' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 border-b border-vibrant-light-purple/20 dark:border-vibrant-neon-cyan/20 bg-vibrant-lightBg/80 dark:bg-vibrant-darkBg/80 backdrop-blur-md shadow-lg shadow-vibrant-light-purple/5 dark:shadow-vibrant-neon-purple/5 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter group">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Terminal className="text-vibrant-light-purple dark:text-vibrant-neon-purple group-hover:text-vibrant-light-pink dark:group-hover:text-vibrant-neon-pink transition-colors" />
            </motion.div>
            <span className="bg-gradient-to-r from-vibrant-light-purple to-vibrant-light-pink dark:from-vibrant-neon-purple dark:via-vibrant-neon-pink dark:to-vibrant-neon-cyan bg-clip-text text-transparent">DEV<span className="text-vibrant-light-purple dark:text-vibrant-neon-cyan">.</span>PORTFOLIO</span>
          </Link>
        </motion.div>
        
        <motion.div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-white/70 transition-colors"
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          {navLinks.map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {link.path ? (
                <Link to={link.path} className="relative group">
                  <span className="group-hover:text-vibrant-light-purple dark:group-hover:text-vibrant-neon-cyan transition-colors">{link.label}</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-vibrant-light-purple to-vibrant-light-pink dark:from-vibrant-neon-purple dark:to-vibrant-neon-cyan"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ) : (
                <Link 
                  to={`/#${link.id}`} 
                  onClick={(e) => handleNavClick(e, link.id)}
                  className="relative group"
                >
                  <span className="group-hover:text-vibrant-light-purple dark:group-hover:text-vibrant-neon-cyan transition-colors">{link.label}</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-vibrant-light-purple to-vibrant-light-pink dark:from-vibrant-neon-purple dark:to-vibrant-neon-cyan"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="flex items-center gap-4">
          {socialIcons.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={i}
                href={item.href}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-vibrant-light-purple/10 dark:hover:bg-vibrant-neon-purple/20 rounded-lg transition-colors text-gray-700 dark:text-white hover:text-vibrant-light-purple dark:hover:text-vibrant-neon-cyan"
              >
                <Icon size={20} />
              </motion.a>
            );
          })}
          
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-vibrant-light-purple/10 dark:hover:bg-vibrant-neon-purple/20 rounded-lg transition-all text-gray-700 dark:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={20} className="text-vibrant-neon-orange" />
            ) : (
              <Moon size={20} className="text-vibrant-light-purple" />
            )}
          </motion.button>
          
          <motion.button 
            onClick={() => setIsHireModalOpen(true)}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block px-5 py-2 bg-gradient-to-r from-vibrant-light-purple to-vibrant-light-pink dark:from-vibrant-neon-purple dark:to-vibrant-neon-pink hover:opacity-90 rounded-full text-sm font-semibold transition-all shadow-lg shadow-vibrant-light-purple/20 dark:shadow-vibrant-neon-purple/20 text-white"
          >
            Hire Me
          </motion.button>

          <HireModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
