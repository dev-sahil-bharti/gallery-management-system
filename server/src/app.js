const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================
// Security headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Request logging in development mode
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '50mb' })); // Support larger base64 proof arrays
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==========================================
// ROUTES
// ==========================================
// Simple API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'StudioGallery API'
  });
});

// Fallback 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot find ${req.method} ${req.originalUrl} on this server.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred on our server.' 
      : err.message
  });
});

module.exports = app;
