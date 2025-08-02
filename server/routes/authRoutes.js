const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const logger = require('../config/logger');

// Log all auth requests
router.use((req, res, next) => {
  logger.info(`Auth request: ${req.method} ${req.originalUrl}`);
  logger.info(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

// Test endpoint to verify API connection
router.get('/test', (req, res) => {
  logger.info('Test endpoint hit!');
  console.log('Test endpoint hit!');
  return res.status(200).json({ message: 'Auth API is working!' });
});

router.post('/signup', authController.signup);  // Sign up a new user
router.post('/login', authController.login);  // Login user
router.post('/google', authController.googleLogin);  // Google authentication

module.exports = router;
