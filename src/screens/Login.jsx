import React, { useState } from 'react';
import { User, Shield, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [userType, setUserType] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    id: '',
    password: ''
  });
  const url = 'http://localhost:3000';
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { userType, ...credentials });

    if (userType === 'employee') {
      const newUrl = url + '/api/emp/login';
      axios.post(newUrl,credentials)
        .then((response) => {
          console.log("Logged in successfully!", response.data);
          navigate('/emp_dashboard');
        })
        .catch((error) => {
          console.error("Login failed:", error.response ? error.response.data : error.message);
        });
    } else if (userType === 'hr') {
      const newUrl = url + '/api/hr/login';
      axios.post(newUrl,credentials)
        .then((response) => {
          console.log("Logged in successfully!", response.data);
          navigate('/hr_dashboard');
        })
        .catch((error) => {
          console.error("Login failed:", error.response ? error.response.data : error.message);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Company Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">CO</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Company Portal</h1>
            <p className="text-gray-600 text-sm">Please sign in to continue</p>
          </div>

          {/* User Type Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setUserType('employee')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all duration-200 ${userType === 'employee'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <User className="w-4 h-4 mr-2" />
              Employee
            </button>
            <button
              onClick={() => setUserType('hr')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all duration-200 ${userType === 'hr'
                  ? 'bg-white shadow-sm text-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              HR
            </button>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                {userType === 'employee' ? 'Employee ID' : 'HR ID'}
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={credentials.id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder={`Enter your ${userType === 'employee' ? 'employee' : 'HR'} ID`}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-opacity-50 ${userType === 'employee'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-300'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:ring-purple-300'
                }`}
            >
              Sign In as {userType === 'employee' ? 'Employee' : 'HR'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Forgot your password?
            </a>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-white text-sm opacity-80">
            © 2025 Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
