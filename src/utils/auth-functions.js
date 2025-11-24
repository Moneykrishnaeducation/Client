import { apiCall } from './api.js';

// Signup function
export const signup = async (userData) => {
  try {
    const response = await fetch('http://client.localhost:8000/signup/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.detail || 'Signup failed');
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Send reset OTP function
export const sendResetOtp = async (email) => {
  try {
    const response = await fetch('http://client.localhost:8000/api/send-reset-otp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.detail || 'Failed to send OTP');
    }

    return data;
  } catch (error) {
    console.error('Send reset OTP error:', error);
    throw error;
  }
};

// Verify OTP function
export const verifyOtp = async (email, otp) => {
  try {
    const response = await fetch('http://client.localhost:8000/api/verify-otp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.detail || 'OTP verification failed');
    }

    return data;
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
};

// Reset password function
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await fetch('http://client.localhost:8000/api/reset-password/confirm/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, new_password: newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.detail || 'Password reset failed');
    }

    return data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

// Resend login OTP function
export const resendLoginOtp = async (email) => {
  try {
    const response = await fetch('http://client.localhost:8000/resend-otp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.detail || 'Failed to resend OTP');
    }

    return data;
  } catch (error) {
    console.error('Resend login OTP error:', error);
    throw error;
  }
};

// Get login OTP status function
export const getLoginOtpStatus = async (email) => {
  try {
    const response = await fetch(`http://client.localhost:8000/login-otp-status/?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.detail || 'Failed to get OTP status');
    }

    return data;
  } catch (error) {
    console.error('Get login OTP status error:', error);
    throw error;
  }
};
