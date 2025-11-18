import React, { useState, useEffect } from 'react';
import { loginUser } from '../utils/api';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Signup states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Auto-login on page load if a token exists (and validate it),
    // and listen for storage events so other tabs can detect login.
    (function() {
      const apiBase = (window.API_CONFIG && window.API_CONFIG.apiBase) ? window.API_CONFIG.apiBase : '/client';

      function getStoredAccessToken() {
        return localStorage.getItem('jwt_token') || localStorage.getItem('accessToken') ||
              sessionStorage.getItem('jwt_token') || sessionStorage.getItem('accessToken') || null;
      }

      async function validateAndRedirect(token) {
        if (!token) return;
        try {
          // The server ValidateTokenView expects an authenticated request.
          // Send the token as a Bearer Authorization header and use GET.
          const res = await fetch(`${apiBase}/validate-token/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          if (!res.ok) return;
          const data = await res.json();
          // If we get a successful response, redirect
          if (data && (data.message || data.user)) {
            window.location.href = '/dashboard';
          }
        } catch (err) {
          console.debug('Auto-login validation error', err);
        }
      }

      // Run on load: if token exists, redirect immediately to dashboard
      // However, if there's a referral code in the URL we should open the signup panel
      const token = getStoredAccessToken();
      const urlParamsOnLoad = new URLSearchParams(window.location.search);
      const initialRef = urlParamsOnLoad.get('ref');
      if (token && !initialRef) {
        // Immediate redirect — assume token validity; server will reject protected endpoints if invalid
        window.location.href = '/dashboard';
      } else if (initialRef) {
        setIsSignUp(true);
      }

      // Cross-tab: when other tab writes a token, redirect immediately
      window.addEventListener('storage', (ev) => {
        if (!ev.key) return;
        const interesting = ['jwt_token','accessToken','refresh_token','refreshToken','userEmail','user_email'];
        if (interesting.includes(ev.key)) {
          const newToken = getStoredAccessToken();
          if (newToken) window.location.href = '/dashboard';
        }
      });
    })();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);

      console.log("Login successful", data);

      // Respect Remember Me preference (assuming always true for now)
      const remember = true;
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
        window.location.href = "/dashboard";
      } else {
        setError(`Your account role (${data.role}) does not have access to the client panel.`);
      }
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const signupData = {
        name,
        email: email.toLowerCase(),
        phone,
        dob,
        password,
        confirm_password: confirmPassword
      };

      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      if (refCode) {
        signupData.referral_code = refCode;
      }

      const response = await fetch('/client/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Auto-login if tokens provided
        if (data.auto_login && data.access && data.refresh) {
          const storage = localStorage;
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
          Object.entries(storageData).forEach(([key, value]) => {
            storage.setItem(key, value);
          });
          window.location.href = '/dashboard';
        } else {
          setError("Signup successful! Please log in.");
          setIsSignUp(false);
        }
      } else {
        setError(data.error || "Signup failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsSignUp(false)}
            className={`px-4 py-2 ${!isSignUp ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-md`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`px-4 py-2 ${isSignUp ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-md`}
          >
            Sign Up
          </button>
        </div>

        {isSignUp ? (
          <form onSubmit={handleSignupSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>

            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
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

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400`}></i>
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>

            <div>
              <input
                type="email"
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
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
