const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const logger = require('../config/logger');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register new user
exports.signup = async (req, res) => {
  logger.info(`Signup request received: ${JSON.stringify(req.body)}`);
  
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    logger.warn(`Signup failed: Missing required fields - Username: ${!!username}, Email: ${!!email}, Password: ${!!password}`);
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  logger.info(`Signup attempt for email: ${email}`);

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      logger.warn(`Signup failed: User with email ${email} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({ username, email, password: hashedPassword });
    
    logger.info(`Attempting to save user: ${username} (${email})`);
    await user.save();
    logger.info(`User created successfully: ${username} (${email})`);

    // Create JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    logger.info(`JWT token created for user: ${username}`);
    res.status(201).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    logger.error(`Signup error for ${email}: ${error.message}`);
    logger.error(`Error stack: ${error.stack}`);
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  logger.info(`Login attempt for email: ${email}`);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: No user found with email ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid password for user ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    logger.info(`User logged in successfully: ${user.username} (${email})`);

    // Create JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    logger.error(`Login error for ${email}: ${error.message}`);
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;
  
  logger.info('Google login attempt received');
  
  try {
    // Verify Google token ID
    logger.info('Verifying Google token ID');
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();  // Extract user info from the token
    logger.info(`Google authentication successful for: ${payload.email}`);

    // Check if the user already exists in the database
    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      logger.info(`Creating new user for Google account: ${payload.email}`);
      // If the user doesn't exist, create a new user
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        username: payload.name,
        password: await bcrypt.hash(payload.sub + process.env.JWT_SECRET, 10), // More secure password
        picture: payload.picture || '',  // Optional, if you want to store the user's picture
      });

      // Save the new user to the database
      await user.save();
      logger.info(`New Google user created: ${payload.name} (${payload.email})`);
    } else {
      logger.info(`Existing Google user found: ${user.username} (${user.email})`);
    }

    // Create JWT token
    const payload_ = { userId: user._id };
    const token = jwt.sign(payload_, process.env.JWT_SECRET, { expiresIn: '1h' });

    logger.info(`Google user logged in successfully: ${user.username} (${user.email})`);
    res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    logger.error(`Google login error: ${error.message}`);
    console.error(error);
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
};
