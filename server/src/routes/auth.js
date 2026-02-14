const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../utils/logger');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  pool: false, // Explicitly disable pooling to avoid callback issues
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter on startup
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_USER !== 'your-email@gmail.com') {
  (async () => {
    try {
      await transporter.verify();
      logger.info('Email transporter ready');
    } catch (error) {
      logger.warn('Email transporter verification failed - emails will be skipped', { error: error.message });
    }
  })();
}

router.post('/login', [
  body('username').trim().isLength({ min: 3, max: 50 }).isAlphanumeric(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.security('Login validation failed', { errors: errors.array(), ip: req.ip });
    return res.status(400).json({ message: 'Invalid input' });
  }

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      logger.security('Login attempt for non-existent user', { username, ip: req.ip });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked) {
      logger.security('Login attempt on locked account', { username, ip: req.ip });
      return res.status(423).json({ message: 'Account is temporarily locked due to too many failed attempts' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      logger.security('Failed login attempt', { username, ip: req.ip, attempts: user.loginAttempts + 1 });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d', issuer: 'ai-portfolio', audience: 'user' }
    );

    logger.auth('Successful login', { username, ip: req.ip });
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    logger.error('Login error', { error: err.message, ip: req.ip });
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .isAlphanumeric()
    .withMessage('Username must be 3-50 characters and contain only letters and numbers'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Registration validation failed', { errors: errors.array(), ip: req.ip });
    return res.status(400).json({ message: 'Invalid input', errors: errors.array() });
  }

  const { username, password } = req.body;
  try {
    // Additional validation using Joi
    const { error } = User.validateUser({ username, password });
    if (error) {
      logger.warn('Registration Joi validation failed', { error: error.details[0].message, ip: req.ip });
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      logger.warn('Registration attempt for existing username', { username, ip: req.ip });
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = new User({ username: username.toLowerCase(), password });
    await user.save();

    logger.info('New user registered', { username, ip: req.ip });
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    logger.error('Registration error', { error: err.message, ip: req.ip });
    res.status(500).json({ message: 'Server error' });
  }
});

// Book call endpoint
router.post('/book-call', async (req, res) => {
  const { date, time, duration, purpose, recruiterName, recruiterEmail } = req.body;

  logger.info('[Book Call] Request received', { date, time, recruiterName, recruiterEmail });

  try {
    if (!date || !time || !purpose || !recruiterName || !recruiterEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recruiterEmail)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const bookingDate = new Date(`${date}T${time}`);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date or time format' });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    // We respond to the client early to improve UX, but we also want to ensure we try to send emails
    res.status(200).json({
      message: 'Call booking initiated successfully',
      success: true
    });

    if (emailUser && emailPassword && emailUser !== 'your-email@gmail.com') {
      const recruiterMailOptions = {
        from: `"Lakshita Gupta" <${emailUser}>`,
        to: recruiterEmail,
        replyTo: emailUser,
        subject: 'Call Scheduled with Lakshita Gupta',
        text: `Hi ${recruiterName},\n\nYour call with Lakshita Gupta has been scheduled for ${bookingDate.toLocaleDateString()} at ${time} (${duration} minutes).\n\nPurpose: ${purpose}\n\nA calendar invitation is attached.\n\nBest regards,\nLakshita Gupta`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #6366f1;">Call Confirmed! 🎉</h2>
            <p>Hi ${recruiterName},</p>
            <p>Your call with Lakshita Gupta has been scheduled:</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6366f1;">
              <p><strong>Date:</strong> ${bookingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Duration:</strong> ${duration} minutes</p>
              <p><strong>Purpose:</strong> ${purpose}</p>
            </div>
            <p>A calendar invitation has been attached to this email.</p>
            <p>Best regards,<br>Lakshita Gupta</p>
          </div>
        `,
        alternatives: [{
          contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
          content: Buffer.from(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Lakshita Gupta//NONSGML Event//EN
METHOD:REQUEST
BEGIN:VEVENT
UID:${Date.now()}@lakshitagupta.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${bookingDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DURATION:PT${duration}M
SUMMARY:Call with Lakshita Gupta: ${purpose}
DESCRIPTION:Call to discuss: ${purpose}
ORGANIZER;CN="Lakshita Gupta":mailto:${emailUser}
ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN="${recruiterName}":mailto:${recruiterEmail}
END:VEVENT
END:VCALENDAR`)
        }]
      };

      const adminMailOptions = {
        from: emailUser,
        to: emailUser, // Send to the account owner
        subject: `New Call Scheduled - ${recruiterName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #06b6d4;">New Call Booked 📞</h2>
            <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #06b6d4;">
              <p><strong>Name:</strong> ${recruiterName}</p>
              <p><strong>Email:</strong> ${recruiterEmail}</p>
              <p><strong>Date:</strong> ${bookingDate.toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Duration:</strong> ${duration} minutes</p>
              <p><strong>Purpose:</strong> ${purpose}</p>
            </div>
          </div>
        `
      };

      // Send emails in background with timeout
      Promise.race([
        Promise.all([
          transporter.sendMail(recruiterMailOptions),
          transporter.sendMail(adminMailOptions)
        ]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), 30000))
      ]).then(() => {
        logger.info('[Book Call] Emails sent successfully');
      }).catch(emailError => {
        logger.warn('[Book Call] Email failed or timed out', { error: emailError.message });
      });
    } else {
      logger.warn('[Book Call] Email credentials not configured properly');
    }
  } catch (error) {
    logger.error('[Book Call] Critical Error', { error: error.message });
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Failed to book call. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (emailUser === 'your-email@gmail.com' || emailPassword === 'your-app-password') {
      return res.status(400).json({
        success: false,
        message: 'Email credentials not configured. Please update .env file with valid Gmail credentials.'
      });
    }

    await transporter.verify();

    const testResult = await transporter.sendMail({
      from: `"Portfolio Test" <${emailUser}>`,
      to: 'lakshitagupta9@gmail.com',
      subject: 'Test Email from Portfolio',
      html: '<h1>Email service is working!</h1>'
    });

    res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: testResult.messageId
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
