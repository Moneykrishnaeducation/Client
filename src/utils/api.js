import { useLocation } from 'react-router-dom';

// API utility functions for consistent token handling

const API_BASE_URL = 'http://client.localhost:8000/';

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
  // Use the global handler for consistency
  window.handleUnauthorized();
}

// Generic API call function with unauthorized handling
export const apiCall = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: getAuthHeaders(),
    ...options
  };

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
  const response = await fetch(`${API_BASE_URL}/login/`, {
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
