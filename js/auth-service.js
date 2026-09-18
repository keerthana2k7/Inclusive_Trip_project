/**
 * Inclusive Trip Project - Authentication Service
 * Fulfills Jira ITD-12 Requirements
 * 
 * Provides unified authentication API client with automatic backend connectivity
 * and a robust fallback mock responder for standalone development & testing.
 */

class AuthService {
  constructor() {
    // Configurable endpoint for production backend
    this.apiBaseUrl = window.ENV_API_URL || '/api/v1';
    this.storageKeyToken = 'itd_auth_token';
    this.storageKeyUser = 'itd_auth_user';

    // Built-in test accounts for testing ITD-12 when backend server is offline
    this.mockAccounts = [
      {
        email: 'traveler@inclusivetrip.org',
        password: 'Password@123',
        name: 'Alex Morgan',
        role: 'Traveler'
      },
      {
        email: 'keerthana@inclusivetrip.org',
        password: 'TripPass@2026',
        name: 'Keerthana',
        role: 'Trip Coordinator'
      }
    ];
  }

  /**
   * Authenticate user with Email and Password
   * @param {string} email 
   * @param {string} password 
   * @param {boolean} rememberMe 
   * @returns {Promise<{success: boolean, user?: object, message?: string, token?: string}>}
   */
  async login(email, password, rememberMe = false) {
    const payload = {
      email: email.trim().toLowerCase(),
      password: password
    };

    // Attempt actual backend API call first
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        this._saveSession(data.token, data.user, rememberMe);
        return {
          success: true,
          token: data.token,
          user: data.user
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || (response.status === 401 ? 'Invalid email or password' : 'Authentication failed. Please try again.')
        };
      }
    } catch (networkError) {
      // Backend not running/unreachable; fallback gracefully to simulated auth service for local testing
      console.warn('[AuthService] Live backend unreachable, engaging local mock auth provider for ITD-12 testing:', networkError.message);
      return this._simulateMockLogin(payload.email, payload.password, rememberMe);
    }
  }

  /**
   * Mock responder simulating backend authentication logic and HTTP latency
   * @private
   */
  async _simulateMockLogin(email, password, rememberMe) {
    // Simulate 400ms realistic network latency
    await new Promise(resolve => setTimeout(resolve, 400));

    // Find account in mock store
    const matchedAccount = this.mockAccounts.find(
      acc => acc.email === email && acc.password === password
    );

    if (matchedAccount) {
      const mockToken = 'itd_jwt_' + btoa(`${email}:${Date.now()}`);
      const userProfile = {
        name: matchedAccount.name,
        email: matchedAccount.email,
        role: matchedAccount.role
      };

      this._saveSession(mockToken, userProfile, rememberMe);

      return {
        success: true,
        token: mockToken,
        user: userProfile
      };
    } else {
      // ITD-12 Requirement #8: Display a clear error message for invalid credentials
      return {
        success: false,
        message: 'Invalid email or password. Please verify your credentials and try again.'
      };
    }
  }

  /**
   * Persist authentication state
   * @private
   */
  _saveSession(token, user, rememberMe) {
    const storage = rememberMe ? localStorage : sessionStorage;
    // Clear opposite storage to avoid stale sessions
    localStorage.removeItem(this.storageKeyToken);
    localStorage.removeItem(this.storageKeyUser);
    sessionStorage.removeItem(this.storageKeyToken);
    sessionStorage.removeItem(this.storageKeyUser);

    storage.setItem(this.storageKeyToken, token);
    storage.setItem(this.storageKeyUser, JSON.stringify(user));
  }

  /**
   * Get currently active session token
   */
  getToken() {
    return localStorage.getItem(this.storageKeyToken) || sessionStorage.getItem(this.storageKeyToken);
  }

  /**
   * Get logged-in user profile
   */
  getCurrentUser() {
    const raw = localStorage.getItem(this.storageKeyUser) || sessionStorage.getItem(this.storageKeyUser);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return Boolean(this.getToken() && this.getCurrentUser());
  }

  /**
   * Clear session and log out
   */
  logout() {
    localStorage.removeItem(this.storageKeyToken);
    localStorage.removeItem(this.storageKeyUser);
    sessionStorage.removeItem(this.storageKeyToken);
    sessionStorage.removeItem(this.storageKeyUser);
  }
}

// Export singleton
window.authService = new AuthService();
