const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require("http");
const initializeSocket = require("./config/socket");
const logger = require('./config/logger');

dotenv.config();

const app = express();
const server = http.createServer(app);
initializeSocket(server); // Pass the server instance for Socket.IO initialization

// Middleware
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow both localhost formats
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow cookies if needed
  })
);

// Log CORS configuration
logger.info(`CORS configured to allow origins: http://localhost:3000, http://127.0.0.1:3000`);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    logger.info('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    logger.error(`MongoDB connection error: ${err.message}`);
  });

// Routes
const contestRoutes = require('./routes/contestRoutes');
const teamRoutes = require('./routes/teamRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const codeStatmentRoutes=require('./routes/codeStatementsRoutes')
const healthRoutes = require('./routes/healthRoutes')

app.use('/api/contest', contestRoutes);
app.use('/api/contest', teamRoutes); 
app.use('/api/codestatment',codeStatmentRoutes)
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/health',healthRoutes)

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  logger.info(`Server started and running on port ${process.env.PORT}`);
});
