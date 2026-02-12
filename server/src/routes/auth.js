const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../utils/logger');
const nodemailer = require('nodemailer');
require('dotenv').config();

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

  console.log('[Book Call] Request received:', { date, time, recruiterName, recruiterEmail });

  try {
    if (!date || !time || !purpose || !recruiterName || !recruiterEmail) {
      console.log('[Book Call] Missing fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (emailUser && emailPassword && emailUser !== 'your-email@gmail.com') {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: emailUser, pass: emailPassword }
        });

        await transporter.verify();
        console.log('[Book Call] Email verified');

        await transporter.sendMail({
          from: emailUser,
          to: recruiterEmail,
          subject: 'Call Scheduled with Lakshita Gupta',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Call Confirmed! 🎉</h2>
              <p>Hi ${recruiterName},</p>
              <p>Your call with Lakshita Gupta has been scheduled:</p>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Date:</strong> ${bookingDate.toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Duration:</strong> ${duration} minutes</p>
                <p><strong>Purpose:</strong> ${purpose}</p>
              </div>
              <p>Best regards,<br>Lakshita Gupta</p>
            </div>
          `
        });

        await transporter.sendMail({
          from: emailUser,
          to: 'lakshitagupta9@gmail.com',
          subject: `New Call - ${recruiterName}`,
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h2>New Call Booked 📞</h2>
              <p><strong>Name:</strong> ${recruiterName}</p>
              <p><strong>Email:</strong> ${recruiterEmail}</p>
              <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Duration:</strong> ${duration} minutes</p>
              <p><strong>Purpose:</strong> ${purpose}</p>
            </div>
          `
        });

        console.log('[Book Call] Emails sent successfully');
      } catch (emailError) {
        console.error('[Book Call] Email error:', emailError.message);
      }
    }

    console.log('[Book Call] Success');
    res.status(200).json({
      message: 'Call booked successfully',
      success: true
    });
  } catch (error) {
    console.error('[Book Call] Critical Error:', error);
    res.status(500).json({ 
      message: 'Failed to book call. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    });

    await transporter.verify();

    const testResult = await transporter.sendMail({
      from: emailUser,
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
