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
        
        // Check for existing tokens
        const token = localStorage.getItem('jwt_token');
        if (token) {
            try {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                this.state.authenticated = tokenData.exp * 1000 > Date.now();
            } catch (e) {
                console.error('Invalid token format:', e);
                this.state.authenticated = false;
            }
        }
        
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

            const token = localStorage.getItem('jwt_token');
            if (!token) {
                this.state.authenticated = false;
                window.handleUnauthorized();
                return false;
            }

            // Check if token is expired
            try {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                if (tokenData.exp * 1000 < Date.now()) {
                    // Token is expired, try to refresh
                    return await this.refreshToken();
                }
            } catch (e) {
                console.error('Invalid token format:', e);
                this.state.authenticated = false;
                window.handleUnauthorized();
                return false;
            }

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
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                return false;
            }

            // Since there's no refresh endpoint, just return false
            // This will trigger a re-login
            return false;

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data = await response.json();
            
            if (!data.access_token) {
                throw new Error('Invalid refresh response');
            }

            // Store new tokens
            localStorage.setItem('jwt_token', data.access_token);
            if (data.refresh_token) {
                localStorage.setItem('refreshToken', data.refresh_token);
            }

            this.state.authenticated = true;
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.state.authenticated = false;
            
            // Clear tokens on refresh failure
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('refreshToken');
            
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
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            
            if (!data.access_token) {
                throw new Error('Invalid login response');
            }

            // Store tokens
            localStorage.setItem('jwt_token', data.access_token);
            if (data.refresh_token) {
                localStorage.setItem('refreshToken', data.refresh_token);
            }

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
        return localStorage.getItem('jwt_token');
    }
};
