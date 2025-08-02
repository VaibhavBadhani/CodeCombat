// controllers/contestController.js
const Contest = require('../models/Contest');
const User = require('../models/User');

// Create a Contest
exports.createContest = async (req, res) => {
  try {
    const { name, description} = req.body;

    // Create a new contest document
    const newContest = new Contest({
      name,
      description,
    });
    
    // Save the contest to the database
    await newContest.save();

    // Respond with the contest details and the generated contest ID (_id)
    res.status(200).json({
      message: 'Contest created successfully!',
      contestId: newContest._id, // MongoDB's auto-generated ObjectId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create contest',
      error: error.message,
    });
  }
};

// Join a contest
exports.joinContest = async (req, res) => {
  try {
    const { contestId } = req.body;

    // Find the contest by its ObjectId (_id)
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Logic for joining the contest (you can add user to contest or team here)

    res.status(200).json({ message: 'Successfully joined contest', contestId: contest._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error joining contest', error: error.message });
  }
};

// Get details of a specific contest
exports.getContestDetails = async (req, res) => {
  try {
    const { contestId } = req.params;

    // Find contest by its ObjectId (_id)
    const contest = await Contest.findById(contestId).populate('teams').populate('teams.members');

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.status(200).json(contest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching contest details' });
  }
};

// Update contest status
exports.updateContestStatus = async (req, res) => {
  try {
    const { contestId, status } = req.body;

    // Find contest by its ObjectId (_id)
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    contest.status = status;
    await contest.save();

    res.status(200).json({ message: 'Contest status updated successfully', contest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating contest status' });
  }
};

// Get all contests
exports.getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find();

    res.status(200).json(contests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching contests' });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const contests = await Contest.aggregate([
      { $unwind: '$teams' },
      { $sort: { 'teams.score': -1 } },
      { $project: { 'teams.teamName': 1, 'teams.score': 1 } },
    ]);

    res.status(200).json(contests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

// End a contest and update statistics
exports.endContest = async (req, res) => {
  try {
    const { contestId } = req.body;

    // Fetch the contest by its ObjectId (_id)
    const contest = await Contest.findById(contestId).populate('teams.members');
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Check if the contest is already completed
    if (contest.status === 'Completed') {
      return res.status(400).json({ message: 'Contest already completed' });
    }

    // Check if the current time has passed the contest end time
    const currentTime = Date.now(); // Get the current time in milliseconds
    if (currentTime < contest.endTime) {
      return res.status(400).json({ message: 'Contest has not ended yet' });
    }

    // If contest has ended, determine the winning team
    let highestScore = -1;
    let winningTeam = null;

    contest.teams.forEach((team) => {
      if (team.score > highestScore) {
        highestScore = team.score;
        winningTeam = team;
      }
    });

    // Mark the contest as completed
    contest.status = 'Completed';
    contest.winningTeam = winningTeam._id;
    await contest.save();

    // Update the user statistics for the winning team
    for (const team of contest.teams) {
      for (const member of team.members) {
        await User.findByIdAndUpdate(member._id, {
          $inc: {
            'statistics.contestsParticipated': 1,
            'statistics.contestsWon': team._id === winningTeam._id ? 1 : 0,
          },
        });
      }
    }

    // Respond with success
    res.status(200).json({
      message: 'Contest ended successfully',
      contest,
      winningTeam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error ending contest', error: error.message });
  }
};
