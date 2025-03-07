import React, { useState } from 'react'
import { loginUser } from '../utils/api';
import { useAuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { setUser, setToken } = useAuthContext();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    student_id: '',
    email: '',
    tokenOTP: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      setToken(response.token);
      navigate('/');
      setMessage('Login successful');
    } catch (error) {
      console.error("LOGIN failed:", error);
      setMessage('Login failed, please try again.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-indigo-800 mb-8">Login</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="student_id" className="block text-lg font-medium text-gray-700">Student ID</label>
            <input
              type="text"
              id="student_id"
              name="student_id"
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              className="mt-2 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your student ID"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-2 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, tokenOTP: e.target.value })}
              className="mt-2 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition duration-300"
            >
              Login
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-red-500">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
