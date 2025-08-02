const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contestController');

// Route to create a contest
router.post('/create', contestController.createContest);

// Route to get all available contests
router.get('/all', contestController.getAllContests);

// Route to join a contest by ID
router.get('/:contestId/join', contestController.joinContest);

// Get a specfic contest 
router.get('/:contestId/', contestController.getContestDetails);


module.exports = router;
