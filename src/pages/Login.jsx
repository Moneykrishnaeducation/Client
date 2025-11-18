import React, { useState } from 'react';
import { loginUser } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const data = await loginUser(email, password);

    console.log("Login successful", data);

    // Respect Remember Me preference (assuming always true for now)
    const remember = true; // document.getElementById('rememberMe') ? document.getElementById('rememberMe').checked : true;
    const storage = remember ? localStorage : sessionStorage;

    // Batch localStorage operations for better performance
    const userEmail = (data.user && data.user.email) ? data.user.email.toLowerCase() : '';
    const storageData = {
      'jwt_token': data.access,
      'accessToken': data.access,
      'refresh_token': data.refresh,
      'refreshToken': data.refresh,
      'user_role': data.role,
      'userRole': data.role,
      'user_email': userEmail,
      'userEmail': userEmail,
      'user_name': data.user.name,
      'userName': data.user.name
    };

    // Set all storage items at once
    Object.entries(storageData).forEach(([key, value]) => {
      storage.setItem(key, value);
    });

    // Clear any pending verification marker since login succeeded
    try { localStorage.removeItem('login_verification_pending'); } catch(e){}

    // Allow admin, manager, and client roles to access client panel
    const allowedRoles = ['admin', 'manager', 'client'];
    const userRole = (data.role || '').toString().toLowerCase();

    if (allowedRoles.includes(userRole)) {
      // Show brief success notification and redirect immediately
      // showNotification(`Welcome back, ${data.user.name}!`, 'success', 1500);
      // Immediate redirect for fastest login experience
      window.location.href = "/dashboard";
    } else {
      setError(`Your account role (${data.role}) does not have access to the client panel.`);
      // showNotification(`Access denied. Your role (${data.role}) cannot access the client panel.`, 'error', 5000);
    }
  } catch (err) {
    setError(err.message || "Network error. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>

          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400`}></i>
            </button>
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot your password?</a>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-center text-sm text-gray-600 md:hidden">
            Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
