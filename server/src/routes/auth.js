const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../utils/logger');
const brevo = require('@getbrevo/brevo');
require('dotenv').config();

// Initialize Brevo
let brevoApi;
if (process.env.BREVO_API_KEY) {
  brevoApi = new brevo.TransactionalEmailsApi();
  brevoApi.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
  logger.info('Brevo initialized');
} else {
  logger.warn('Brevo API key not configured');
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recruiterEmail)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const bookingDate = new Date(`${date}T${time}`);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date or time format' });
    }

    if (!brevoApi) {
      logger.error('[Book Call] Brevo not configured');
      return res.status(500).json({ message: 'Email service not configured. Please contact admin.' });
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { email: 'lakshitagupta9@gmail.com', name: 'Lakshita Gupta' };
    sendSmtpEmail.to = [
      { email: recruiterEmail, name: recruiterName },
      { email: 'lakshitagupta9@gmail.com', name: 'Lakshita Gupta' }
    ];
    sendSmtpEmail.subject = 'Call Scheduled with Lakshita Gupta';
    sendSmtpEmail.htmlContent = `
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
        <p>Looking forward to connecting with you!</p>
        <p>Best regards,<br>Lakshita Gupta<br>📧 lakshitagupta9@gmail.com</p>
      </div>
    `;

    try {
      await brevoApi.sendTransacEmail(sendSmtpEmail);
      logger.info('[Book Call] Emails sent successfully via Brevo');
      res.status(200).json({
        message: 'Call booked successfully! Check your email for confirmation.',
        success: true
      });
    } catch (emailError) {
      logger.error('[Book Call] Brevo error', { error: emailError.message });
      return res.status(500).json({ 
        message: 'Failed to send confirmation emails. Please contact directly at lakshitagupta9@gmail.com'
      });
    }
  } catch (error) {
    logger.error('[Book Call] Critical Error', { error: error.message });
    return res.status(500).json({ 
      message: 'Failed to book call. Please try again.'
    });
  }
});

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    if (!brevoApi) {
      return res.status(400).json({
        success: false,
        message: 'Brevo API key not configured.'
      });
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { email: 'lakshitagupta9@gmail.com', name: 'Portfolio Test' };
    sendSmtpEmail.to = [{ email: 'lakshitagupta9@gmail.com' }];
    sendSmtpEmail.subject = 'Test Email from Portfolio';
    sendSmtpEmail.htmlContent = '<h1>Email service is working!</h1>';

    await brevoApi.sendTransacEmail(sendSmtpEmail);

    res.json({
      success: true,
      message: 'Test email sent successfully via Brevo'
    });
  } catch (error) {
    logger.error('Test email error', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
