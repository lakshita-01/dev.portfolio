const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const path = require('path');
const logger = require('./src/utils/logger');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const authRoutes = require('./src/routes/auth');
const chatRoutes = require('./src/routes/chat');
const analyticsRoutes = require('./src/routes/analytics');
const { trackVisitor } = require('./src/middleware/analytics');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.security('Rate limit exceeded', { ip: req.ip, url: req.url });
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.security('Auth rate limit exceeded', { ip: req.ip, url: req.url });
    res.status(429).json({ message: 'Too many authentication attempts, please try again later.' });
  }
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ];

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.security('CORS blocked request', { origin, ip: req.ip });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(trackVisitor);

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);

// Socket logic
let onlineUsers = 0;
io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('visitor_update', { online: onlineUsers });

  socket.on('disconnect', () => {
    onlineUsers--;
    io.emit('visitor_update', { online: onlineUsers });
  });
});

// Attach io to request object
app.set('socketio', io);

// Environment validation
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  logger.error('Missing required environment variables', { missingVars });
  process.exit(1);
}

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('MongoDB Connected Successfully');
    createDefaultAdmin();
  })
  .catch(err => {
    logger.error('MongoDB Connection Error', { error: err.message });
    process.exit(1);
  });

const User = require('./src/models/User');

const createDefaultAdmin = async () => {
  try {
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      const newUser = new User({ username: 'admin', password: 'AdminPass123!', role: 'admin' });
      await newUser.save();
      logger.info('Default admin user created with secure password');
    }
  } catch (err) {
    logger.error('Error creating default admin user', { error: err.message });
  }
};


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { environment: process.env.NODE_ENV || 'development' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});
