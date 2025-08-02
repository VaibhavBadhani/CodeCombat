import React, { useState, useEffect } from "react";

const HomeTopCard = ({ title, description, buttonLabel, color, fileUrl, icon, animationDelay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [downloadCount, setDownloadCount] = useState(Math.floor(Math.random() * 100) + 10);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);
    
    return () => clearTimeout(timer);
  }, [animationDelay]);
  
  const handleDownload = () => {
    setDownloadCount(prev => prev + 1);
  };
  
  return (
    <div 
      className={`bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 flex flex-col min-h-[220px] transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${isHovered ? 'shadow-xl shadow-' + color + '-500/20 border-' + color + '-500/50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon and Title */}
      <div className="flex items-center mb-3">
        {icon && (
          <div className={`w-10 h-10 rounded-lg bg-${color}-500/20 flex items-center justify-center mr-3`}>
            {icon}
          </div>
        )}
        <h2 className={`text-xl font-bold text-${color}-400`}>{title}</h2>
      </div>
      
      {/* Description */}
      <div className="flex-1 mb-4">
        <p className="text-gray-300">{description}</p>
      </div>
      
      {/* Stats */}
      <div className="flex items-center text-xs text-gray-400 mb-4">
        <span>{downloadCount} downloads</span>
        <span className="mx-2">•</span>
        <span>Updated recently</span>
      </div>

      {/* Download Button */}
      <a 
        href={fileUrl} 
        download 
        className="mt-auto" 
        onClick={handleDownload}
      >
        <button
          className={`px-4 py-2 w-full text-white font-semibold rounded-lg transition-all duration-300 shadow-md bg-${color || "blue"}-600 hover:bg-${color || "blue"}-500 hover:shadow-lg hover:shadow-${color || "blue"}-500/30 focus:ring-2 focus:ring-${color || "blue"}-300 focus:outline-none flex items-center justify-center`}
        >
          <span>{buttonLabel}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </a>
    </div>
  );
};

export default HomeTopCard;
