import React from 'react';
import UserPic from '../../../assets/user.png';
import { motion } from 'framer-motion';
import { FaCrown, FaMedal, FaTrophy } from 'react-icons/fa';
const LeadCard = ({ user, index }) => {
  // Get rank badge based on position
  const getRankBadge = () => {
    switch(index) {
      case 0:
        return <FaCrown className="text-yellow-300 mr-2" size={18} />;
      case 1:
        return <FaTrophy className="text-gray-300 mr-2" size={16} />;
      case 2:
        return <FaMedal className="text-amber-600 mr-2" size={16} />;
      default:
        return <span className="text-gray-400 font-mono mr-2 w-5 text-center">{index + 1}</span>;
    }
  };

  // Generate gradient based on position
  const getGradient = () => {
    switch(index) {
      case 0:
        return 'from-yellow-600/80 to-yellow-800/80 border-yellow-500/30';
      case 1:
        return 'from-gray-600/80 to-gray-700/80 border-gray-500/30';
      case 2:
        return 'from-amber-700/80 to-amber-900/80 border-amber-600/30';
      default:
        return 'from-gray-800/60 to-gray-900/60 border-gray-700/20';
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full bg-gradient-to-r ${getGradient()} rounded-lg flex items-center p-2 border shadow-md`}
    >
      {/* Rank indicator */}
      <div className="flex items-center justify-center">
        {getRankBadge()}
      </div>
      
      {/* Profile image */}
      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-700 flex-shrink-0 bg-gray-800">
        <img src={UserPic} alt={user.username} className="h-full w-full object-cover" />
      </div>
      
      {/* User info */}
      <div className="flex justify-between items-center w-full ml-3">
        <p className="text-white font-medium truncate">{user.username || 'Anonymous'}</p>
        <div className="flex items-center bg-gray-900/50 px-3 py-1 rounded-full">
          <span className="text-gray-200 font-mono">
            {Math.ceil(user.statistics?.rating) || 0}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default LeadCard;
