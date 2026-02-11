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
  const scrollRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const CHAT_ENDPOINT = `${API_URL}/api/chat/query`;

  useEffect(() => {
    if (scrollRef.current && scrollRef.current.lastElementChild) {
      scrollRef.current.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openChat', handleOpen);

    // Preload/Warm up Puter AI (as fallback)
    if (window.puter) {
      window.puter.ai.chat("Hi").catch(() => {});
    }

    return () => window.removeEventListener('openChat', handleOpen);
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
        console.warn("Backend AI failed, falling back to Puter:", backendErr);
      }

      // Fallback to Puter AI with full context if backend fails or is in demo mode
      const response = await window.puter.ai.chat(
        `You are an expert AI Portfolio Assistant representing Lakshita Gupta.
        
        RESUME SUMMARY:
        - Education: B.Tech CSE at GGSIPU (2023-2027), CGPA: 8.5
        - Experience: SDE Intern at Bluestock Fintech, Frontend Developer at Edunet Foundation
        - Skills: C++, Python, JavaScript, React, Node.js, Express, MongoDB, PostgreSQL, TensorFlow, PyTorch, NLP, ML/DL
        - Projects: SaaS Cold Email Optimizer, Project Management Dashboard, Employee Attrition Risk Analysis (82.7% accuracy)
        - Awards: 3rd place Hack&Chill Hackathon, Open-source contributor (Gssoc'25, OSCG'26), GDG Solution Challenge participant
        - Certifications: A1 German, Google Cloud, AWS, TensorFlow Developer
        - lakshita is looking for roles like ml engineer or software engineer or web developer(frontend/backend/fullstack) roles for fulltime/internship.
        
        RULES:
        - Answer ONLY from this resume content
        - If info not available, say: "That information is not in the resume. Contact Lakshita at lakshitagupta9@gmail.com"
        - Be concise and professional
        - Do NOT suggest drafting services or portfolio improvements
        
        User Question: ${userMsg}`
      );
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
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
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
                      <div className={`p-2 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-accent-primary' : 'bg-white/10'}`}>
                        {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-accent-primary text-white rounded-tr-none' : 'bg-white/10 text-white/90 rounded-tl-none border border-white/10'}`}>
                        {m.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <div className="flex gap-2 animate-pulse">
                  <div className="p-2 rounded-full h-8 w-8 bg-white/10" />
                  <div className="p-3 rounded-2xl bg-white/10 h-10 w-24" />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-dark/50">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full glass-input text-sm"
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
