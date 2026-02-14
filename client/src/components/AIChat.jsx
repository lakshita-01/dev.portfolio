import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';

const AIChat = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(location.pathname === '/AIChat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm Lakshita's AI Assistant. Ask me about her experience, skills, or projects!" }
  ]);
  const [loading, setLoading] = useState(false);
  const [resumeContent, setResumeContent] = useState('');
  const scrollRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const CHAT_ENDPOINT = `${API_URL}/api/chat/query`;
  const RESUME_ENDPOINT = `${API_URL}/api/chat/resume`;

  useEffect(() => {
    // Fetch resume content for fallback
    const fetchResume = async () => {
      try {
        const res = await axios.get(RESUME_ENDPOINT);
        if (res.data && res.data.text) {
          setResumeContent(res.data.text);
        }
      } catch (err) {
        console.warn("Failed to fetch resume for fallback:", err);
      }
    };
    fetchResume();
  }, [RESUME_ENDPOINT]);

  useEffect(() => {
    if (scrollRef.current && scrollRef.current.lastElementChild) {
      scrollRef.current.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openChat', handleOpen);

    // Auto-click "Continue" on Puter popups/modals in the background
    const autoClickPuter = () => {
      // Find Puter's "Continue" button - often in an iframe or modal
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        if (text.includes('continue') || text.includes('guest') || text.includes('allow')) {
          // If it looks like a Puter modal button, click it
          if (btn.closest('[class*="puter"]') || btn.closest('[id*="puter"]') || 
              window.getComputedStyle(btn).zIndex > 1000) {
            btn.click();
          }
        }
      });
      
      // Inject CSS to hide Puter's UI elements
      if (!document.getElementById('hide-puter-ui')) {
        const style = document.createElement('style');
        style.id = 'hide-puter-ui';
        style.innerHTML = `
          [id*="puter-modal"], [class*="puter-modal"], 
          iframe[src*="puter.com"], .puter-auth-modal {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            z-index: -9999 !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    const interval = setInterval(autoClickPuter, 1000);

    return () => {
      window.removeEventListener('openChat', handleOpen);
      clearInterval(interval);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Try Backend RAG first
      try {
        const res = await axios.post(CHAT_ENDPOINT, { message: userMsg });
        if (res.data && res.data.reply && !res.data.reply.includes("demo mode")) {
          setMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
          setLoading(false);
          return;
        }
      } catch (backendErr) {
        console.warn("Backend AI failed, falling back to client-side summary:", backendErr);
      }

      // Fallback to Puter AI with full context if backend fails or is in demo mode
      const prompt = `You are an expert AI Portfolio Assistant representing Lakshita Gupta.
        
        RESUME CONTENT:
        ${resumeContent || `
        - Education: B.Tech CSE at GGSIPU (2023-2027), CGPA: 8.5
        - Experience: Full-Stack Developer with expertise in React/Vite, Node.js, Express, and REST API design.
        - Skills: C++, Python, JavaScript, React, Node.js, Express, MongoDB, PostgreSQL, TensorFlow, NLP, ML/DL
        - Projects: Project Management SaaS, SaaS Cold Email Optimizer, Employee Attrition Risk Analysis
        - Awards: 3rd place Hack&Chill Hackathon, Open-source contributor (Gssoc'25, OSCG'26), GDG Solution Challenge Participant
        - Certifications: A1 German Language, Google Cloud, AWS, TensorFlow Developer
        - Looking for: Full-time/Internship roles as ML Engineer, Software Engineer, or Full-stack Developer.
        - Contact: lakshitagupta9@gmail.com, Delhi, India.
        `}
        
        RULES:
        - Answer ONLY from this resume content
        - If info not available, say: "That information is not in the resume. Contact Lakshita at lakshitagupta9@gmail.com"
        - Be concise and professional
        - Do NOT suggest drafting services or portfolio improvements
        
        User Question: ${userMsg}`;

      const response = await window.puter.ai.chat(prompt);
      setMessages(prev => [...prev, { role: 'ai', content: response.toString() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I hit a snag. Please try again later!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] glass-card shadow-2xl overflow-hidden flex flex-col border-white/20"
          >
            {/* Header */}
            <div className="p-4 bg-accent-primary flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Bot />
                <div>
                  <h3 className="font-bold leading-none">Portfolio AI</h3>
                  <span className="text-[10px] text-white/80">Always Knowledgeable</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100 dark:bg-slate-900/50">
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`p-2 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-accent-primary' : 'bg-slate-200 dark:bg-white/10'}`}>
                        {m.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-slate-600 dark:text-white" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-accent-primary text-white rounded-tr-none' : 'bg-white dark:bg-white/10 text-slate-800 dark:text-white/90 rounded-tl-none border border-slate-200 dark:border-white/10'}`}>
                        {m.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <div className="flex gap-2 animate-pulse">
                  <div className="p-2 rounded-full h-8 w-8 bg-slate-200 dark:bg-white/10" />
                  <div className="p-3 rounded-2xl bg-white dark:bg-white/10 h-10 w-24" />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-dark/50">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full glass-input text-sm text-slate-800 dark:text-white bg-white dark:bg-transparent"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading}
                  className="bg-accent-primary p-2 rounded-xl hover:scale-105 active:scale-95 transition-all text-white"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 bg-accent-primary rounded-full shadow-2xl flex items-center justify-center text-white relative group"
      >
        <div className="absolute inset-0 bg-accent-primary rounded-full animate-ping opacity-25 group-hover:opacity-40" />
        {isOpen ? <X /> : <MessageSquare size={28} />}
      </motion.button>
    </div>
  );
};

export default AIChat;
