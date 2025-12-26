import React from 'react';
import { useLocation } from 'react-router-dom';

// Dynamic API base URL - use relative URL to respect CSP and work across all domains
export const API_BASE_URL = `/`;

// Get cookie by name
export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Get auth headers - tokens are now in HttpOnly cookies, no need to add Authorization header
export const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  // Tokens are in HttpOnly cookies and automatically sent by browser with credentials: 'include'
  return headers;
};

// Endpoints that do not require auth
const PUBLIC_ENDPOINT_HINTS = ["login/", "public/", "get-usd-inr-rate/", "finance/quote", "otp-status/", "verify-otp/", "csrf/"];

// Immediate logout
export function handleUnauthorized() {
  try {
    if (window.__unauthorizedHandled) return;
    window.__unauthorizedHandled = true;

    // Tokens are in HttpOnly cookies - server handles cleanup via cookie expiration
    // No need to remove from localStorage or sessionStorage
    try { sessionStorage.removeItem('auth_state'); } catch {}

    if (typeof triggerCrossTabLogout === 'function') triggerCrossTabLogout();
    if (typeof performLogout === 'function') {
      try { performLogout(); } catch (e) { console.error('performLogout failed:', e); }
    }

    setTimeout(() => {
      if (typeof window.stop === 'function') try { window.stop(); } catch {}
      window.location.replace('/');
    }, 0);

  } catch (error) {
    console.error('Immediate logout failed:', error);
    window.location.replace('/');
  }
}

if (typeof window !== 'undefined') {
  window.handleUnauthorized = handleUnauthorized;
}

// Generic API call
export const apiCall = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const headers = { ...getAuthHeaders(), ...(options.headers || {}) };
  const config = { ...options, headers, credentials: 'include' };

  // Handle FormData correctly
  try {
    if (options?.body instanceof FormData && config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    }
  } catch {}

  // CSRF token for state-changing requests
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) headers['X-CSRFToken'] = csrfToken;
  }

  // Token is in HttpOnly cookie - browser sends automatically
  // No need to check for Authorization header
  // Server will return 401 if token is invalid

  // Check if endpoint is public
  const isPublic = PUBLIC_ENDPOINT_HINTS.some(hint => endpoint.includes(hint));

  try {
    const response = await fetch(url, config);

    if (response.status === 401 || response.status === 403) {
      // Only treat 401/403 as unauthorized logout for protected endpoints
      if (!isPublic) {
        handleUnauthorized();
        throw new Error('Unauthorized access');
      }
      // For public endpoints, return the response as-is to let the caller handle it
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error('Expected JSON but got:', text);
      throw new Error('API did not return JSON');
    }

  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Login API
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // IMPORTANT: Include credentials so HttpOnly cookies are saved
  });

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(`Login failed: ${text}`);
  }

  if (!response.ok) throw new Error(data.error || data.detail || 'Login failed');

  return data;
};

// Fetch CSRF token
export const getCSRFToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}api/csrf-token/`, {
      method: 'GET',
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      return data.csrfToken;
    }
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
  return null;
};

// Hook to track current page
export const useCurrentPage = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  // No longer storing in localStorage - use React Router location directly
  return currentPage;
};

// Cross-tab logout is now handled by server via HttpOnly cookie expiration
// No need for localStorage-based cross-tab logout
export const triggerCrossTabLogout = () => {
  // Server handles logout across all tabs via cookie expiration
  console.log('Logout triggered - server will handle cookie cleanup');
};

// Get/set current page - no longer using localStorage, use React Router location
export const getCurrentPage = () => '/dashboard';
export const setCurrentPage = (page) => {
  // Page tracking now handled by React Router, no localStorage needed
};
