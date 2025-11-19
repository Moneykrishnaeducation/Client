/**
 * Production-Ready API Configuration
 * 
 * This script automatically detects localhost vs production domain
 * and configures API endpoints accordingly.
 */

// Function to determine the correct API base URL
function getApiBase() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    
    
    // Production domain detection
    const isProduction = hostname.includes('vtindex.com') || 
                        (!hostname.includes('localhost') && !hostname.includes('127.0.0.1'));
    
    const isClientSubdomain = hostname.startsWith('client.');
    
    if (isProduction) {
        // On production, all API calls go to /client/ regardless of subdomain
        return '/client/api';
    } else {
        // Development behavior (existing)
        if (isClientSubdomain) {
            return '/api';
        } else {
            return '/client';
        }
    }
}

// Initialize API configuration only if it hasn't been initialized yet
if (!window.API_CONFIG) {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    const fullOrigin = `${protocol}//${hostname}${port ? ':' + port : ''}`;
    
    // Initialize API configuration
    window.API_CONFIG = {
        hostname,
        isSubdomain: hostname.startsWith('client.'),
        isProduction: hostname.includes('vtindex.com') || 
                     (!hostname.includes('localhost') && !hostname.includes('127.0.0.1')),
        apiBase: getApiBase(),
        fullOrigin,
        
        getEndpoint(path) {
            const cleanPath = path.replace(/^\/+/, '');
            return `${this.apiBase}/${cleanPath}`;
        },

        getHeaders(includeContentType = true) {
            const token = localStorage.getItem('jwt_token');
            const headers = {
                'Authorization': token ? `Bearer ${token}` : '',
                'Accept': 'application/json'
            };

            if (includeContentType) {
                headers['Content-Type'] = 'application/json';
            }

            // Add CSRF token for POST, PUT, PATCH, DELETE requests
            const csrfToken = this.getCsrfToken();
            if (csrfToken) {
                headers['X-CSRFToken'] = csrfToken;
            }

            return headers;
        },

        getCsrfToken() {
            // First try to get from cookie
            const name = 'csrftoken=';
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookieParts = decodedCookie.split(';');
            for (let part of cookieParts) {
                part = part.trim();
                if (part.indexOf(name) === 0) {
                    return part.substring(name.length, part.length);
                }
            }
            
            // Then try to get from meta tag
            const csrfElement = document.querySelector('meta[name="csrf-token"]');
            if (csrfElement) {
                return csrfElement.getAttribute('content');
            }

            return null;
        }
    };

    // Global API_BASE for legacy compatibility
    window.API_BASE = window.API_CONFIG.apiBase;

}

// Set the global API_BASE variable
const API_BASE = window.API_CONFIG.apiBase;

// Debug logging


// Make API_BASE and utility functions available globally
// Force API_BASE to empty string for client panel endpoints at root
window.API_BASE = '';
window.getApiHeaders = window.API_CONFIG.getHeaders.bind(window.API_CONFIG);
window.getCsrfToken = window.API_CONFIG.getCsrfToken.bind(window.API_CONFIG);

// Global unauthorized access handler
window.handleUnauthorized = function() {
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
};
