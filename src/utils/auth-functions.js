import { apiCall } from './api.js';

// Login function
export const login = async (userData) => {
  try {
    // Add performance timing for debugging
    const loginStart = performance.now();

    const result = await apiCall('/api/login/', { method: 'POST', body: JSON.stringify(userData) });

    // If server asks for verification (new IP) return verification required flag
    if (result && result.verification_required) {
      // Persist pending verification so refresh/close cannot bypass
      try { localStorage.setItem('login_verification_pending', JSON.stringify({ email: (userData.email||'').toLowerCase(), message: result.message || '' })); } catch(e){}
      // Return result with verification_required flag for Login.jsx to handle
      return { verification_required: true, message: result.message };
    }

    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Signup function
export const signup = async (userData) => {
  try {
    const data = await apiCall('/api/signup/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Send reset OTP function
export const sendResetOtp = async (email) => {
  try {
    const data = await apiCall('/api/send-reset-otp/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return data;
  } catch (error) {
    console.error('Send reset OTP error:', error);
    throw error;
  }
};

// Verify OTP function
export const verifyOtp = async (email, otp) => {
  try {
    const data = await apiCall('/api/verify-otp/', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    return data;
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
};

// Reset password function
export const resetPassword = async (email, newPassword) => {
  try {
    const data = await apiCall('/api/reset-password/confirm/', {
      method: 'POST',
      body: JSON.stringify({ email, new_password: newPassword }),
    });
    return data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

// Resend login OTP function
export const resendLoginOtp = async (email) => {
  try {
    const data = await apiCall('/api/resend-login-otp/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return data;
  } catch (error) {
    console.error('Resend login OTP error:', error);
    throw error;
  }
};

// Get login OTP status function
export const getLoginOtpStatus = async (email) => {
  try {
    const data = await apiCall(`/api/login-otp-status/?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });
    return data;
  } catch (error) {
    console.error('Get login OTP status error:', error);
    throw error;
  }
};
