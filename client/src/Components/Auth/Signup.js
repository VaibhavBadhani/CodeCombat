import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { useUser } from '../../Contexts/UserContext';

const Signup = () => {
  const { login } = useUser();
  const [userData, setUserData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!userData.username.trim()) tempErrors.username = "Username is required";
    if (!userData.email) tempErrors.email = "Email is required";
    if (!userData.password || userData.password.length < 8) tempErrors.password = "Password must be at least 8 characters";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => setUserData({ ...userData, [e.target.id]: e.target.value });

  const submitForm = async (e) => {
    console.log('FORM SUBMITTED - SIGNUP FUNCTION TRIGGERED');
    e.preventDefault();
    if (!validate()) {
      console.log('Validation failed:', errors);
      return;
    }
    
    console.log('Attempting to sign up with:', userData);
    console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, userData);
      console.log('Signup successful:', response.data);
      login(response.data);
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      setErrors({ backend: 'Signup failed, try again.' });
    }
  };

  const handleGoogleLogin = async (response) => {
    if (response.error) {
      console.error('Google Login Error:', response.error);
      return alert('Google login failed');
    }
    
    console.log('Google signup attempt with credential:', response.credential ? 'credential received' : 'no credential');
    
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, { idToken: response.credential });
      console.log('Google signup successful:', res.data);
      login(res.data);
      navigate('/');
    } catch (error) {
      console.error('Google signup failed:', error.response?.data || error.message);
      alert('Google signup failed');
    }
  };
  


  return (
    <>
      <Navbar/>
    <section className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center">Signup</h2>
        <form className="mt-6 space-y-4" onSubmit={submitForm}>
          <input
            type="text"
            id="username"
            placeholder="Username"
            className="w-full p-3 bg-gray-700 rounded-md focus:ring-2 focus:ring-purple-500"
            value={userData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-700 rounded-md focus:ring-2 focus:ring-purple-500"
            value={userData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-700 rounded-md focus:ring-2 focus:ring-purple-500"
            value={userData.password}
            onChange={handleChange}
          />
          <button type="submit" className="w-full p-3 bg-purple-600 hover:bg-purple-700 transition rounded-md">
            Signup
          </button>
        </form>
        <div className="mt-4 text-center text-gray-400">
          <Link to="/login" className="hover:text-purple-400">Login</Link>
        </div>
        <div className="mt-6 text-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={(error) => console.error('Google Login Error:', error)}
            theme="dark"
          />
        </div>
      </div>
    </section>
    </>
  );
};

export default Signup;
