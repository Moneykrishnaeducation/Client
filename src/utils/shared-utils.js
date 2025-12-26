// Shared utility functions for client-side JavaScript
const tradingUtils = {};
const sharedUtils = {};

// Initialize authentication state
tradingUtils.authState = {
    initialized: false,
    checking: false,
    authenticated: false,
    lastCheck: null
};

// Define core authentication methods that other modules depend on
tradingUtils.checkAuth = async function() {
    // Prevent multiple simultaneous checks
    if (this.authState.checking) {
        return this.authState.authenticated;
    }

    try {
        this.authState.checking = true;
        // Token is in HttpOnly cookie - server validates automatically
        this.authState.authenticated = true;
        return true;

    } finally {
        this.authState.checking = false;
        this.authState.lastCheck = Date.now();
    }
};

// Extend tradingUtils with additional authentication and UI methods
Object.assign(tradingUtils, {
    /**
     * Get all authentication tokens
     * @returns {Object} Object containing all tokens
     */
    getAuthTokens() {
        // Tokens are in HttpOnly cookies, not localStorage
        return {
            jwt: null,
            refresh: null,
            access: null
        };
    },

    /**
     * Get bearer token for API calls
     * @returns {string|null} Bearer token or null if not authenticated
     */
    getBearerToken() {
        // Token is in HttpOnly cookie, not localStorage
        return null;
    },


    /**
     * Create a notification element
     * @param {string} message - Message to display
     * @param {string} type - Type of notification ('error' or 'success')
     * @returns {HTMLElement} The notification element
     */
    createNotification(message, type) {
        const notif = document.createElement('div');
        notif.className = `${type}-message animate-in`;

        const msgSpan = document.createElement('span');
        msgSpan.textContent = message;
        notif.appendChild(msgSpan);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.className = 'notification-close';
        closeBtn.onclick = () => {
            notif.classList.add('animate-out');
            notif.addEventListener('animationend', () => notif.remove());
        };
        notif.appendChild(closeBtn);

        return notif;
    },

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    async showError(message) {
        // Remove any existing error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        // Add new error message
        const errorDiv = this.createNotification(message, 'error');
        document.body.appendChild(errorDiv);
    },

    /**
     * Show success message
     * @param {string} message - Success message to display
     */
    showSuccess: function(message) {
        // Remove any existing success messages
        document.querySelectorAll('.success-message').forEach(el => el.remove());

        // Add new success message
        const successDiv = this.createNotification(message, 'success');
        document.body.appendChild(successDiv);
    },    /**
     * Show login dialog
     * @param {string} [message] - Optional custom message to show
     */
    showLoginDialog: function(message = 'Your session has expired. Please log in again to continue.') {
        // Clean up any existing dialogs first
        document.querySelectorAll('.login-dialog').forEach(el => el.remove());

        const loginDiv = document.createElement('div');
        loginDiv.className = 'login-dialog';
        loginDiv.innerHTML = `
            <div class="login-dialog-content">
                <h3>Authentication Required</h3>
                <p>${message}</p>
                <div class="login-buttons">
                    <button class="btn-primary">Login</button>
                    <button class="btn-secondary">Refresh Page</button>
                    <button class="btn-tertiary">Dismiss</button>
                </div>
            </div>
        `;

        // Add event listeners
        loginDiv.querySelector('.btn-primary').onclick = () => tradingUtils.handleLogin();
        loginDiv.querySelector('.btn-secondary').onclick = () => tradingUtils.handleRefresh();
        loginDiv.querySelector('.btn-tertiary').onclick = () => loginDiv.remove();

        document.body.appendChild(loginDiv);
        loginDiv.querySelector('.btn-primary')?.focus();
    },

    /**
     * Handle login button click
     */
    handleLogin: function() {
        // Save current page URL for redirect after login
        sessionStorage.setItem('loginRedirect', window.location.href);
        window.location.href = '/login';
    },

    /**
     * Handle refresh button click
     */
    handleRefresh: function() {
        window.location.reload();
    },

    /**
     * Dismiss login dialog
     */
    dismissLoginDialog: function(button) {
        const dialog = button.closest('.login-dialog');
        if (dialog) {
            dialog.remove();
        }
    },    /**
     * Refresh authentication token
     * @returns {Promise<string>} New access token
     */
    refreshToken: async function() {
        try {
            // Tokens are in HttpOnly cookies - server handles refresh automatically
            console.log('Token refresh handled server-side via HttpOnly cookies');
            return null; // Tokens managed by server
        } catch (error) {
            // Clear tokens on any error
            this.clearAuthTokens();
            throw error;
        }
    },

    /**
     * Clear all authentication tokens
     */
    clearAuthTokens: function() {
        // Tokens are in HttpOnly cookies - server handles cleanup
        // No need to remove from localStorage
        this.authState.authenticated = false;
        this.authState.lastCheck = Date.now();
    },

    /**
     * Close any open popup/modal
     */
    closePopup: function() {
        const overlay = document.getElementById('popup-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
});

// Original sharedUtils methods
Object.assign(sharedUtils, {
    /**
     * Format a number as currency
     * @param {number} amount - The amount to format
     * @param {string} currency - Currency code (default: USD)
     * @returns {string} Formatted currency string
     */
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    /**
     * Format a date string
     * @param {string} dateString - Date string to format
     * @returns {string} Formatted date string
     */
    formatDate: function(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Display a toast message
     * @param {string} message - Message to display
     * @param {string} type - Message type (success, error, warning, info)
     */
    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        const container = document.getElementById('toast-container') || (() => {
            const div = document.createElement('div');
            div.id = 'toast-container';
            document.body.appendChild(div);
            return div;
        })();

        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    /**
     * Show loading spinner
     * @param {HTMLElement} container - Container element for spinner
     * @param {string} message - Loading message
     */
    showLoading: function(container, message = 'Loading...') {
        container.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <div class="loading-message">${message}</div>
            </div>
        `;
    },

    /**
     * Hide loading spinner
     * @param {HTMLElement} container - Container element with spinner
     */
    hideLoading: function(container) {
        const spinner = container.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    },

    /**
     * Convert leverage value to string format
     * @param {number|string} leverage - Leverage value
     * @returns {string} Formatted leverage string
     */
    formatLeverage: function(leverage) {
        if (typeof leverage === 'string' && leverage.includes(':')) {
            return leverage;
        }
        return `1:${leverage}`;
    },

    /**
     * Check if a string is a valid decimal number
     * @param {string} value - Value to check
     * @returns {boolean} True if valid decimal
     */
    isValidDecimal: function(value) {
        return /^\d*\.?\d*$/.test(value);
    },

    /**
     * Validate required form fields
     * @param {HTMLFormElement} form - Form element to validate
     * @returns {boolean} True if all required fields are filled
     */
    validateForm: function(form) {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                this.showToast(`${field.name || 'Field'} is required`, 'error');
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        return isValid;
    },

    /**
     * Format account status with icon
     * @param {string} status - Account status
     * @returns {string} Formatted status with icon
     */
    formatAccountStatus: function(status) {
        const icons = {
            'Live': '🟢',
            'Demo': '🟡',
            'Disabled': '🔴',
            'Offline': '⚫'
        };
        return `${icons[status] || '❔'} ${status}`;
    },

    /**
     * Show login dialog or redirect to login page
     */
    showLoginDialog() {
        // First try to refresh the token
        this.refreshToken().catch(() => {
            // If refresh fails, show login options
            const loginOptions = document.createElement('div');
            loginOptions.className = 'login-dialog';
            loginOptions.innerHTML = `
                <div class="login-dialog-content">
                    <h3>Session Expired</h3>
                    <p>Your session has expired. Please log in again to continue.</p>
                    <div class="login-buttons">
                        <button onclick="window.location.href='/login'" class="btn-primary">Login</button>
                        <button onclick="window.location.reload()" class="btn-secondary">Refresh Page</button>
                    </div>
                </div>
            `;

            document.body.appendChild(loginOptions);
        });
    },

    /**
     * Handle session expiry
     */
    handleSessionExpiry() {
        // Tokens are in HttpOnly cookies - server handles cleanup
        // No need to remove from localStorage

        // Show login dialog
        this.showLoginDialog();
    },

    /**
     * Attempt to refresh the authentication token
     */
    async refreshToken() {
        // Tokens are in HttpOnly cookies - server handles refresh automatically
        console.log('Token refresh handled server-side via HttpOnly cookies');
        return null; // Tokens managed by server
    }
});

// Export for use in React
export { tradingUtils, sharedUtils };
