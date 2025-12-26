// Authentication utilities
window.authUtils = {
    // Authentication state
    state: {
        initialized: false,
        checking: false,
        authenticated: false,
        lastCheck: null
    },

    /**
     * Initialize authentication
     */
    init() {
        if (this.state.initialized) return;
        
        // Tokens are now in HttpOnly cookies - server handles authentication
        this.state.authenticated = false; // Server validates via cookie
        this.state.initialized = true;
    },

    /**
     * Check if user is authenticated
     * @returns {Promise<boolean>}
     */
    async checkAuth() {
        if (!this.state.initialized) {
            this.init();
        }

        // Prevent multiple simultaneous checks
        if (this.state.checking) {
            return this.state.authenticated;
        }

        try {
            this.state.checking = true;

            // Token is in HttpOnly cookie - server will validate automatically
            // No need to check localStorage
            this.state.authenticated = true;
            return true;
        } finally {
            this.state.checking = false;
            this.state.lastCheck = Date.now();
        }
    },
    /**
     * Refresh authentication token
     * @returns {Promise<boolean>}
     */
    async refreshToken() {
        try {
            // Tokens are now in HttpOnly cookies - server handles token refresh automatically
            // No need to refresh manually
            console.log('Token refresh handled server-side via HttpOnly cookies');
            this.state.authenticated = true;
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.state.authenticated = false;
            
            // Tokens are in HttpOnly cookies - server handles cleanup
            return false;
        }
    },

    /**
     * Show authentication error and login dialog
     * @param {string} message 
     * @param {HTMLElement} container 
     */
    showAuthError(message, container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <p>${message}</p>
                <div class="error-buttons">
                    <button onclick="window.authUtils.showLoginDialog()" class="btn-primary">Login</button>
                    <button onclick="window.location.reload()" class="btn-secondary">Refresh Page</button>
                </div>
            </div>
        `;

        if (container) {
            container.innerHTML = '';
            container.appendChild(errorDiv);
        } else {
            document.body.appendChild(errorDiv);
        }
    },

    /**
     * Show login dialog
     */
    showLoginDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'login-dialog';
        dialog.innerHTML = `
            <div class="login-dialog-content">
                <h3>Please Log In</h3>
                <form id="login-form" onsubmit="return window.authUtils.handleLogin(event)">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" class="btn-primary">Login</button>
                        <button type="button" class="btn-secondary" onclick="this.closest('.login-dialog').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(dialog);
    },    /**
     * Handle login form submission
     * @param {Event} event 
     */    async handleLogin(event) {
        event.preventDefault();
        
        const form = event.target;
        const username = form.username.value;
        const password = form.password.value;

        try {
            // Use proper API configuration
            const endpoint = window.API_CONFIG ? window.API_CONFIG.getEndpoint('login/') : '/client/api/login/';

            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            
            if (!data.access_token) {
                throw new Error('Invalid login response');
            }

            // Tokens are now in HttpOnly cookies - no need to store in localStorage
            // Server handles token storage and management
            this.state.authenticated = true;
            
            // Remove login dialog and refresh page
            form.closest('.login-dialog').remove();
            window.location.reload();
            
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            const errorDiv = form.querySelector('.login-error') || document.createElement('div');
            errorDiv.className = 'login-error';
            errorDiv.textContent = 'Login failed. Please try again.';
            form.insertBefore(errorDiv, form.firstChild);
            return false;
        }
    },

    /**
     * Get authentication token
     * @returns {string|null}
     */
    getToken() {
        // Token is in HttpOnly cookie, not localStorage
        return null;
    }
};