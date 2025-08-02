import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/UserContext";
import Navbar from "../Components/Navbar/Navbar";
import { motion } from "framer-motion";
import { FaUsers, FaPlus, FaSearch, FaUserPlus, FaCode, FaTrophy, FaCalendarAlt, FaUserFriends } from "react-icons/fa";

const TeamsPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    maxMembers: 4,
  });

  // Placeholder data for teams
  const dummyTeams = [
    {
      id: "team1",
      name: "Code Ninjas",
      description: "A team focused on algorithm challenges and competitive programming.",
      members: [
        { id: "user1", name: "Alex Johnson", role: "Leader" },
        { id: "user2", name: "Sarah Chen", role: "Member" },
        { id: "user3", name: "Michael Brown", role: "Member" },
      ],
      contests: [
        { id: "contest1", name: "Algorithm Challenge 2025", date: "2025-08-15" },
      ],
    },
    {
      id: "team2",
      name: "Web Wizards",
      description: "Specializing in web development challenges and hackathons.",
      members: [
        { id: "user4", name: "Emma Wilson", role: "Leader" },
        { id: "user5", name: "David Lee", role: "Member" },
      ],
      contests: [
        { id: "contest2", name: "Web Dev Hackathon", date: "2025-09-10" },
        { id: "contest3", name: "Frontend Challenge", date: "2025-07-30" },
      ],
    },
  ];

  useEffect(() => {
    // In a real application, you would fetch teams from your API
    // For now, we'll use the dummy data
    setTimeout(() => {
      setTeams(dummyTeams);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateTeam = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your API
    const newTeamWithId = {
      id: `team${teams.length + 1}`,
      ...newTeam,
      members: [{ id: user.id, name: user.name || user.email, role: "Leader" }],
      contests: [],
    };
    
    setTeams([...teams, newTeamWithId]);
    setShowCreateModal(false);
    setNewTeam({ name: "", description: "", maxMembers: 4 });
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-6 rounded-xl shadow-lg backdrop-blur-sm">
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-full mr-4 shadow-md"
            >
              <FaUsers className="text-white text-2xl" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">Teams</h1>
              <p className="text-indigo-200">Join or create a team to collaborate and compete</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-indigo-900/30 text-white px-4 py-2 pl-10 rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
              <FaSearch className="absolute left-3 top-3 text-indigo-400" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg border border-indigo-900/30 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center"
            >
              <FaPlus className="mr-2" /> Create Team
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 bg-indigo-400 opacity-30"></div>
                <div className="animate-spin relative rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
              </div>
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl overflow-hidden shadow-lg border border-indigo-900/30 hover:border-indigo-500/50 transition-all backdrop-blur-sm"
                >
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-2">{team.name}</h3>
                    <p className="text-gray-300 mb-5">{team.description}</p>
                    
                    <div className="mb-5">
                      <div className="flex items-center mb-3">
                        <FaUserFriends className="text-indigo-400 mr-2" />
                        <h4 className="text-sm font-semibold text-indigo-200">Members ({team.members.length})</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {team.members.map((member) => (
                          <div 
                            key={member.id}
                            className={`flex items-center ${member.role === "Leader" ? "bg-gradient-to-r from-indigo-600 to-purple-700" : "bg-gray-800/70"} px-3 py-1.5 rounded-full text-sm border ${member.role === "Leader" ? "border-purple-500/30" : "border-indigo-900/30"} shadow-sm`}
                          >
                            <span className={`w-3 h-3 ${member.role === "Leader" ? "bg-yellow-400" : "bg-blue-500"} rounded-full mr-2`}></span>
                            <span className="text-gray-100">{member.name}</span>
                            {member.role === "Leader" && (
                              <span className="ml-1.5 text-yellow-300">★</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {team.contests.length > 0 && (
                      <div className="mb-5">
                        <div className="flex items-center mb-3">
                          <FaTrophy className="text-indigo-400 mr-2" />
                          <h4 className="text-sm font-semibold text-indigo-200">Upcoming Contests</h4>
                        </div>
                        <div className="space-y-2">
                          {team.contests.map((contest) => (
                            <div 
                              key={contest.id}
                              className="flex items-center justify-between bg-indigo-900/30 p-3 rounded-lg text-sm border border-indigo-900/30 hover:border-indigo-500/50 transition-all"
                            >
                              <div className="flex items-center">
                                <FaCalendarAlt className="text-indigo-400 mr-2 text-xs" />
                                <span className="text-gray-200">{contest.name}</span>
                              </div>
                              <span className="text-blue-300 font-mono">{contest.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-6 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/team/${team.id}`)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-sm transition-all shadow-lg border border-indigo-900/30 flex-1"
                      >
                        <FaUsers className="mr-2" />
                        View Team
                      </motion.button>
                      
                      {team.members.some(member => member.id === (user?.id || "")) ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/team/${team.id}/code`)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg text-sm transition-all shadow-lg border border-emerald-700/30 flex-1"
                        >
                          <FaCode className="mr-2" />
                          Code Space
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white rounded-lg text-sm transition-all shadow-lg border border-indigo-900/30 flex-1"
                        >
                          <FaUserPlus className="mr-2" />
                          Join Team
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-10 text-center border border-indigo-900/30 shadow-lg backdrop-blur-sm"
            >
              <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-5 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <FaUsers className="text-6xl text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 mb-3">No teams found</h3>
              <p className="text-indigo-200 mb-8 max-w-md mx-auto">
                {searchQuery ? "No teams match your search criteria." : "You haven't created or joined any teams yet. Create your first team to start collaborating!"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all shadow-lg border border-indigo-900/30"
              >
                <FaPlus className="mr-2" />
                Create Your First Team
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-8 max-w-md w-full border border-indigo-900/30 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-lg shadow-lg mr-4">
                <FaUsers className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">Create New Team</h2>
            </div>
            
            <form onSubmit={handleCreateTeam}>
              <div className="mb-5">
                <label className="block text-indigo-200 mb-2 font-medium">Team Name</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                  className="w-full p-3 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
                  placeholder="Enter a unique team name"
                  required
                />
              </div>
              
              <div className="mb-5">
                <label className="block text-indigo-200 mb-2 font-medium">Description</label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                  className="w-full p-3 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 h-28 shadow-inner"
                  placeholder="Describe your team's focus and goals"
                  required
                />
              </div>
              
              <div className="mb-8">
                <label className="block text-indigo-200 mb-2 font-medium">Maximum Members</label>
                <select
                  value={newTeam.maxMembers}
                  onChange={(e) => setNewTeam({...newTeam, maxMembers: parseInt(e.target.value)})}
                  className="w-full p-3 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
                >
                  <option value="2">2 Members</option>
                  <option value="3">3 Members</option>
                  <option value="4">4 Members</option>
                  <option value="5">5 Members</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-all border border-gray-700 shadow-lg"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all shadow-lg border border-indigo-900/30"
                >
                  Create Team
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
