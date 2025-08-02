import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useUser } from '../../Contexts/UserContext';
import Navbar from '../Navbar/Navbar';

const Login = () => {
  const { login } = useUser();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleGoogleLogin = async (response) => {
    if (response.error) {
      console.error('Google Login Error:', response.error);
      return;
    }
    
    console.log('Google login attempt with credential:', response.credential ? 'credential received' : 'no credential');
    
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, { idToken: response.credential });
      console.log('Google login successful:', res.data);
      login(res.data);
      navigate('/');
    } catch (error) {
      console.error('Google login failed:', error.response?.data || error.message);
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!userData.email) tempErrors.email = "Email is required";
    if (!userData.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => setUserData({ ...userData, [e.target.id]: e.target.value });

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, userData);
      sessionStorage.setItem('token', response.data.token);
      login(response.data);
      navigate('/');
    } catch (error) {
      console.error(error);
      setErrors({ login: 'Invalid credentials' });
    }
  };

  return (
    <>
      <Navbar/>
    <section className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center">Login</h2>
        <form className="mt-6 space-y-4" onSubmit={submitForm}>
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
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-gray-400">
          <Link to="/signup" className="hover:text-purple-400">Register</Link>
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

export default Login;
