import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeadCard from './LeadCard';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const [users, setUsers] = useState([]); // Initialize users as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/`);
        
        // Assuming the response contains a 'leaderboard' array
        setUsers(response.data.leaderboard || []); // Ensure it's always an array
        console.log(users)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);



  // Handle loading and error states with animations
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full"
        />
        <span className="ml-3 text-gray-400">Loading leaderboard...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-500/20 text-red-200 p-4 rounded-lg text-center"
      >
        <p>Could not load leaderboard: {error}</p>
        <button 
          className="mt-2 px-4 py-1 bg-red-500/30 hover:bg-red-500/50 rounded-md text-sm transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Leaderboard entries with staggered animation */}
      <div className="overflow-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pr-1">
        {users.length > 0 ? (
          <motion.div className="flex flex-col gap-2">
            {users.map((user, index) => (
              <motion.div
                key={user._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <LeadCard user={user} index={index} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No users found in the leaderboard</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
