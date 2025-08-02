import React, { useEffect, useState } from "react";
import Ellipse from "../../assets/Ellipse 20@1x.png";
import RectangleTop from "../../assets/Rectangle 3@1x.png";
import RectangleBottom from "../../assets/Rectangle 1@3x.png";
import ProfileCard from "./ProfileCard";
import Leaderboard from "./Leaderboard/Leaderboard";
import StatusGraph from "./StatusGraph";
import { useUser } from "../../Contexts/UserContext";
import { motion } from "framer-motion";
import { FaTrophy, FaCode, FaChartLine, FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [userId, setUserId] = useState("");
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setUserId(user.userId);
    }
  }, [user]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden pt-8 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-blue-500/10 to-green-500/10 blur-3xl animate-pulse-slower"></div>
        
        {/* Static decorative images with improved styling */}
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5 }}
          src={Ellipse}
          alt="Decorative Ellipse"
          className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vh] blur-2xl"
        />
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          src={RectangleTop}
          alt="Decorative Rectangle"
          className="absolute top-[-15%] left-[-5%] w-[40vw] h-[40vh] blur-3xl"
        />
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          src={RectangleBottom}
          alt="Decorative Rectangle"
          className="absolute bottom-[-30%] left-[-10%] w-[50vw] h-[50vh] blur-3xl"
        />
      </div>

      {/* Page Title */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center mb-16 mt-4"
      >
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
          <FaUserCircle className="inline-block mr-3 mb-1" />
          Coder Profile
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Track your progress, view your stats, and connect with other coders</p>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card - Left Column */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 xl:col-span-4"
        >
          <ProfileCard />
        </motion.div>

        {/* Right Column - Stats and Leaderboard */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Status Graph */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-xl shadow-lg border border-indigo-900/30 backdrop-blur-sm"
          >
            <div className="flex items-center mb-4">
              <FaChartLine className="text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">Performance Analytics</h2>
            </div>
            <StatusGraph />
          </motion.div>

          {/* Leaderboard */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-xl shadow-lg border border-indigo-900/30 backdrop-blur-sm"
          >
            <div className="flex items-center mb-4">
              <FaTrophy className="text-yellow-400 mr-2" />
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">Leaderboard</h2>
            </div>
            <Leaderboard />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
