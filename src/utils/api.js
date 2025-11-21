import { useLocation } from 'react-router-dom';

// API utility functions for consistent token handling

export const API_BASE_URL = 'http://client.localhost:8000/';

// Get CSRF token from cookies
export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Get auth headers with token
export const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('jwt_token') || localStorage.getItem('accessToken') || localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Immediately logs out the user on unauthorized access.
 * - Clears all auth/session data instantly
 * - Calls performLogout() if available
 * - Falls back to a direct redirect to the login page
 */
export function handleUnauthorized() {
  try {
    // Immediate cleanup
    localStorage.clear();
    sessionStorage.clear();

    // Trigger cross-tab logout if available
    if (typeof triggerCrossTabLogout === 'function') {
      triggerCrossTabLogout();
    }

    // Call app-defined logout if available
    if (typeof performLogout === 'function') {
      performLogout(); // Should handle redirect internally
    } else {
      // Force redirect immediately
      window.location.replace('/');
    }
  } catch (error) {
    console.error('Immediate logout failed:', error);
    // Always redirect as last resort
    window.location.replace('/');
  }
}

// Define global handler for consistency - ensure it's set immediately
if (typeof window !== 'undefined') {
  window.handleUnauthorized = handleUnauthorized;
}

// Generic API call function with unauthorized handling
export const apiCall = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  // Add CSRF token for state-changing requests
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    // Ensure credentials are included for CSRF
    config.credentials = 'include';
  }

  // Merge headers if options.headers exists
  if (options.headers) {
    config.headers = { ...config.headers, ...options.headers };
  }

  try {
    const response = await fetch(url, config);
    if (response.status === 401 || response.status === 403) {
      handleUnauthorized();
      throw new Error('Unauthorized access');
    }
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Login API call (doesn't need auth header)
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.detail || 'Login failed');
  }

  return data;
};

// Function to get CSRF token from server if needed
export const getCSRFToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}api/csrf-token/`, {
      method: 'GET',
      credentials: 'include', // Include cookies
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

  // Store current page in localStorage for cross-tab persistence
  React.useEffect(() => {
    localStorage.setItem('current_page', currentPage);
  }, [currentPage]);

  return currentPage;
};

// Listen for page changes across tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'current_page') {
    // Optionally handle page sync across tabs if needed
    console.log('Page changed in another tab:', event.newValue);
  }
});

// Listen for unauthorized events across all tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'unauthorized_logout') {
    handleUnauthorized();
  }
});

// Function to trigger logout across all tabs
export const triggerCrossTabLogout = () => {
  localStorage.setItem('unauthorized_logout', Date.now().toString());
  // Clean up immediately
  localStorage.removeItem('unauthorized_logout');
};

// Get current page from localStorage
export const getCurrentPage = () => {
  return localStorage.getItem('current_page') || '/dashboard';
};

// Set current page in localStorage
export const setCurrentPage = (page) => {
  localStorage.setItem('current_page', page);
};
