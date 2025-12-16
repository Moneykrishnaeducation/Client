import React from 'react';
import { useLocation } from 'react-router-dom';

// Dynamic API base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || `https://hi5trader.com/`;

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

// Get auth headers
export const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('jwt_token') || localStorage.getItem('accessToken') || localStorage.getItem('access_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Endpoints that do not require auth
const PUBLIC_ENDPOINT_HINTS = ["login/", "public/", "get-usd-inr-rate/", "finance/quote"];

// Immediate logout
export function handleUnauthorized() {
  try {
    if (window.__unauthorizedHandled) return;
    window.__unauthorizedHandled = true;

    ['jwt_token', 'accessToken', 'access_token'].forEach(k => localStorage.removeItem(k));
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
  const config = { ...options, headers };

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
    config.credentials = 'include';
  }

  // Check auth for protected endpoints
  const hasAuth = !!headers.Authorization;
  const isPublic = PUBLIC_ENDPOINT_HINTS.some(hint => endpoint.includes(hint));
  if (!hasAuth && !isPublic && !url.startsWith('http')) {
    handleUnauthorized();
    throw new Error('No auth token');
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 401 || response.status === 403) {
      handleUnauthorized();
      throw new Error('Unauthorized access');
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

  React.useEffect(() => {
    localStorage.setItem('current_page', currentPage);
  }, [currentPage]);

  return currentPage;
};

// Cross-tab page changes
window.addEventListener('storage', (event) => {
  if (event.key === 'current_page') {
    console.log('Page changed in another tab:', event.newValue);
  }
  if (event.key === 'unauthorized_logout') {
    handleUnauthorized();
  }
});

// Trigger logout across tabs
export const triggerCrossTabLogout = () => {
  localStorage.setItem('unauthorized_logout', Date.now().toString());
  localStorage.removeItem('unauthorized_logout');
};

// Get/set current page
export const getCurrentPage = () => localStorage.getItem('current_page') || '/dashboard';
export const setCurrentPage = (page) => localStorage.setItem('current_page', page);
