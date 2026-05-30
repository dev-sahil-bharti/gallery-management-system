const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./src/app');

// Determine port
const PORT = process.env.PORT || 5000;

// Start listening
const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 StudioGallery Backend running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});

// Handle graceful shutdowns
const shutdown = () => {
  console.log('Stopping server gracefully...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
