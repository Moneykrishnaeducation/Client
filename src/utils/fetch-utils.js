// JWT Authentication Utilities
class AuthenticatedFetch {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
    }

    // Get JWT token from localStorage
    getToken() {
        return localStorage.getItem('jwt_token');
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;
        
        // Allow mock tokens for development/testing
        if (token === 'dummy-jwt-token-000' || token.startsWith('dummy-')) {
            console.info('Mock token detected, bypassing JWT validation');
            return true;
        }
        
        try {
            // Basic token validation (check if it's not expired)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Date.now() / 1000;
            return payload.exp > now;
        } catch (error) {
            console.warn('Invalid token format:', error);
            return false;
        }
    }

    // Create headers with authorization
    createHeaders(additionalHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...additionalHeaders
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    // Generic fetch wrapper with authentication
    async fetchWithAuth(url, options = {}) {
        // Ensure exactly one slash between baseURL and url
        let fullUrl;
        if (this.baseURL.endsWith('/') && url.startsWith('/')) {
            fullUrl = this.baseURL + url.slice(1);
        } else if (!this.baseURL.endsWith('/') && !url.startsWith('/')) {
            fullUrl = this.baseURL + '/' + url;
        } else {
            fullUrl = this.baseURL + url;
        }

        // Merge headers
        const headers = this.createHeaders(options.headers);

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(fullUrl, config);

            // Handle authentication errors
            if (response.status === 401) {
                console.warn('Authentication failed - redirecting to login');
                this.handleAuthError();
                throw new Error('Authentication failed');
            }

            // Handle other HTTP errors
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Try to parse JSON, fallback to text
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    // Handle authentication errors
    handleAuthError() {
        // Use the global handler for consistency
        window.handleUnauthorized();
    }

    // GET request
    async get(url, headers = {}) {
        return this.fetchWithAuth(url, {
            method: 'GET',
            headers
        });
    }

    // POST request
    async post(url, data = null, headers = {}) {
        const options = {
            method: 'POST',
            headers
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        return this.fetchWithAuth(url, options);
    }

    // PUT request
    async put(url, data = null, headers = {}) {
        const options = {
            method: 'PUT',
            headers
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        return this.fetchWithAuth(url, options);
    }

    // DELETE request
    async delete(url, headers = {}) {
        return this.fetchWithAuth(url, {
            method: 'DELETE',
            headers
        });
    }
}

// Create global instance for API calls
// Use API_BASE from api-config.js or fallback to empty string
const apiClient = new AuthenticatedFetch(window.API_BASE || '');

// Convenience functions for common API endpoints
const API = {
    // Client panel endpoints
    getUserInfo: () => apiClient.get('/user-info/'),
    // Try a few endpoint variants and normalize the response to an array
    getRecentTransactions: async () => {
        const variants = [
            '/recent-transactions/',
            '/client/api/recent-transactions/',
            '/api/recent-transactions/'
        ];

        for (const v of variants) {
            try {
                const res = await apiClient.get(v);
                // If the response is already an array, return it
                if (Array.isArray(res)) return res;

                // If the response is an object with a results/list key, normalize
                if (res && typeof res === 'object') {
                    if (Array.isArray(res.results)) return res.results;
                    if (Array.isArray(res.data)) return res.data;
                    // Some views return {transactions: [...]}
                    for (const key of ['transactions', 'items', 'activities']) {
                        if (Array.isArray(res[key])) return res[key];
                    }
                }

                // If it's a single object, wrap it into an array
                if (res && typeof res === 'object') return [res];

                // If it's a string (HTML or error), continue to next variant
            } catch (err) {
                // Try next variant silently
                console.warn('getRecentTransactions variant failed:', v, err.message || err);
                continue;
            }
        }

        // If none succeeded, throw a unified error
        throw new Error('Could not fetch recent transactions from any known endpoint');
    },
    getStatsOverview: () => apiClient.get('/stats-overview/'),
    
    // Generic API call
    call: (endpoint, method = 'GET', data = null) => {
        switch (method.toUpperCase()) {
            case 'GET':
                return apiClient.get(endpoint);
            case 'POST':
                return apiClient.post(endpoint, data);
            case 'PUT':
                return apiClient.put(endpoint, data);
            case 'DELETE':
                return apiClient.delete(endpoint);
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthenticatedFetch, apiClient, API };
} else {
    // Browser environment - attach to window
    window.AuthenticatedFetch = AuthenticatedFetch;
    window.apiClient = apiClient;
    window.API = API;
}