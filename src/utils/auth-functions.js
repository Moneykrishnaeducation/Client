import { apiCall } from './api.js';

// Login function
export const login = async (userData) => {
  try {
    // Add performance timing for debugging
    const loginStart = performance.now();

    const result = await apiCall('/login/', { method: 'POST', body: JSON.stringify(userData) });

    // If server asks for verification (new IP) show verification UI and stop here
    if (result && result.verification_required) {
      let pendingLoginEmail = userData.email;
      const overlay = document.getElementById('verificationModalOverlay');
      const vError = document.getElementById('verificationError');
      if (overlay) {
        overlay.style.display = 'flex';
      }
      // Persist pending verification so refresh/close cannot bypass
      try { localStorage.setItem('login_verification_pending', JSON.stringify({ email: (pendingLoginEmail||'').toLowerCase(), message: result.message || '' })); } catch(e){}
      // Send the OTP since verification is required
      try {
        await apiCall('/resend-otp/', { method: 'POST', body: JSON.stringify({ email: pendingLoginEmail }) });
      } catch (e) {
        console.error('Failed to send initial OTP:', e);
      }
      // Query server for persisted cooldown and OTP expiry so reloads preserve cooldown
      try {
        const statusEndpoint = `/login-otp-status/?email=${encodeURIComponent(pendingLoginEmail)}`;
        apiCall(statusEndpoint, { method: 'GET' }).then((data) => {
          if (data) {
            const retry = data.retry_after || 0;
                  const otpExpires = data.otp_expires_in || 0;
            if (retry && retry > 0) {
              // Start cooldown with server-provided remaining seconds
              const resendTimerEl = document.getElementById('resendTimer');
              const resendCooldownEl = document.getElementById('resendCooldown');
              const resendBtnLocal = document.getElementById('resendOtpBtn');
              if (resendBtnLocal) resendBtnLocal.disabled = true;
              if (resendCooldownEl) resendCooldownEl.style.display = 'inline-block';
              if (resendTimerEl) resendTimerEl.textContent = String(retry);
              // Kick off a local countdown to update the UI
              let remaining = retry;
              const interval = setInterval(() => {
                remaining -= 1;
                if (remaining <= 0) {
                  clearInterval(interval);
                  if (resendBtnLocal) resendBtnLocal.disabled = false;
                  if (resendCooldownEl) resendCooldownEl.style.display = 'none';
                } else {
                  if (resendTimerEl) resendTimerEl.textContent = String(remaining);
                }
              }, 1000);
            }
            // Start OTP expiry countdown if provided
            if (otpExpires && otpExpires > 0) {
              const otpExpiryEl = document.getElementById('otpExpiry');
              const otpExpiryTimerEl = document.getElementById('otpExpiryTimer');
              if (otpExpiryEl) otpExpiryEl.style.display = 'block';
              if (otpExpiryTimerEl) otpExpiryTimerEl.textContent = String(otpExpires);
              let expRemaining = otpExpires;
              const expInterval = setInterval(() => {
                expRemaining -= 1;
                if (expRemaining <= 0) {
                  clearInterval(expInterval);
                  if (otpExpiryEl) otpExpiryEl.style.display = 'none';
                } else {
                  if (otpExpiryTimerEl) otpExpiryTimerEl.textContent = String(expRemaining);
                }
              }, 1000);
            }
          }
        }).catch(() => {});
      } catch (e) {
        // ignore status fetch errors — fallback to client-side cooldown
      }
      if (vError) { vError.style.display = 'none'; vError.textContent = ''; }
      showNotification(result.message || 'Verification code sent to your email.', 'success', 4000);
      return;
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
    const response = await fetch(`http://client.localhost:8000/api/login-otp-status/?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to get OTP status');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Get login OTP status error:', error);
    throw error;
  }
};
