import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaSave, FaCheck, FaMoon, FaSun, FaPalette } from 'react-icons/fa';
import { useUser } from '../Contexts/UserContext';
import Navbar from '../Components/Navbar/Navbar';
import axios from 'axios';

const SettingsPage = () => {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    darkMode: true,
    notifications: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('profile');

  // Function to evaluate password strength
  const getPasswordStrength = (password) => {
    if (!password) return 'Weak';
    
    let score = 0;
    
    // Length check
    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    // Return strength based on score
    if (score >= 4) return 'Strong';
    if (score >= 2) return 'Medium';
    return 'Weak';
  };

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        username: user.username || '',
        email: user.email || '',
        github: user.socialLinks?.github || '',
        linkedin: user.socialLinks?.linkedin || '',
        twitter: user.socialLinks?.twitter || '',
        website: user.socialLinks?.website || '',
        darkMode: user.preferences?.darkMode !== undefined ? user.preferences.darkMode : true,
        notifications: user.preferences?.notifications !== undefined ? user.preferences.notifications : true
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const profileData = {
        username: formData.username,
        email: formData.email,
        socialLinks: {
          github: formData.github,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          website: formData.website
        },
        preferences: {
          darkMode: formData.darkMode,
          notifications: formData.notifications
        }
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      updateUser(response.data);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: error.response?.data?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setMessage({ text: 'Password updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ text: error.response?.data?.message || 'Failed to update password', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 mb-8 text-center"
          >
            Account Settings
          </motion.h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:w-1/4"
            >
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl shadow-lg border border-indigo-900/30 p-4">
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center space-x-2 p-3 rounded-lg transition-all ${
                      activeTab === 'profile' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <FaUser />
                    <span>Profile Settings</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center space-x-2 p-3 rounded-lg transition-all ${
                      activeTab === 'security' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <FaLock />
                    <span>Security</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('preferences')}
                    className={`flex items-center space-x-2 p-3 rounded-lg transition-all ${
                      activeTab === 'preferences' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <FaGlobe />
                    <span>Preferences</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:w-3/4"
            >
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl shadow-lg border border-indigo-900/30 p-6">
                {/* Message Display */}
                {message.text && (
                  <div className={`mb-6 p-4 rounded-lg ${
                    message.type === 'success' 
                      ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 border border-emerald-500/30 text-emerald-300' 
                      : 'bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/30 text-red-300'
                  }`}>
                    <div className="flex items-center">
                      {message.type === 'success' ? <FaCheck className="mr-2" /> : null}
                      {message.text}
                    </div>
                  </div>
                )}

                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate}>
                    <motion.h2 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-6 flex items-center"
                    >
                      <FaUser className="mr-2 text-blue-400" />
                      Profile Information
                    </motion.h2>
                    
                    <div className="space-y-6">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-5 rounded-xl border border-indigo-900/30 shadow-lg"
                      >
                        <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-4">Basic Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-300 mb-2 flex items-center">
                              <FaUser className="mr-2 text-indigo-400" />
                              Username
                            </label>
                            <div className="relative group">
                              <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-3 pl-4 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner group-hover:border-indigo-500/70 transition-all"
                              />
                              <motion.div 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaUser />
                              </motion.div>
                            </div>
                          </div>
                      
                          <div>
                            <label className="block text-gray-300 mb-2 flex items-center">
                              <FaEnvelope className="mr-2 text-indigo-400" />
                              Email
                            </label>
                            <div className="relative group">
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 pl-4 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner group-hover:border-indigo-500/70 transition-all"
                              />
                              <motion.div 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaEnvelope />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-5 rounded-xl border border-indigo-900/30 shadow-lg"
                      >
                        <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-4 flex items-center">
                          <FaGlobe className="mr-2 text-indigo-400" />
                          Social Links
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-300 mb-2 flex items-center">
                              <FaGithub className="mr-2 text-gray-400" />
                              GitHub
                            </label>
                            <div className="relative group">
                              <input
                                type="text"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                                className="w-full p-3 pl-4 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner group-hover:border-indigo-500/70 transition-all"
                              />
                              <motion.div 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaGithub />
                              </motion.div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-gray-300 mb-2 flex items-center">
                              <FaLinkedin className="mr-2 text-gray-400" />
                              LinkedIn
                            </label>
                            <div className="relative group">
                              <input
                                type="text"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/username"
                                className="w-full p-3 pl-4 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner group-hover:border-indigo-500/70 transition-all"
                              />
                              <motion.div 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaLinkedin />
                              </motion.div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-gray-300 mb-2 flex items-center">
                              <FaTwitter className="mr-2 text-gray-400" />
                              Twitter
                            </label>
                            <div className="relative group">
                              <input
                                type="text"
                                name="twitter"
                                value={formData.twitter}
                                onChange={handleChange}
                                placeholder="https://twitter.com/username"
                                className="w-full p-3 pl-4 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner group-hover:border-indigo-500/70 transition-all"
                              />
                              <motion.div 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaTwitter />
                              </motion.div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-gray-300 mb-2 flex items-center">
                              <FaGlobe className="mr-2 text-gray-400" />
                              Personal Website
                            </label>
                            <div className="relative group">
                              <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://yourwebsite.com"
                                className="w-full p-3 pl-4 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner group-hover:border-indigo-500/70 transition-all"
                              />
                              <motion.div 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaGlobe />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-lg shadow-lg border border-indigo-900/30 transition-all transform hover:scale-[1.02] flex items-center justify-center"
                      whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)' }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Updating Profile...</span>
                        </div>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          <span>Save Profile</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <form onSubmit={handlePasswordUpdate}>
                    <motion.h2 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-6 flex items-center"
                    >
                      <FaLock className="mr-2 text-blue-400" />
                      Security Settings
                    </motion.h2>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-5 rounded-xl border border-indigo-900/30 shadow-lg"
                    >
                      <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-4 flex items-center">
                        <FaLock className="mr-2 text-indigo-400" />
                        Change Password
                      </h3>
                      <p className="text-gray-400 mb-4 text-sm">Strong passwords use a combination of letters, numbers, and special characters</p>
                      
                      <div className="space-y-4">
                        <div className="relative group">
                          <label className="block text-gray-300 mb-2 flex items-center">
                            <FaLock className="mr-2 text-gray-400" />
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleChange}
                              className="w-full p-3 pl-4 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner group-hover:border-indigo-500/70 transition-all"
                              required
                            />
                            <motion.div 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaLock />
                            </motion.div>
                          </div>
                        </div>
                        
                        <div className="relative group">
                          <label className="block text-gray-300 mb-2 flex items-center">
                            <FaLock className="mr-2 text-gray-400" />
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                              className="w-full p-3 pl-4 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner group-hover:border-indigo-500/70 transition-all"
                              required
                            />
                            <motion.div 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaLock />
                            </motion.div>
                          </div>
                          {formData.newPassword && (
                            <div className="mt-2">
                              <div className="flex items-center space-x-2">
                                <div className={`h-1 flex-1 rounded ${formData.newPassword.length > 8 ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                                <div className={`h-1 flex-1 rounded ${/[A-Z]/.test(formData.newPassword) ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                                <div className={`h-1 flex-1 rounded ${/[0-9]/.test(formData.newPassword) ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                                <div className={`h-1 flex-1 rounded ${/[^A-Za-z0-9]/.test(formData.newPassword) ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Password strength: {' '}
                                <span className={`${getPasswordStrength(formData.newPassword) === 'Strong' ? 'text-emerald-400' : 
                                  getPasswordStrength(formData.newPassword) === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                                  {getPasswordStrength(formData.newPassword)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="relative group">
                          <label className="block text-gray-300 mb-2 flex items-center">
                            <FaLock className="mr-2 text-gray-400" />
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="w-full p-3 pl-4 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner group-hover:border-indigo-500/70 transition-all"
                              required
                            />
                            <motion.div 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaLock />
                            </motion.div>
                          </div>
                          {formData.newPassword && formData.confirmPassword && (
                            <div className="mt-2 text-xs">
                              {formData.newPassword === formData.confirmPassword ? (
                                <span className="text-emerald-400 flex items-center">
                                  <FaCheck className="mr-1" /> Passwords match
                                </span>
                              ) : (
                                <span className="text-red-400">Passwords do not match</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    <motion.button
                      type="submit"
                      disabled={loading || (formData.newPassword !== formData.confirmPassword)}
                      className={`mt-6 w-full py-4 rounded-lg shadow-lg border border-indigo-900/30 transition-all transform hover:scale-[1.02] flex items-center justify-center ${formData.newPassword !== formData.confirmPassword ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'}`}
                      whileHover={{ scale: formData.newPassword !== formData.confirmPassword ? 1 : 1.02, boxShadow: formData.newPassword !== formData.confirmPassword ? 'none' : '0 10px 15px -3px rgba(79, 70, 229, 0.2)' }}
                      whileTap={{ scale: formData.newPassword !== formData.confirmPassword ? 1 : 0.98 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Updating Password...</span>
                        </div>
                      ) : (
                        <>
                          <FaLock className="mr-2" />
                          <span>Update Password</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}

                {/* Preferences */}
                {activeTab === 'preferences' && (
                  <form onSubmit={handleProfileUpdate}>
                    <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-6">User Preferences</h2>
                    
                    <div className="space-y-4">
                      <motion.div 
                        className={`flex flex-col p-6 rounded-xl shadow-lg border ${formData.darkMode ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-indigo-900/30' : 'bg-gradient-to-br from-gray-100 to-white border-gray-300'}`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <motion.div 
                              animate={{ rotate: formData.darkMode ? 360 : 0 }}
                              transition={{ duration: 0.5 }}
                              className="mr-3 text-xl"
                            >
                              {formData.darkMode ? 
                                <FaMoon className="text-indigo-300" /> : 
                                <FaSun className="text-yellow-400" />}
                            </motion.div>
                            <div>
                              <h3 className={`font-medium text-lg ${formData.darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300' : 'text-gray-800'}`}>
                                {formData.darkMode ? 'Dark Mode' : 'Light Mode'}
                              </h3>
                              <p className={`text-sm ${formData.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {formData.darkMode ? 'Currently using dark theme' : 'Switch to dark theme for coding at night'}
                              </p>
                            </div>
                          </div>
                          
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              name="darkMode"
                              checked={formData.darkMode} 
                              onChange={handleChange}
                              className="sr-only peer" 
                            />
                            <div className={`w-14 h-7 rounded-full relative transition-all duration-300 ease-in-out ${formData.darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-300'}`}>
                              <motion.div 
                                className={`absolute top-1 w-5 h-5 rounded-full shadow-md transition-all ${formData.darkMode ? 'right-1 bg-white' : 'left-1 bg-white'}`}
                                layout
                                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                              />
                            </div>
                          </label>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className={`text-sm font-medium mb-2 ${formData.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Theme Preview</h4>
                          <div className={`grid grid-cols-2 gap-2 p-3 rounded-lg ${formData.darkMode ? 'bg-gray-900' : 'bg-gray-100'} border ${formData.darkMode ? 'border-indigo-900/30' : 'border-gray-300'}`}>
                            <div className="space-y-2">
                              <div className={`h-2 w-16 rounded ${formData.darkMode ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500' : 'bg-blue-500'}`}></div>
                              <div className={`h-2 w-12 rounded ${formData.darkMode ? 'bg-indigo-600' : 'bg-blue-400'}`}></div>
                              <div className={`h-2 w-20 rounded ${formData.darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                            </div>
                            <div className="flex justify-end">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-blue-500'}`}>
                                <FaPalette className="text-white text-xs" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <div className="flex items-center justify-between p-4 bg-indigo-900/30 rounded-lg border border-indigo-700/50">
                        <div>
                          <h3 className="font-medium text-white">Notifications</h3>
                          <p className="text-sm text-gray-400">Receive notifications about contests and team activities</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="notifications"
                            checked={formData.notifications} 
                            onChange={handleChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600"></div>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-lg shadow-lg border border-indigo-900/30 transition-all transform hover:scale-[1.02] flex items-center justify-center"
                    >
                      {loading ? (
                        <span className="animate-pulse">Saving...</span>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          <span>Save Preferences</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
