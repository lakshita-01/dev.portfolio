import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Copy, Calendar, Clock, FileText, Users } from 'lucide-react';

const HireModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('options'); // 'options', 'email', 'booking', 'success'
  const [emailCopied, setEmailCopied] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '30',
    purpose: '',
    recruiterName: '',
    recruiterEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = 'lakshitagupta9@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookCall = async () => {
    // Validate all fields
    if (!bookingData.date || !bookingData.time || !bookingData.purpose || !bookingData.recruiterName || !bookingData.recruiterEmail) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call backend API to create Google Calendar event
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/auth/book-call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: bookingData.date,
          time: bookingData.time,
          duration: bookingData.duration,
          purpose: bookingData.purpose,
          recruiterName: bookingData.recruiterName,
          recruiterEmail: bookingData.recruiterEmail
        })
      });

      if (response.ok) {
        const data = await response.json();
        setStep('success');
        setTimeout(() => {
          onClose();
          setStep('options');
          setBookingData({
            date: '',
            time: '',
            duration: '30',
            purpose: '',
            recruiterName: '',
            recruiterEmail: ''
          });
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to book call. Please try again.');
      }
    } catch (error) {
      console.error('Error booking call:', error);
      alert('Failed to book call. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 min-h-screen">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-50 w-full max-w-lg bg-gradient-to-br from-slate-900 to-slate-800 p-8 border border-white/20 shadow-2xl rounded-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>            {/* Content */}
            <AnimatePresence mode="wait">
              {step === 'options' && (
                <motion.div
                  key="options"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Get In Touch</h2>
                    <p className="text-white/60">Choose how you'd like to connect with me</p>
                  </div>

                  <div className="space-y-4">
                    {/* Email Option */}
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('email')}
                      className="w-full p-4 glass-card border border-accent-primary/30 hover:border-accent-primary/70 rounded-xl transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent-primary/20 rounded-lg group-hover:bg-accent-primary/30 transition-colors">
                          <Mail size={20} className="text-accent-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white mb-1">Send Email</h3>
                          <p className="text-sm text-white/60">Direct email communication</p>
                        </div>
                      </div>
                    </motion.button>

                    {/* Book Call Option */}
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('booking')}
                      className="w-full p-4 glass-card border border-accent-secondary/30 hover:border-accent-secondary/70 rounded-xl transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent-secondary/20 rounded-lg group-hover:bg-accent-secondary/30 transition-colors">
                          <Calendar size={20} className="text-accent-secondary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white mb-1">Book a Call</h3>
                          <p className="text-sm text-white/60">Schedule via Google Calendar</p>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setStep('options')}
                    className="text-accent-primary hover:text-accent-secondary transition-colors text-sm"
                  >
                    ← Back
                  </button>

                  <div>
                    <h2 className="text-2xl font-bold mb-2">Email Me</h2>
                    <p className="text-white/60">Reach out directly for any inquiries</p>
                  </div>

                  <motion.div
                    whileHover={{ borderColor: 'rgba(99, 102, 241, 0.7)' }}
                    className="p-4 glass-card border border-white/20 rounded-xl transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="text-accent-primary" size={20} />
                        <span className="font-mono text-sm break-all">{email}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyEmail}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Copy size={18} className={emailCopied ? 'text-green-400' : 'text-white'} />
                      </motion.button>
                    </div>
                  </motion.div>

                  {emailCopied && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-400 text-sm text-center"
                    >
                      ✓ Email copied to clipboard!
                    </motion.p>
                  )}

                  <motion.a
                    href={`mailto:${email}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full py-3 bg-accent-primary text-white font-semibold rounded-xl text-center hover:bg-accent-primary/90 transition-colors"
                  >
                    Open Email Client
                  </motion.a>
                </motion.div>
              )}

              {step === 'booking' && (
                <motion.div
                  key="booking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setStep('options')}
                    className="text-accent-secondary hover:text-accent-primary transition-colors text-sm"
                  >
                    ← Back
                  </button>

                  <div>
                    <h2 className="text-2xl font-bold mb-2">Schedule a Call</h2>
                    <p className="text-white/60">I'll send you a Google Calendar invite</p>
                  </div>

                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* Recruiter Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Name</label>
                      <input
                        type="text"
                        name="recruiterName"
                        value={bookingData.recruiterName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full glass-input text-white bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/50 outline-none transition-all"
                      />
                    </div>

                    {/* Recruiter Email */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Email</label>
                      <input
                        type="email"
                        name="recruiterEmail"
                        value={bookingData.recruiterEmail}
                        onChange={handleInputChange}
                        placeholder="recruiter@company.com"
                        className="w-full glass-input text-white bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/50 outline-none transition-all"
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Calendar size={16} />
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={bookingData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full glass-input text-white bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/50 outline-none transition-all"
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock size={16} />
                        Time
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={bookingData.time}
                        onChange={handleInputChange}
                        className="w-full glass-input text-white bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/50 outline-none transition-all"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                      <select
                        name="duration"
                        value={bookingData.duration}
                        onChange={handleInputChange}
                        className="w-full glass-input text-white bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/50 outline-none transition-all"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                      </select>
                    </div>

                    {/* Purpose */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <FileText size={16} />
                        Purpose of Call
                      </label>
                      <textarea
                        name="purpose"
                        value={bookingData.purpose}
                        onChange={handleInputChange}
                        placeholder="e.g., Discuss full-stack position, ML project collaboration..."
                        rows="3"
                        className="w-full glass-input text-white bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/50 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(6, 182, 212, 0.9)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBookCall}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-accent-secondary text-white font-semibold rounded-xl hover:bg-accent-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Booking...' : 'Book Call & Send Invite'}
                  </motion.button>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="text-6xl"
                  >
                    🎉
                  </motion.div>

                  <div>
                    <h2 className="text-2xl font-bold mb-2">Thanks for Contacting Lakshita Gupta!</h2>
                    <p className="text-white/60">Your call is booked! 📅</p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 glass-card border border-accent-secondary/30 rounded-xl"
                  >
                    <p className="text-sm text-white/80">
                      📧 Calendar invite sent to {bookingData.recruiterEmail}
                    </p>
                    <p className="text-xs text-white/60 mt-2">
                      You'll also receive a notification once this is confirmed.
                    </p>
                  </motion.div>

                  <p className="text-sm text-white/60">Closing in 3 seconds...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HireModal;
