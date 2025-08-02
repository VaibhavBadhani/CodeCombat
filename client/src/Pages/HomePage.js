import React, { useState, useEffect } from "react";
import HomeTopCard from "../Components/Home/HomeTopCard";
import { useNavigate } from "react-router-dom";
import { useUser } from '../Contexts/UserContext';
import HelpPopup from '../Components/Help/HelpPopup';
import _75 from '../HomeContent/75sheet.pdf';
import DBMS from '../HomeContent/DBMS.pdf';
import SOFT from '../HomeContent/SOFT.pdf';
import DSA from '../HomeContent/DSA.pdf';
import DSA_ from '../HomeContent/DSA_.pdf';
import CN from '../HomeContent/CN.pdf';
import Navbar from "../Components/Navbar/Navbar";
import Ellipse from "../assets/Ellipse 20@1x.png";
import RectangleTop from "../assets/Rectangle 3@1x.png";
import RectangleBottom from "../assets/Rectangle 1@3x.png";

// Import icons
import { FaCode, FaLaptopCode, FaUsers, FaTrophy, FaChevronDown, FaChevronRight } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('featured');
  const [showFaq, setShowFaq] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation effect when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const featuredResources = [
    {
      title: "75 Days DSA Sheet",
      description: "A structured 75-day roadmap to ace DSA with daily questions.",
      buttonLabel: "Download",
      color: "blue",
      fileUrl: _75,
      icon: <FaCode className="text-blue-400 text-2xl" />
    },
    {
      title: "Complete DSA Sheet",
      description: "A comprehensive sheet covering all important DSA topics.",
      buttonLabel: "Download",
      color: "purple",
      fileUrl: DSA,
      icon: <FaLaptopCode className="text-purple-400 text-2xl" />
    },
    {
      title: "DSA Roadmap",
      description: "Step-by-step guidance to understand and master DSA.",
      buttonLabel: "Download",
      color: "green",
      fileUrl: DSA_,
      icon: <FaChevronRight className="text-green-400 text-2xl" />
    },
  ];

  const coreSubjects = [
    {
      title: "Design and Analysis of Algorithms",
      buttonLabel: "Handwritten Notes",
      color: "pink",
      description: "Complete handwritten notes of Design and Analysis of Algorithms.",
      fileUrl: DSA,
      icon: <FaCode className="text-pink-400 text-2xl" />
    },
    {
      title: "Operating System",
      buttonLabel: "Handwritten Notes",
      color: "yellow",
      description: "Complete handwritten notes of Operating System.",
      fileUrl: SOFT,
      icon: <FaLaptopCode className="text-yellow-400 text-2xl" />
    },
    {
      title: "Computer Networks",
      buttonLabel: "Handwritten Notes",
      color: "indigo",
      description: "Complete handwritten notes of Computer Networks.",
      fileUrl: CN,
      icon: <FaUsers className="text-indigo-400 text-2xl" />
    },
    {
      title: "Database Management Systems",
      buttonLabel: "Handwritten Notes",
      color: "red",
      description: "Complete handwritten notes of Database Management System.",
      fileUrl: DBMS,
      icon: <FaTrophy className="text-red-400 text-2xl" />
    },
  ];
  
  const faqs = [
    {
      question: "How do I join a coding contest?",
      answer: "Navigate to the Contests section, select an upcoming contest, and click the 'Register' button. You'll receive details about the contest schedule and rules."
    },
    {
      question: "How does the team formation work?",
      answer: "You can create a team by going to the Teams section and clicking 'Create Team'. Invite other users by their username or email. Teams can participate in collaborative contests together."
    },
    {
      question: "What programming languages are supported?",
      answer: "CodeCombat supports multiple languages including JavaScript, Python, Java, C++, and more. You can select your preferred language when solving problems."
    },
    {
      question: "How is my rating calculated?",
      answer: "Your rating is calculated based on your performance in contests, the difficulty of problems you solve, and your consistency. Participate in more contests to improve your rating!"
    }
  ];

  const toggleFaq = (index) => {
    setShowFaq(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleStartCoding = () => {
    navigate('/practice');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <Navbar />
      
      {/* Hero Section with Animation */}
      <div className={`relative w-full overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Background Decorations */}
        <img
          src={Ellipse}
          alt="decorative ellipse"
          className="absolute bottom-0 -right-40 w-[1200px] opacity-20 animate-pulse"
        />
        <img
          src={RectangleTop}
          alt="top rectangle"
          className="absolute -top-[60%] -left-[15%] w-[900px] opacity-30 animate-float"
        />
        <img
          src={RectangleBottom}
          alt="bottom rectangle"
          className="absolute -bottom-[80%] -left-[10%] w-[1100px] opacity-30 animate-float-slow"
        />
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 mb-6 animate-fade-in">
                Master Coding Challenges
              </h1>
              <p className="text-xl text-gray-300 mb-8 animate-fade-in-delay">
                Join CodeCombat to improve your coding skills, compete in challenges, and collaborate with other developers in a fun, interactive environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
                <button 
                  onClick={handleStartCoding}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg border border-indigo-900/30"
                >
                  Start Coding
                </button>
                {!user && (
                  <button 
                    onClick={() => navigate('/signup')}
                    className="px-8 py-3 bg-transparent border-2 border-purple-500 text-purple-400 font-bold rounded-lg hover:bg-purple-500/10 transition-all transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-30 animate-pulse"></div>
                <div className="relative bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-gray-400 text-sm">code_challenge.js</div>
                  </div>
                  <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                    <code>
{`function findMaxSubarraySum(arr) {
  let maxSoFar = arr[0];
  let maxEndingHere = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    maxEndingHere = Math.max(
      arr[i], 
      maxEndingHere + arr[i]
    );
    maxSoFar = Math.max(
      maxSoFar, 
      maxEndingHere
    );
  }
  
  return maxSoFar;
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 flex-grow relative z-10">
        {/* Tabs Navigation */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-800 p-1 rounded-lg inline-flex">
            <button 
              onClick={() => setActiveTab('featured')} 
              className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'featured' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Featured Resources
            </button>
            <button 
              onClick={() => setActiveTab('subjects')} 
              className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'subjects' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Core Subjects
            </button>
            <button 
              onClick={() => setActiveTab('faq')} 
              className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'faq' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              FAQ
            </button>
          </div>
        </div>
        
        {/* Featured Resources Tab */}
        {activeTab === 'featured' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Featured Resources</span>
            </h2>
            <p className="text-lg text-gray-300 text-center mb-8">Essential materials to boost your coding journey</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredResources.map((resource, index) => (
                <HomeTopCard 
                  key={index} 
                  {...resource} 
                  animationDelay={index * 100}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Core Subjects Tab */}
        {activeTab === 'subjects' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Core CS Subjects</span>
            </h2>
            <p className="text-lg text-gray-300 text-center mb-8">Comprehensive notes on fundamental computer science topics</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreSubjects.map((subject, index) => (
                <HomeTopCard 
                  key={index} 
                  {...subject} 
                  animationDelay={index * 100}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Frequently Asked Questions</span>
            </h2>
            <p className="text-lg text-gray-300 text-center mb-8">Find answers to common questions about CodeCombat</p>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium text-white">{faq.question}</span>
                    <FaChevronDown 
                      className={`text-purple-400 transition-transform ${showFaq[index] ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  
                  {showFaq[index] && (
                    <div className="px-6 pb-4 text-gray-300 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-800/50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Why Choose CodeCombat?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all transform hover:scale-105">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <FaCode className="text-purple-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Interactive Challenges</h3>
              <p className="text-gray-300">Practice with real-world coding problems and improve your problem-solving skills.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all transform hover:scale-105">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <FaUsers className="text-blue-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Team Collaboration</h3>
              <p className="text-gray-300">Form teams, collaborate on projects, and participate in team-based competitions.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500/50 transition-all transform hover:scale-105">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <FaTrophy className="text-green-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Competitive Contests</h3>
              <p className="text-gray-300">Participate in regular coding contests to test your skills against other developers.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-pink-500/50 transition-all transform hover:scale-105">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <FaLaptopCode className="text-pink-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Learning Resources</h3>
              <p className="text-gray-300">Access comprehensive study materials, tutorials, and practice problems.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Ready to Level Up Your Coding Skills?</span>
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Join thousands of developers who are improving their skills and having fun with CodeCombat.</p>
        <button 
          onClick={handleStartCoding}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/30"
        >
          Start Coding Now
        </button>
      </div>
      
      <HelpPopup />
    </div>
  );
};

export default HomePage;