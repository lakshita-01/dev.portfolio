import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import SkillsRadar from './components/SkillsRadar';
import Timeline from './components/Timeline';
import AchievementsAndCertifications from './components/AchievementsAndCertifications';
import AIChat from './components/AIChat';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import { ThemeProvider } from './context/ThemeContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function Home() {
  const [onlineCount, setOnlineCount] = useState(1);

  useEffect(() => {
    socket.on('visitor_update', (data) => {
      setOnlineCount(data.online);
    });
    
    // Handle hash scroll on mount
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }

    return () => socket.off('visitor_update');
  }, []);

  return (
    <div className="relative pb-20">
      <Hero />
      <div className="max-w-6xl mx-auto px-6 space-y-32">
        <SkillsRadar />
        <Timeline />
        <AchievementsAndCertifications />
        <Projects />
      </div>
      <AIChat />
      <div className="fixed bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-white/60">
        <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2 animate-pulse"></span>
        {onlineCount} people viewing portfolio right now
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-vibrant-lightBg dark:bg-vibrant-darkBg transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/AIChat" element={<AIChat />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
