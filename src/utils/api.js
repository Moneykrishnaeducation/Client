import React from 'react';
import { useLocation } from 'react-router-dom';

/* ============================================
   API BASE URL – hi5trader.com READY
============================================ */
const getApiBaseUrl = () => {
  const { protocol, hostname } = window.location;

  // Production domain
  if (hostname === 'hi5trader.com' || hostname === 'www.hi5trader.com') {
    return `${protocol}//hi5trader.com/`;
  }

  // Production server IP (replace if needed)
  if (hostname === 'YOUR_SERVER_IP') {
    return `${protocol}//YOUR_SERVER_IP/`;
  }

  // Local / staging
  return `${protocol}//${hostname}:8000/`;
};

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || getApiBaseUrl();

/* ============================================
   COOKIE UTILS
============================================ */
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

/* ============================================
   AUTH HEADERS
============================================ */
export const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token =
    localStorage.getItem('jwt_token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token');

  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

/* ============================================
   PUBLIC ENDPOINTS
============================================ */
const PUBLIC_ENDPOINT_HINTS = [
  'login/',
  'public/',
  'get-usd-inr-rate/',
  'finance/quote',
];

/* ============================================
   IMMEDIATE LOGOUT HANDLER
============================================ */
export function handleUnauthorized() {
  try {
    if (window.__unauthorizedHandled) return;
    window.__unauthorizedHandled = true;

    ['jwt_token', 'accessToken', 'access_token'].forEach((k) =>
      localStorage.removeItem(k)
    );

    try {
      sessionStorage.removeItem('auth_state');
    } catch {}

    if (typeof triggerCrossTabLogout === 'function') {
      triggerCrossTabLogout();
    }

    setTimeout(() => {
      if (typeof window.stop === 'function') {
        try {
          window.stop();
        } catch {}
      }
      window.location.replace('/');
    }, 0);
  } catch (err) {
    console.error('Logout failed:', err);
    window.location.replace('/');
  }
}

if (typeof window !== 'undefined') {
  window.handleUnauthorized = handleUnauthorized;
}

/* ============================================
   GENERIC API CALL
============================================ */
export const apiCall = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const headers = { ...getAuthHeaders(), ...(options.headers || {}) };
  const config = { ...options, headers };

  // Handle FormData
  if (options?.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  // CSRF for write operations
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) headers['X-CSRFToken'] = csrfToken;
    config.credentials = 'include';
  }

  // Auth check
  const hasAuth = !!headers.Authorization;
  const isPublic = PUBLIC_ENDPOINT_HINTS.some((e) =>
    endpoint.includes(e)
  );

  if (!hasAuth && !isPublic && !endpoint.startsWith('http')) {
    handleUnauthorized();
    throw new Error('Missing auth token');
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 401 || response.status === 403) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }

    // Prevent HTML being parsed as JSON
    const text = await response.text();
    console.error('Expected JSON but received:', text);
    throw new Error('Invalid API response');
  } catch (err) {
    console.error('API error:', err);
    throw err;
  }
};

/* ============================================
   LOGIN
============================================ */
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Login failed: ${text}`);
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.detail || 'Login failed');
  }

  return data;
};

/* ============================================
   CSRF TOKEN
============================================ */
export const getCSRFToken = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}api/csrf-token/`, {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      return data.csrfToken;
    }
  } catch (err) {
    console.error('CSRF fetch failed:', err);
  }
  return null;
};

/* ============================================
   CURRENT PAGE TRACKING
============================================ */
export const useCurrentPage = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  React.useEffect(() => {
    localStorage.setItem('current_page', currentPage);
  }, [currentPage]);

  return currentPage;
};

/* ============================================
   CROSS TAB SYNC
============================================ */
window.addEventListener('storage', (event) => {
  if (event.key === 'current_page') {
    console.log('Page changed in another tab:', event.newValue);
  }
  if (event.key === 'unauthorized_logout') {
    handleUnauthorized();
  }
});

/* ============================================
   CROSS TAB LOGOUT
============================================ */
export const triggerCrossTabLogout = () => {
  localStorage.setItem('unauthorized_logout', Date.now().toString());
  localStorage.removeItem('unauthorized_logout');
};

/* ============================================
   PAGE HELPERS
============================================ */
export const getCurrentPage = () =>
  localStorage.getItem('current_page') || '/dashboard';

export const setCurrentPage = (page) =>
  localStorage.setItem('current_page', page);
