import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../Contexts/UserContext";
import Stats from "./Stats";
import profilePic from "../../assets/profile.png";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEdit, FaMedal, FaCode, FaTrophy, FaUserEdit } from "react-icons/fa";

const ProfileCard = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState({
    contestsParticipated: 0,
    problemsSolved: 0,
    rank: 0,
  });
  const [profile, setProfile] = useState("");
  const [error, setError] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [editGithub, setEditGithub] = useState(false);
  const [editLinkedin, setEditLinkedin] = useState(false);
  const [newGithub, setNewGithub] = useState("");
  const [newLinkedin, setNewLinkedin] = useState("");

  useEffect(() => {
    if (user) {
      const userId = user.userId;

      const fetchUserProfile = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/${userId}`);
          setUserData(response.data.user.statistics);
          setProfile(response.data.user.googleId);
          setGithub(response.data.user.github);
          setLinkedin(response.data.user.linkedin);
        } catch (err) {
          setError("Failed to fetch user data");
        }
      };

      fetchUserProfile();
    }
  }, [user]);

  const saveGithub = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/user/update/${user.userId}`, { github: newGithub });
      setGithub(newGithub);
      setEditGithub(false);
    } catch (error) {
      console.error("Error updating GitHub:", error);
      alert("Failed to update GitHub. Please try again.");
    }
  };

  const saveLinkedin = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/user/update/${user.userId}`, { linkedin: newLinkedin });
      setLinkedin(newLinkedin);
      setEditLinkedin(false);
    } catch (error) {
      console.error("Error updating LinkedIn:", error);
      alert("Failed to update LinkedIn. Please try again.");
    }
  };

  if (!user) {
    return <p className="text-white text-center mt-5">Please log in to view your profile.</p>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-2xl relative p-6 flex flex-col items-center h-full border border-gray-700/50 backdrop-blur-sm"
    >
      {/* Profile Image with Animation */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-md"></div>
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 h-[140px] w-[140px] rounded-full flex items-center justify-center overflow-hidden shadow-lg border-4 border-gray-600/80 relative z-10">
          <img src={profilePic} alt="Profile" className="h-full w-full object-cover" />
          <motion.div 
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 opacity-0 flex items-center justify-center cursor-pointer transition-opacity"
          >
            <FaUserEdit size={30} className="text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* User Name with Gradient */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {user.username}
        </h2>
        <p className="text-gray-400 mt-1">Competitive Coder</p>
      </motion.div>

      {/* User Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="grid grid-cols-3 gap-4 w-full mt-6"
      >
        <div className="bg-gray-800/50 p-3 rounded-lg text-center border border-gray-700/50 shadow-inner">
          <div className="flex justify-center mb-1">
            <FaCode className="text-blue-400" size={18} />
          </div>
          <p className="text-2xl font-bold text-white">{userData.problemsSolved || 0}</p>
          <p className="text-xs text-gray-400">Problems Solved</p>
        </div>
        
        <div className="bg-gray-800/50 p-3 rounded-lg text-center border border-gray-700/50 shadow-inner">
          <div className="flex justify-center mb-1">
            <FaTrophy className="text-yellow-400" size={18} />
          </div>
          <p className="text-2xl font-bold text-white">{userData.contestsParticipated || 0}</p>
          <p className="text-xs text-gray-400">Contests</p>
        </div>
        
        <div className="bg-gray-800/50 p-3 rounded-lg text-center border border-gray-700/50 shadow-inner">
          <div className="flex justify-center mb-1">
            <FaMedal className="text-purple-400" size={18} />
          </div>
          <p className="text-2xl font-bold text-white">#{userData.rank || '-'}</p>
          <p className="text-xs text-gray-400">Global Rank</p>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex mt-6 space-x-4 w-full justify-center"
      >
        {/* GitHub */}
        <div className="flex flex-col items-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a href={github} target="_blank" rel="noopener noreferrer" className="w-full">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg border border-gray-700/50 flex items-center space-x-2 hover:shadow-blue-500/20 transition-all duration-300">
                <FaGithub className="text-blue-400" size={20} />
                <span>GitHub</span>
              </div>
            </a>
          </motion.div>
          
          {editGithub ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex flex-col items-center w-full"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={newGithub}
                  onChange={(e) => setNewGithub(e.target.value)}
                  className="p-2 pl-4 pr-10 bg-gray-700 text-white rounded-lg w-full outline-none border border-blue-500/30 focus:border-blue-500 transition-all"
                  placeholder="Enter GitHub URL"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    onClick={saveGithub} 
                    className="text-green-400 hover:text-green-300"
                    title="Save"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditGithub(false)} 
                    className="text-red-400 hover:text-red-300"
                    title="Cancel"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => { setEditGithub(true); setNewGithub(github); }} 
              className="mt-2 text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1 transition-all"
            >
              <FaEdit size={12} />
              <span>Edit</span>
            </motion.button>
          )}
        </div>

        {/* LinkedIn */}
        <div className="flex flex-col items-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-full">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg border border-gray-700/50 flex items-center space-x-2 hover:shadow-purple-500/20 transition-all duration-300">
                <FaLinkedin className="text-purple-400" size={20} />
                <span>LinkedIn</span>
              </div>
            </a>
          </motion.div>
          
          {editLinkedin ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex flex-col items-center w-full"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={newLinkedin}
                  onChange={(e) => setNewLinkedin(e.target.value)}
                  className="p-2 pl-4 pr-10 bg-gray-700 text-white rounded-lg w-full outline-none border border-purple-500/30 focus:border-purple-500 transition-all"
                  placeholder="Enter LinkedIn URL"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    onClick={saveLinkedin} 
                    className="text-green-400 hover:text-green-300"
                    title="Save"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditLinkedin(false)} 
                    className="text-red-400 hover:text-red-300"
                    title="Cancel"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => { setEditLinkedin(true); setNewLinkedin(linkedin); }} 
              className="mt-2 text-sm text-purple-400 hover:text-purple-300 flex items-center space-x-1 transition-all"
            >
              <FaEdit size={12} />
              <span>Edit</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Additional Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-6 w-full"
      >
        <Stats />
      </motion.div>
    </motion.div>
  );
};

export default ProfileCard;
