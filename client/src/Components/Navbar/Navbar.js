import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";
import { BugPlay, Menu, X, ChevronDown, Bell, User as UserIcon } from "lucide-react";
import { FaCode, FaLaptopCode, FaUsers, FaTrophy } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isTeamsDropdownOpen, setIsTeamsDropdownOpen] = useState(false);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsResourcesDropdownOpen(false);
  }, [location]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileDropdownOpen(false);
  };
  
  const navLinks = [
    { 
      name: "Resources", 
      path: "/", 
      icon: <FaCode className="mr-2" />,
      hasDropdown: true,
      dropdownItems: [
        { name: "Featured Resources", path: "/", onClick: () => {
          window.scrollTo({ top: document.querySelector('.container')?.offsetTop || 0, behavior: 'smooth' });
          // Find and click the Featured Resources tab button
          setTimeout(() => {
            const featuredButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Featured Resources'));
            if (featuredButton) featuredButton.click();
          }, 500);
        }},
        { name: "Core Subjects", path: "/", onClick: () => {
          window.scrollTo({ top: document.querySelector('.container')?.offsetTop || 0, behavior: 'smooth' });
          // Find and click the Core Subjects tab button
          setTimeout(() => {
            const subjectsButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Core Subjects'));
            if (subjectsButton) subjectsButton.click();
          }, 500);
        }},
        { name: "FAQ", path: "/", onClick: () => {
          window.scrollTo({ top: document.querySelector('.container')?.offsetTop || 0, behavior: 'smooth' });
          // Find and click the FAQ tab button
          setTimeout(() => {
            const faqButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('FAQ'));
            if (faqButton) faqButton.click();
          }, 500);
        }},
      ]
    },
    { 
      name: "Practice", 
      path: user ? "/practice" : "/login", 
      icon: <FaLaptopCode className="mr-2" />,
      hasDropdown: false
    },
    { 
      name: "Battle Ground", 
      path: user ? "/battle" : "/login", 
      icon: <FaTrophy className="mr-2" />,
      hasDropdown: false
    },
    { 
      name: "Teams", 
      path: user ? "/teams" : "/login", 
      icon: <FaUsers className="mr-2" />,
      hasDropdown: false
    },
  ];

  return (
    <div className="relative z-50">
      {/* Warning Message Banner */}
      <div className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white text-center py-2 font-medium text-sm md:text-base px-4">
        Please note: This website is hosted on a free platform. The first time you access the site or after some inactivity, it may take a minute for the backend to start.
      </div>

      {/* Navbar */}
      <div 
        className={`w-full text-white transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-gray-900'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Name */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gray-900 rounded-full p-1">
                    <BugPlay size={36} className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  </div>
                </div>
                
                {/* Text Container */}
                <div className="flex flex-col leading-tight">
                  <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 group-hover:from-purple-300 group-hover:to-blue-300 transition-colors duration-300">
                    TeamCode
                  </span>
                  <span className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    Learn and Grow Together
                  </span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.hasDropdown ? (
                    <div>
                      <Link 
                        to="/"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsResourcesDropdownOpen(!isResourcesDropdownOpen);
                          if (location.pathname !== '/') {
                            navigate('/');
                          }
                        }}
                        className={`flex items-center text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 ${location.pathname === link.path ? "text-purple-400 bg-gray-800" : "text-gray-300 hover:text-white hover:bg-gray-800/50"}`}
                      >
                        {link.icon}
                        {link.name}
                        <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${isResourcesDropdownOpen ? 'rotate-180' : ''}`} />
                      </Link>
                      
                      {/* Dropdown for Resources */}
                      {isResourcesDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 z-50 animate-fade-in">
                          {link.dropdownItems.map((item) => (
                            <div key={item.name}>
                              {item.onClick ? (
                                <button
                                  onClick={() => {
                                    setIsResourcesDropdownOpen(false);
                                    item.onClick();
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                                >
                                  {item.name}
                                </button>
                              ) : (
                                <Link
                                  to={item.path}
                                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                                >
                                  {item.name}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`flex items-center text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 ${(location.pathname === link.path && (user || link.name === "Resources")) ? "text-purple-400 bg-gray-800" : "text-gray-300 hover:text-white hover:bg-gray-800/50"}`}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side - Auth & Profile */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <UserIcon size={18} className="text-purple-400" />
                    </div>
                    <span className="text-sm font-medium">{user.username || 'User'}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 z-50 animate-fade-in">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                      >
                        Settings
                      </Link>
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                      >
                        Admin Panel
                      </Link>
                      <div className="border-t border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-150"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-sm px-4 py-2 rounded-lg transition-all duration-300 text-white hover:text-white border border-gray-700 hover:border-purple-500/50 hover:bg-gray-800"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-purple-500/20"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} animate-fade-in`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.hasDropdown ? (
                  <div>
                    <Link
                      to="/"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsResourcesDropdownOpen(!isResourcesDropdownOpen);
                        if (location.pathname !== '/') {
                          setIsMobileMenuOpen(false);
                          navigate('/');
                        }
                      }}
                      className="w-full flex items-center justify-between text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                    >
                      <div className="flex items-center">
                        {link.icon}
                        {link.name}
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${isResourcesDropdownOpen ? 'rotate-180' : ''}`} 
                      />
                    </Link>
                    
                    {isResourcesDropdownOpen && (
                      <div className="pl-6 space-y-1 animate-fade-in">
                        {link.dropdownItems.map((item) => (
                          <div key={item.name}>
                            {item.onClick ? (
                              <button
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setIsResourcesDropdownOpen(false);
                                  item.onClick();
                                }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                              >
                                {item.name}
                              </button>
                            ) : (
                              <Link
                                to={item.path}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                              >
                                {item.name}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium ${(location.pathname === link.path && (user || link.name === "Resources")) ? "bg-gray-700 text-white" : ""}`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile Authentication */}
          <div className="pt-4 pb-3 border-t border-gray-700">
            {user ? (
              <div className="px-2 space-y-1">
                <div className="flex items-center px-3 py-2">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <UserIcon size={20} className="text-purple-400" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user.username || 'User'}</div>
                    <div className="text-sm font-medium text-gray-400">{user.email || ''}</div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Settings
                </Link>
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="px-5 py-3 flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="w-full text-center px-4 py-2 rounded-md text-base font-medium text-white bg-gray-800 hover:bg-gray-700"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="w-full text-center px-4 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
