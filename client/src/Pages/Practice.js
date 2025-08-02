import React, { useState, useEffect, useCallback, useRef } from "react";
import MonacoEditor from "react-monaco-editor";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import HelpPopup from "../Components/Help/HelpPopup";
import Navbar from "../Components/Navbar/Navbar";
import { FaPlay, FaSave, FaDownload, FaShareAlt, FaLightbulb, FaCode, FaKeyboard, FaPalette, FaEdit, FaHistory, FaTrash, FaMarkdown, FaTerminal, FaCopy } from 'react-icons/fa';
import { RiSettings4Fill } from 'react-icons/ri';
import { ChevronDown } from 'lucide-react';
import { useUser } from "../Contexts/UserContext";
import { motion } from "framer-motion";
import DOMPurify from 'dompurify';
import { marked } from 'marked';

// Helper functions for language display
const getLanguageColor = (lang) => {
  const colors = {
    javascript: '#f7df1e',
    python: '#3572A5',
    java: '#b07219',
    c: '#555555',
    cpp: '#f34b7d'
  };
  return colors[lang] || '#888888';
};

const getLanguageDisplayName = (lang) => {
  const names = {
    javascript: 'JavaScript',
    python: 'Python',
    java: 'Java',
    c: 'C',
    cpp: 'C++'
  };
  return names[lang] || lang;
};

const PracticePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // State variables
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(getDefaultCode("javascript"));
  const [output, setOutput] = useState("");
  const [notes, setNotes] = useState('');
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [savedCodes, setSavedCodes] = useState([]);
  const [currentCodeName, setCurrentCodeName] = useState("Untitled");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newCodeName, setNewCodeName] = useState("");
  
  // Judge0 API endpoint and headers
  const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
  const API_KEY = "4de953dca3msh9e69eb61e89af05p1b21a7jsn7ebf34d234a5"; // Use your own API key here

  // Helper functions
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Function to get default code template based on language
  function getDefaultCode(lang) {
    switch (lang) {
      case "javascript":
        return `// JavaScript Practice
// Write your code here

function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("TeamCode"));
`;
      case "python":
        return `# Python Practice
# Write your code here

def greet(name):
    return f"Hello, {name}!"

print(greet("TeamCode"))
`;
      case "java":
        return `// Java Practice
// Write your code here

public class Main {
    public static void main(String[] args) {
        System.out.println(greet("TeamCode"));
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}
`;
      default:
        return "// Write your code here\n";
    }
  }

  // Effect to update code when language changes
  useEffect(() => {
    if (code === getDefaultCode("javascript") || 
        code === getDefaultCode("python") || 
        code === getDefaultCode("java") || 
        code === "// Write your code here\n") {
      setCode(getDefaultCode(language));
    }
  }, [language]);

  // Run code function
  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    try {
      // Prepare the submission payload
      const languageId = getLanguageId(language);
      const body = {
        source_code: code,
        language_id: languageId,
        stdin: "",
      };
  
      // Send the code to Judge0 API for evaluation
      const response = await axios.post(
        JUDGE0_API_URL,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );
  
      const token = response.data.token;
      
      // Get the result
      const result = await getResult(token);
      
      // Process the output from the result
      if (result.status.id === 3) {
        setOutput(result.stdout || "Code executed successfully with no output");
      } else if (result.status.id === 5) {
        setOutput(`Time Limit Exceeded: Your code took too long to execute`);
      } else if (result.status.id === 6) {
        setOutput(`Compilation Error:\n${result.compile_output}`);
      } else {
        setOutput(`Error: ${result.stderr || result.compile_output || "Unknown error"}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}\nPlease try again later.`);
      console.error("Error details:", error);
    } finally {
      setIsRunning(false);
    }
  };
  
  // Helper function to map language to its corresponding Judge0 language ID
  const getLanguageId = (language) => {
    switch (language) {
      case "javascript":
        return 63; // Language ID for JavaScript
      case "python":
        return 71; // Language ID for Python
      case "java":
        return 62; // Language ID for Java
      case "c":
        return 50; // Language ID for C
      case "cpp":
        return 54; // Language ID for C++
      default:
        return 63; // Default to JavaScript if language is unsupported
    }
  };
  
  // Function to fetch result from Judge0 using the token
  const getResult = async (token) => {
    while (true) {
      const resultResponse = await axios.get(
        `${JUDGE0_API_URL}/${token}`,
        {
          headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const result = resultResponse.data;
      const status = result.status.id;

      if (status === 3 || status > 3) {
        return result;
      }

      await sleep(500); // Wait 500ms before retrying
    }
  };

  // Save code function
  const saveCode = () => {
    if (user) {
      // Save to user account (would connect to backend)
      console.log('Saving code to user account:', currentCodeName, code);
      // API call would go here
    } else {
      // Save to localStorage for non-logged in users
      const savedCodes = JSON.parse(localStorage.getItem('savedCodes') || '{}');
      savedCodes[currentCodeName || 'Untitled'] = {
        code,
        language,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
      console.log('Code saved to localStorage');
    }
  };

  // Function to save notes
  const saveNotes = () => {
    if (user) {
      // Save to user account (would connect to backend)
      console.log('Saving notes to user account:', currentCodeName, notes);
      // API call would go here
    } else {
      // Save to localStorage for non-logged in users
      const savedNotes = JSON.parse(localStorage.getItem('savedNotes') || '{}');
      savedNotes[currentCodeName || 'Untitled'] = {
        notes,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
      console.log('Notes saved to localStorage');
    }
  };

  // Function to toggle between markdown preview and edit mode
  const toggleNoteFormat = () => {
    setShowMarkdownPreview(!showMarkdownPreview);
  };

  // Function to convert markdown to HTML
  const markdownToHtml = (markdown) => {
    if (!markdown) return '';
    try {
      // Convert markdown to HTML and sanitize to prevent XSS
      const rawHtml = marked.parse(markdown);
      return DOMPurify.sanitize(rawHtml);
    } catch (error) {
      console.error('Error converting markdown:', error);
      return '<p>Error rendering markdown</p>';
    }
  };

  // Handle save dialog confirm
  const handleSaveConfirm = () => {
    const savedCode = {
      name: newCodeName || "Untitled",
      language,
      code,
      date: new Date().toISOString()
    };
    
    // In a real app, you would save to the backend here
    // For now, we'll just use localStorage
    const localSavedCodes = JSON.parse(localStorage.getItem('savedCodes') || '[]');
    localSavedCodes.push(savedCode);
    localStorage.setItem('savedCodes', JSON.stringify(localSavedCodes));
    
    setSavedCodes(localSavedCodes);
    setCurrentCodeName(newCodeName || "Untitled");
    setShowSaveDialog(false);
    setOutput("Code saved successfully!");
  };

  // Download code function
  const downloadCode = () => {
    const fileExtension = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      c: 'c',
      cpp: 'cpp'
    }[language] || 'txt';
    
    const fileName = `${currentCodeName.replace(/\s+/g, '_')}.${fileExtension}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share code function
  const shareCode = () => {
    // In a real app, this would generate a shareable link
    // For now, we'll just copy the code to clipboard
    navigator.clipboard.writeText(code)
      .then(() => setOutput("Code copied to clipboard! You can now share it manually."))
      .catch(err => setOutput("Failed to copy code: " + err));
  };

  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowKeyboardShortcuts(false);
  };

  // Toggle keyboard shortcuts panel
  const toggleKeyboardShortcuts = () => {
    setShowKeyboardShortcuts(!showKeyboardShortcuts);
    setShowSettings(false);
  };

  // Load saved codes on component mount
  useEffect(() => {
    const localSavedCodes = JSON.parse(localStorage.getItem('savedCodes') || '[]');
    setSavedCodes(localSavedCodes);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Enter or Cmd+Enter to run code
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
      
      // Ctrl+S or Cmd+S to save code
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCode();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language]); // Re-add event listener when code or language changes

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Navbar */}
      <Navbar/>
      
      {/* Header with title and actions */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-sm text-white shadow-lg border-b border-indigo-900/30">
        <div className="flex items-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mr-4"
          >
            <FaCode className="text-3xl text-purple-400" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
              Practice Ground
            </h1>
            <p className="text-sm text-gray-400">Write, test, and improve your coding skills</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg blur-sm -z-10"></div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 pl-8 pr-10 bg-indigo-900/30 text-white rounded-lg shadow-lg focus:outline-none border border-indigo-700/50 hover:border-indigo-500/50 focus:border-blue-400 transition-all appearance-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-blue-400">
              <FaCode size={16} />
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={16} />
            </div>
          </motion.div>
          
          {/* Theme Selector */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-700/20 rounded-lg blur-sm -z-10"></div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="p-2 pl-8 pr-10 bg-indigo-900/30 text-white rounded-lg shadow-lg focus:outline-none border border-indigo-700/50 hover:border-indigo-500/50 focus:border-blue-400 transition-all appearance-none"
            >
              <option value="vs-dark">Dark Theme</option>
              <option value="vs-light">Light Theme</option>
              <option value="hc-black">High Contrast</option>
            </select>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-purple-400">
              <FaPalette size={16} />
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={16} />
            </div>
          </motion.div>
          
          {/* Settings Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSettings}
            className={`p-2 ${showSettings ? 'bg-purple-600 border-purple-400' : 'bg-gray-700 border-gray-600'} text-white rounded-lg shadow-lg hover:shadow-purple-500/30 focus:outline-none border hover:border-purple-400 transition-all duration-300`}
            title="Settings"
          >
            <motion.div
              animate={showSettings ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <RiSettings4Fill size={20} className={showSettings ? 'text-white' : 'text-gray-300'} />
            </motion.div>
          </motion.button>
          
          {/* Keyboard Shortcuts Button */}
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleKeyboardShortcuts}
            className={`p-2 ${showKeyboardShortcuts ? 'bg-purple-600 border-purple-400' : 'bg-gray-700 border-gray-600'} text-white rounded-lg shadow-lg hover:shadow-purple-500/30 focus:outline-none border hover:border-purple-400 transition-all duration-300`}
            title="Keyboard Shortcuts"
          >
            <motion.div
              animate={showKeyboardShortcuts ? { y: -2 } : { y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaKeyboard size={20} className={showKeyboardShortcuts ? 'text-white' : 'text-gray-300'} />
            </motion.div>
          </motion.button>
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md blur-sm -z-10 group-hover:opacity-100 opacity-70 transition-opacity duration-300"></div>
              <input 
                type="text" 
                value={currentCodeName} 
                onChange={(e) => setCurrentCodeName(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 w-48 transition-all duration-300 group-hover:border-blue-500"
                placeholder="Untitled"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
                  <FaEdit size={14} />
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center px-3 py-1 bg-gray-700 rounded-md border border-gray-600">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getLanguageColor(language) }}></div>
              <span className="text-gray-300 text-sm font-medium">{getLanguageDisplayName(language)}</span>
            </div>
            
            <div className="flex items-center px-3 py-1 bg-gray-700 rounded-md border border-gray-600">
              <FaHistory className="text-gray-400 mr-2" size={12} />
              <span className="text-gray-300 text-sm">Auto-saved</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {/* Run Button */}
          <motion.button
            onClick={runCode}
            disabled={isRunning}
            className="group relative flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden border border-indigo-900/30"
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <motion.span
              animate={isRunning ? { rotate: 360 } : { rotate: 0 }}
              transition={{ repeat: isRunning ? Infinity : 0, duration: 1 }}
              className="mr-2 text-green-200"
            >
              <FaPlay size={16} />
            </motion.span>
            <span className="font-medium tracking-wide">Run Code</span>
          </motion.button>
          
          {/* Save Button */}
          <motion.button
            onClick={saveCode}
            className="group relative flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg shadow-lg overflow-hidden border border-indigo-900/30"
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <motion.span 
              className="mr-2 text-blue-200"
              whileHover={{ rotate: 15 }}
            >
              <FaSave size={16} />
            </motion.span>
            <span className="font-medium tracking-wide">Save</span>
          </motion.button>
          
          {/* Download Button */}
          <motion.button
            onClick={downloadCode}
            className="group relative flex items-center justify-center px-5 py-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-indigo-500/40 overflow-hidden border border-indigo-400/30"
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <motion.span 
              className="mr-2 text-indigo-200"
              whileHover={{ y: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaDownload size={16} />
            </motion.span>
            <span className="font-medium tracking-wide">Download</span>
          </motion.button>
          
          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareCode}
            className="flex items-center px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-lg border border-transparent hover:border-indigo-400 transition-all duration-300"
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaShareAlt className="mr-2" />
            </motion.div>
            Share
          </motion.button>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor */}
        <div className="w-3/4 bg-gray-800 shadow-inner relative">
          <MonacoEditor
            language={language}
            theme={theme}
            value={code}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
              fontSize: fontSize,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              folding: true,
              autoIndent: 'full',
              formatOnPaste: true,
            }}
            onChange={(newCode) => setCode(newCode)}
          />
          
          {/* Keyboard shortcuts panel */}
          {showKeyboardShortcuts && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 bg-gray-900 p-4 rounded-lg shadow-xl border border-gray-700 z-10 w-80"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
                <button onClick={() => setShowKeyboardShortcuts(false)} className="text-gray-400 hover:text-white">
                  &times;
                </button>
              </div>
              <div className="text-sm text-gray-300">
                <div className="flex justify-between py-1 border-b border-gray-700">
                  <span>Run Code</span>
                  <span className="text-purple-400">Ctrl + Enter</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-700">
                  <span>Save Code</span>
                  <span className="text-purple-400">Ctrl + S</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-700">
                  <span>Format Document</span>
                  <span className="text-purple-400">Shift + Alt + F</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-700">
                  <span>Find</span>
                  <span className="text-purple-400">Ctrl + F</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Replace</span>
                  <span className="text-purple-400">Ctrl + H</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Settings panel */}
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 bg-gray-900 p-4 rounded-lg shadow-xl border border-gray-700 z-10 w-80"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">Editor Settings</h3>
                <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                  &times;
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Font Size</label>
                  <input 
                    type="range" 
                    min="10" 
                    max="24" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(parseInt(e.target.value))} 
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10px</span>
                    <span>{fontSize}px</span>
                    <span>24px</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none"
                  >
                    <option value="vs-dark">Dark Theme</option>
                    <option value="vs-light">Light Theme</option>
                    <option value="hc-black">High Contrast</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Notes and Output Section */}
        <div className="w-1/4 flex flex-col bg-gray-900 border-l border-gray-700">
          {/* Notes Section */}
          <div className="flex-1 p-4 border-b border-gray-700 relative">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between mb-3"
            >
              <div className="flex items-center">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaLightbulb className="text-yellow-400 mr-2 text-xl" />
                </motion.div>
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">Notes</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setNotes('')}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  title="Clear notes"
                >
                  <FaTrash size={14} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => saveNotes()}
                  className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                  title="Save notes"
                >
                  <FaSave size={14} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleNoteFormat()}
                  className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
                  title="Toggle format"
                >
                  <FaMarkdown size={14} />
                </motion.button>
              </div>
            </motion.div>
            
            <div className="relative h-[calc(100%-2rem)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {showMarkdownPreview ? (
                <div 
                  className="w-full h-full p-3 bg-gray-800 rounded-lg text-gray-300 border border-gray-700 overflow-auto markdown-preview"
                  style={{ maxHeight: 'calc(100% - 10px)' }}
                >
                  <div dangerouslySetInnerHTML={{ __html: markdownToHtml(notes) }} />
                </div>
              ) : (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write your notes here..."
                  className="w-full h-full p-3 bg-gray-800 rounded-lg text-gray-300 focus:outline-none resize-none border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                  style={{ maxHeight: 'calc(100% - 10px)' }}
                />
              )}
              
              {notes && (
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {notes.length} characters
                </div>
              )}
            </div>
          </div>
          
          {/* Output Section */}
          <div className="flex-1 p-4 relative">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between mb-3"
            >
              <div className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaTerminal className="text-blue-400 mr-2 text-xl" />
                </motion.div>
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">Console Output</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                {isRunning && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-yellow-400 text-sm">Running...</span>
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOutput('')}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  title="Clear console"
                >
                  <FaTrash size={14} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                  title="Copy output"
                >
                  <FaCopy size={14} />
                </motion.button>
              </div>
            </motion.div>
            
            <div className="relative h-[calc(100%-2rem)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="w-full h-full p-4 bg-gray-900 rounded-lg text-gray-300 overflow-auto border border-gray-700 font-mono text-sm">
                {output ? (
                  <motion.pre 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="whitespace-pre-wrap"
                  >
                    {output}
                  </motion.pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <FaCode size={24} className="mb-2" />
                    <p>Run your code to see output here</p>
                  </div>
                )}
              </div>
              
              {output && (
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {output.length} characters
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-xl shadow-lg border border-indigo-900/30 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 mb-4">Save Your Code</h3>
            <input
              type="text"
              value={newCodeName}
              onChange={(e) => setNewCodeName(e.target.value)}
              placeholder="Enter a name for your code"
              className="w-full p-3 mb-4 bg-indigo-900/30 text-white rounded-lg border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-all border border-gray-700 shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfirm}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all shadow-lg border border-indigo-900/30"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      <HelpPopup/>
    </div>
  );
};

export default PracticePage;
