// /mnt/data/Login.jsx
import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login, signup, sendResetOtp, verifyOtp, resetPassword, resendLoginOtp, getLoginOtpStatus } from "../utils/auth-functions";

export default function Login() {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [forgotActive, setForgotActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetStep, setResetStep] = useState(0); // 0: enter email, 1: enter OTP, 2: set new password
  const [notification, setNotification] = useState({ show: false, type: "success", message: "" });
  // controlled password fields for strength calculation
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");

  // Form states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpDob, setSignUpDob] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(60);
  const [verificationError, setVerificationError] = useState("");

  // compute strength class (returns tailwind class name string)
  function computeStrengthClass(pwd) {
    if (!pwd) return "";
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score >= 3 && pwd.length >= 8) return "strength-strong";
    if (score >= 2) return "strength-medium";
    return "strength-weak";
  }

  // Derived CSS classes for strength (Tailwind-friendly)
  function strengthClasses(flag) {
    // flag is one of '', 'strength-weak', 'strength-medium', 'strength-strong'
    switch (flag) {
      case "strength-weak":
        return "ring-0 border-[#FF5252]/60 shadow-[0_0_18px_rgba(255,82,82,0.18)]";
      case "strength-medium":
        return "ring-0 border-[#F4A23B]/60 shadow-[0_0_20px_rgba(244,162,59,0.18)]";
      case "strength-strong":
        return "ring-0 border-[#23D396]/60 shadow-[0_0_22px_rgba(35,211,150,0.22)]";
      default:
        return "border-[#d4af3740] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]";
    }
  }

  const containerClass = `${rightPanelActive ? "right-panel-active" : ""} ${forgotActive ? "forgot-password-active" : ""}`.trim();

  // auto-hide notification after show
  useEffect(() => {
    if (notification.show) {
      const t = setTimeout(() => setNotification({ show: false, type: "success", message: "" }), 3000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // OTP expiry timer
  useEffect(() => {
    if (showVerificationModal && otpExpiry > 0) {
      const timer = setTimeout(() => setOtpExpiry(otpExpiry - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showVerificationModal, otpExpiry]);

  useEffect(() => {
    // Auto-login on page load if a token exists (and validate it),
    // and listen for storage events so other tabs can detect login.
    (function() {
      const apiBase = (window.API_CONFIG && window.API_CONFIG.apiBase) ? window.API_CONFIG.apiBase : '/client';

      function getStoredAccessToken() {
        return localStorage.getItem('jwt_token') || localStorage.getItem('accessToken') ||
              sessionStorage.getItem('jwt_token') || sessionStorage.getItem('accessToken') || null;
      }

      async function validateAndRedirect(token) {
        if (!token) return;
        try {
          // The server ValidateTokenView expects an authenticated request.
          // Send the token as a Bearer Authorization header and use GET.
          const res = await fetch(`${apiBase}/validate-token/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          if (!res.ok) return;
          const data = await res.json();
          // If we get a successful response, redirect
          if (data && (data.message || data.user)) {
            window.location.href = '/dashboard';
          }
        } catch (err) {
          console.debug('Auto-login validation error', err);
        }
      }

      // Run on load: if token exists, redirect immediately to dashboard
      // However, if there's a referral code in the URL we should open the signup panel
      const token = getStoredAccessToken();
      const urlParamsOnLoad = new URLSearchParams(window.location.search);
      const initialRef = urlParamsOnLoad.get('ref');
      if (token && !initialRef) {
        // Immediate redirect — assume token validity; server will reject protected endpoints if invalid
        window.location.href = '/dashboard';
      } else if (initialRef) {
        setRightPanelActive(true);
      }

      // Cross-tab: when other tab writes a token, redirect immediately
      window.addEventListener('storage', (ev) => {
        if (!ev.key) return;
        const interesting = ['jwt_token','accessToken','refresh_token','refreshToken','userEmail','user_email'];
        if (interesting.includes(ev.key)) {
          const newToken = getStoredAccessToken();
          if (newToken) window.location.href = '/dashboard';
        }
      });
    })();
  }, []);

  // Handle sign in
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Check OTP status before attempting login
      const otpStatus = await getLoginOtpStatus(signInEmail);
      if (otpStatus.otp_required) {
        setShowVerificationModal(true);
        setNotification({ show: true, type: "success", message: "OTP verification required. Please verify to continue." });
        setLoading(false);
        return;
      }

      const response = await login({ email: signInEmail, password: signInPassword });

      if (response && response.verification_required) {
        // Server indicated verification is required. Do NOT auto-resend here
        // (some servers already send the OTP). Instead query status for cooldown/expiry
        try {
          const status = await getLoginOtpStatus(signInEmail);
          if (status.retry_after) setResendCooldown(status.retry_after);
          if (status.otp_expires_in) setOtpExpiry(status.otp_expires_in);
        } catch (e) {
          console.error('Failed to get OTP status:', e);
        }
        setShowVerificationModal(true);
        setNotification({ show: true, type: "success", message: response.message || "Verification code sent to your email." });
        setLoading(false);
        return;
      }

      if (response && response.success) {
        // Check if OTP verification is required
        if (response.otp_required) {
          setShowVerificationModal(true);
          setNotification({ show: true, type: "success", message: "OTP sent to your email. Please verify to continue." });
        } else {
          const successMessage = response.message || 'Login successful! Welcome back!';
          setNotification({ show: true, type: "success", message: successMessage });

          // Check if auto-login tokens are provided
          if (response.auto_login && response.access && response.refresh) {
            // Remember preference (default to true for login)
            const remember = true; // Could be made configurable later
            const storage = remember ? localStorage : sessionStorage;

            // Store auth tokens and user info for auto-login
            storage.setItem('jwt_token', response.access);
            storage.setItem('accessToken', response.access);
            storage.setItem('refresh_token', response.refresh);
            storage.setItem('refreshToken', response.refresh);
            storage.setItem('user_role', response.role);
            storage.setItem('userRole', response.role);

            // Store emails in lowercase for frontend consistency
            const signinEmail = (response.user && response.user.email) ? response.user.email.toLowerCase() : '';
            storage.setItem('user_email', signinEmail);
            storage.setItem('userEmail', signinEmail);
            storage.setItem('user_name', response.user.name);
            storage.setItem('userName', response.user.name);

            // Show auto-login notification
            setNotification({
              show: true,
              type: "success",
              message: `Welcome back, ${response.user.name}! Redirecting to dashboard...`
            });

            // Redirect to main dashboard immediately after login auto-login
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 2000);
          } else {
            // Fallback: direct redirect if no auto-login
            window.location.href = '/dashboard';
          }
        }
      } else {
        const errorMessage = response.error || 'Login failed.';
        setNotification({ show: true, type: "error", message: errorMessage });
      }
    } catch (error) {
      setNotification({ show: true, type: "error", message: error.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  // Handle sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (signUpPassword !== signUpConfirm) {
      setNotification({ show: true, type: "error", message: "Passwords do not match" });
      return;
    }
    setLoading(true);
    try {
      const userData = {
        name: signUpName,
        email: signUpEmail,
        phone: signUpPhone,
        dob: signUpDob,
        password: signUpPassword,
      };
      const result = await signup(userData);

      if (result && result.success) {
        const successMessage = result.message || 'Registration successful! Welcome to VT-Index!';
        setNotification({ show: true, type: "success", message: successMessage });

        // Check if auto-login tokens are provided
        if (result.auto_login && result.access && result.refresh) {
          // Remember preference (default to true for signup)
          const remember = true; // Could be made configurable later
          const storage = remember ? localStorage : sessionStorage;

          // Store auth tokens and user info for auto-login
          storage.setItem('jwt_token', result.access);
          storage.setItem('accessToken', result.access);
          storage.setItem('refresh_token', result.refresh);
          storage.setItem('refreshToken', result.refresh);
          storage.setItem('user_role', result.role);
          storage.setItem('userRole', result.role);

          // Store emails in lowercase for frontend consistency
          const signupEmail = (result.user && result.user.email) ? result.user.email.toLowerCase() : '';
          storage.setItem('user_email', signupEmail);
          storage.setItem('userEmail', signupEmail);
          storage.setItem('user_name', result.user.name);
          storage.setItem('userName', result.user.name);

          // Show auto-login notification
          setNotification({
            show: true,
            type: "success",
            message: `Welcome to VT-Index, ${result.user.name}! Redirecting to dashboard...`
          });

          // Redirect to main dashboard immediately after signup auto-login
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          // Fallback: Switch to login form if no auto-login
          setTimeout(() => {
            setRightPanelActive(false);
            setForgotActive(false);
            // Clear form
            setSignUpName("");
            setSignUpEmail("");
            setSignUpPhone("");
            setSignUpDob("");
            setSignUpPassword("");
            setSignUpConfirm("");
          }, 2500);
        }
      } else {
        const errorMessage = result.error || 'Failed to sign up.';
        setNotification({ show: true, type: "error", message: errorMessage });
      }
    } catch (error) {
      setNotification({ show: true, type: "error", message: error.message || "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  // Handle send reset OTP
  const handleSendResetOtp = async () => {
    setLoading(true);
    try {
      await sendResetOtp(resetEmail);
      setNotification({ show: true, type: "success", message: "OTP sent to your email!" });
      setResetStep(1);
    } catch (error) {
      setNotification({ show: true, type: "error", message: error.message || "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await verifyOtp(resetEmail, otp);
      setNotification({ show: true, type: "success", message: "OTP verified!" });
      setResetStep(2);
    } catch (error) {
      setNotification({ show: true, type: "error", message: error.message || "OTP verification failed" });
    } finally {
      setLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    if (newPass !== confirmNewPass) {
      setNotification({ show: true, type: "error", message: "Passwords do not match" });
      return;
    }
    setLoading(true);
    try {
      await resetPassword(resetEmail, newPass);
      setNotification({ show: true, type: "success", message: "Password reset successfully!" });
      setForgotActive(false);
      setResetStep(0);
    } catch (error) {
      setNotification({ show: true, type: "error", message: error.message || "Password reset failed" });
    } finally {
      setLoading(false);
    }
  };

  // Handle verify login OTP
  const handleVerifyLoginOtp = async () => {
    setLoading(true);
    try {
      const response = await verifyOtp(signInEmail, verificationCode);
      // Treat several server response shapes as a successful verification:
      // - { success: true }
      // - { verified: true }
      // - or responses that include access/refresh tokens
      const verified = !!(
        (response && response.success) ||
        (response && response.verified) ||
        (response && (response.access || response.refresh))
      );

      if (verified) {
        // clear any pending login verification flag
        try {
          localStorage.removeItem('login_verification_pending');
        } catch (e) {}

        setNotification({ show: true, type: "success", message: "Verification successful! Redirecting to dashboard..." });
        setShowVerificationModal(false);

        // Store auth tokens and user info for auto-login (if provided)
        if (response && response.access && response.refresh) {
          const storage = localStorage; // Use localStorage for login

          storage.setItem('jwt_token', response.access);
          storage.setItem('accessToken', response.access);
          storage.setItem('refresh_token', response.refresh);
          storage.setItem('refreshToken', response.refresh);
          storage.setItem('user_role', response.role);
          storage.setItem('userRole', response.role);

          // Store emails in lowercase for frontend consistency
          const userEmail = (response.user && response.user.email) ? response.user.email.toLowerCase() : '';
          storage.setItem('user_email', userEmail);
          storage.setItem('userEmail', userEmail);
          storage.setItem('user_name', response.user && response.user.name ? response.user.name : '');
          storage.setItem('userName', response.user && response.user.name ? response.user.name : '');
        }

        // Redirect regardless of whether tokens were provided; server may set a session cookie.
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setVerificationError(response && (response.error || response.detail) ? (response.error || response.detail) : "Verification failed");
      }
    } catch (error) {
      setVerificationError(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle resend login OTP
  const handleResendLoginOtp = async () => {
    setLoading(true);
    try {
      await resendLoginOtp(signInEmail);
      setNotification({ show: true, type: "success", message: "OTP resent to your email!" });
      setResendCooldown(30);
      setOtpExpiry(60);
      setVerificationError("");
    } catch (error) {
      // If server rate-limited (429), try to read retry info from status endpoint
      const msg = error && error.message ? error.message : '';
      if (msg.includes('429') || msg.toLowerCase().includes('too many requests')) {
        let cooldown = 60;
        try {
          const status = await getLoginOtpStatus(signInEmail);
          if (status && status.retry_after) cooldown = Number(status.retry_after) || cooldown;
          if (status && status.otp_expires_in) setOtpExpiry(Number(status.otp_expires_in) || otpExpiry);
        } catch (e) {
          console.debug('Failed to get OTP status after 429:', e);
        }
        setResendCooldown(cooldown);
        setNotification({ show: true, type: "error", message: `Too many requests. Please wait ${cooldown}s before retrying.` });
      } else {
        setNotification({ show: true, type: "error", message: error.message || "Failed to resend OTP" });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-black via-[#111111] to-black text-white px-4">
      {/* container card */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none">
          {/* Keep empty or add logo here if needed */}
          <img src="https://vtindex.com/img/logo/logo.svg" alt="logo" />
        </div>
      <div
        className={`relative h-[70vh] sm:h-[60vh] lg:h-[55vh] overflow-hidden rounded-2xl border border-[#D4AF37] w-full max-w-[768px] min-h-[480px] ${containerClass} transition-all duration-500 ease-in-out shadow-[0_10px_30px_rgba(212,175,55,0.6),_inset_0_1px_0_rgba(255,255,255,0.02)]`}
      >
        {/* Logo area (optional) */}
        

        {/* Sign In Form */}
        <div
          className={`form-container sign-in-container absolute top-0 left-0 h-full w-full md:w-1/2 z-20 transition-transform duration-600 ease-in-out ${
            rightPanelActive ? "md:translate-x-full hidden" : "translate-x-0"
          } ${forgotActive ? "-translate-x-[200%] scale-90 opacity-0 pointer-events-none" : ""}`}
        >
          <form className="h-full flex flex-col items-center justify-center text-center px-6 sm:px-12 bg-black/60" onSubmit={handleSignIn}>
            <h2 className="form-title text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#b8860b]">
              Sign In
            </h2>

            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              className="w-full rounded-2xl bg-white/5 text-[#bfb38a] px-4 py-2 outline-none border transition-all mt-6"
              required
            />

            <div className={`password-container relative w-full mt-4 ${strengthClasses("")}`}>
              <input
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-2xl bg-white/5 text-[#bfb38a] px-4 py-2 outline-none border transition-all"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#D4AF37] p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <a
              id="forgotPasswordLink"
              onClick={() => {
                setForgotActive(true);
                setResetStep(0);
              }}
              className="mt-4 text-[#D4AF37] hover:underline cursor-pointer"
            >
              Forgot your password?
            </a>

            <div className="w-full mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-b from-[#ffd66b] to-[#d4af37] text-black font-bold px-10 py-2 uppercase tracking-wider shadow-lg disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            <p className="mt-4 text-[#bfb38a] md:hidden">Don't have an account? <a onClick={() => setRightPanelActive(true)} className="text-[#D4AF37] hover:underline cursor-pointer">Sign Up</a></p>
          </form>
        </div>

        {/* Sign Up Form */}
        <div
          className={`form-container sign-up-container absolute top-0 left-0 h-full w-full md:w-1/2 z-10 transition-all duration-600 ease-in-out ${
            rightPanelActive ? "md:translate-x-full opacity-100 z-30" : "opacity-0 z-10"
          } ${forgotActive ? "translate-x-[200%] scale-90 opacity-0 pointer-events-none" : ""}`}
        >
          <form className="h-full flex flex-col items-center justify-center text-center px-6 sm:px-12 bg-black/50" onSubmit={handleSignUp}>
            <h2 className="form-title text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#b8860b]">
              Create Account
            </h2>

            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              className="w-full rounded-2xl bg-white/5 text-[#bfb38a] px-4 py-2 outline-none border mt-6"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              className="w-full rounded-2xl bg-white/5 text-[#bfb38a] px-4 py-2 outline-none border mt-4"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={signUpPhone}
              onChange={(e) => setSignUpPhone(e.target.value)}
              className="w-full rounded-2xl bg-white/5 text-[#bfb38a] px-4 py-2 outline-none border mt-4"
              required
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={signUpDob}
              onChange={(e) => setSignUpDob(e.target.value)}
              className="w-full rounded-2xl bg-white/5 text-[#bfb38a] px-4 py-2 outline-none border mt-4"
              required
            />

            <div className={`password-container relative w-full mt-4 ${strengthClasses(computeStrengthClass(signUpPassword))}`}>
              <input
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-2xl bg-white/5 text-[#bfb38a] px-4 py-2 outline-none border transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#D4AF37] p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className={`password-container relative w-full mt-4 ${strengthClasses(computeStrengthClass(signUpConfirm))}`}>
              <input
                value={signUpConfirm}
                onChange={(e) => setSignUpConfirm(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full rounded-2xl bg-white/5 text-[#bfb38a] px-4 py-2 outline-none border transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#D4AF37] p-1"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="w-full mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-b from-[#ffd66b] to-[#d4af37] text-black font-bold px-10 py-2 uppercase tracking-wider shadow-lg disabled:opacity-50"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>

            <p className="mt-4 text-[#bfb38a] md:hidden">Already have an account? <a onClick={() => setRightPanelActive(false)} className="text-[#D4AF37] hover:underline cursor-pointer">Sign In</a></p>
          </form>
        </div>

        {/* Forgot Password (hidden unless forgotActive) */}
        <div
          className={`forgot-password-container absolute top-0 left-0 w-full h-full z-50 transition-all duration-500 ease-in-out ${
            forgotActive ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"
          } flex items-center justify-center`}
        >
          <div className="w-full px-3 max-w-md bg-black/80 rounded-2xl text-center shadow-xl">
            {resetStep === 0 && (
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 items-center">
                <h2 className="form-title flex  text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#b8860b]">
                  Reset Password
                </h2>
                <p className="text-sm text-[#bfb38a] mb-4">
                  Enter your email address and we'll send you an OTP to reset your password.
                </p>

                <input
                  id="resetEmail"
                  type="email"
                  placeholder="Email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full rounded-2xl bg-white/5 text-[#f6f4f0] px-4 py-2 outline-none border"
                  required
                />

                <div className="mt-4 flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handleSendResetOtp}
                    disabled={loading}
                    id="sendOtpBtn"
                    className="rounded-full bg-gradient-to-b from-[#ffd66b] to-[#d4af37] text-black font-bold px-6 py-2 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>

                  <button
                    type="button"
                    className="rounded-full border border-[#D4AF37] text-[#D4AF37] px-6 py-2"
                    id="backToSignIn"
                    onClick={() => {
                      setForgotActive(false);
                      setResetStep(0);
                    }}
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {resetStep === 1 && (
              <form onSubmit={(e) => e.preventDefault()} className="px-3">
                <h2 className="form-title text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#b8860b]">
                  Reset Password
                </h2>
                <p className="text-sm text-[#bfb38a] mb-4">Enter the OTP sent to your email.</p>

                <input
                  id="otpInput"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-2xl bg-white/5 text-[#f6f4f0] px-4 py-2 outline-none border text-center tracking-widest"
                  required
                />

                <div className="mt-4 flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    id="verifyOtpBtn"
                    className="rounded-full bg-gradient-to-b from-[#ffd66b] to-[#d4af37] text-black font-bold px-6 py-2 disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    type="button"
                    className="rounded-full border border-[#D4AF37] text-[#D4AF37] px-6 py-2"
                    id="backToSignIn"
                    onClick={() => {
                      setForgotActive(false);
                      setResetStep(0);
                    }}
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {resetStep === 2 && (
              <form onSubmit={(e) => e.preventDefault()}>
                <h2 className="form-title text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#b8860b]">
                  Reset Password
                </h2>
                <p className="text-sm text-[#bfb38a] mb-4">Set your new password.</p>

                <div className={`password-container relative w-full ${strengthClasses(computeStrengthClass(newPass))}`}>
                  <input
                    id="newPassword"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="w-full rounded-2xl bg-white/5 text-[#f6f4f0] px-4 py-2 outline-none border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#D4AF37] p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="password-container relative w-full mt-4">
                  <input
                    id="confirmNewPassword"
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    className="w-full rounded-2xl bg-white/5 text-[#f6f4f0] px-4 py-2 outline-none border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#D4AF37] p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="mt-4 flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="rounded-full bg-gradient-to-b from-[#ffd66b] to-[#d4af37] text-black font-bold px-6 py-2 disabled:opacity-50"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>

                  <button
                    type="button"
                    className="rounded-full border border-[#D4AF37] text-[#D4AF37] px-6 py-2"
                    id="backToSignIn"
                    onClick={() => {
                      setForgotActive(false);
                      setResetStep(0);
                    }}
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Overlay container (hidden when forgotActive) */}
        <div
          className={`overlay-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden bg-black transition-transform duration-600 ease-in-out z-40 hidden md:block ${
            rightPanelActive ? "-translate-x-full " : "translate-x-0"
          } ${forgotActive ? "opacity-0 scale-90 invisible pointer-events-none" : ""}`}
        >
          <div
            className={`overlay relative left-[-100%] h-full w-[200%] transform transition-transform duration-600 ease-in-out bg-gradient-to-r from-[#0a0a0a] via-[#181818] to-[#0c0c0c]`}
            style={{ boxShadow: "inset -200px 0 120px rgba(212,175,55,0.04)" }}
          >
            <div
              className={`overlay-panel overlay-right absolute top-0 right-0 h-full w-1/2 flex flex-col items-center justify-center px-10 text-center ${rightPanelActive ? "-translate-x-0" : "translate-x-0 hidden"}`}
              style={{ color: "var(--gold)" }}
            >
              <h2 className="overlay-title text-3xl font-bold text-[#D4AF37]">Welcome Back!<br />to vtindex</h2>
              <p className="text-sm text-[#bfb38a] max-w-[70%] mt-2">Join us and explore your financial possibilities.</p>
              <button
                className="mt-4 rounded-full border border-[#D4AF37] text-[#D4AF37] px-6 py-2"
                onClick={() => {
                  setRightPanelActive(false);
                  setForgotActive(false);
                }}
              >
                Sign In
              </button>
            </div>

            <div
              className={`overlay-panel overlay-right absolute top-0 right-0 h-full w-1/2 flex flex-col items-center justify-center px-10 text-center ${rightPanelActive ? "-translate-x-full hidden" : "translate-x-0"}`}
              style={{ color: "var(--gold)" }}
            >
              <h2 className="overlay-title text-3xl font-bold text-[#D4AF37]">Welcome to Financial Freedom!</h2>
              <p className="text-sm text-[#bfb38a] max-w-[70%] mt-2">Join vtindex and embark on a journey toward financial growth and stability.</p>
              <button
                className="mt-4 rounded-full bg-gradient-to-b from-[#ffd66b] to-[#d4af37] text-black font-bold px-6 py-2"
                onClick={() => setRightPanelActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Notification */}
        <div
          className={`notification fixed top-6 right-6 z-50 transform transition-all duration-300 ${
            notification.show ? "translate-x-0 opacity-100" : "translate-x-40 opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`flex items-center gap-3 rounded-md px-4 py-2 ${
              notification.type === "success" ? "bg-gradient-to-r from-[#28a745] to-[#20c997]" : "bg-gradient-to-r from-[#dc3545] to-[#e74c3c]"
            } text-white`}
            style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.25)" }}
          >
            <span className="text-sm font-semibold">{notification.message}</span>
            <button
              onClick={() => setNotification({ show: false, type: "success", message: "" })}
              className="ml-3 text-white text-sm font-medium"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Verification Modal */}
        {showVerificationModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-black/90 rounded-2xl p-6 w-full max-w-md mx-4 border border-[#D4AF37]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Verify Your Email</h2>
                <p className="text-[#bfb38a] mb-4">Enter the OTP sent to {signInEmail}</p>

                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full rounded-2xl bg-white/5 text-[#f6f4f0] px-4 py-2 outline-none border text-center tracking-widest mb-4"
                  maxLength={6}
                />

                {verificationError && (
                  <p className="text-red-400 text-sm mb-4">{verificationError}</p>
                )}

                <div className="text-sm text-[#bfb38a] mb-4">
                  OTP expires in: {Math.floor(otpExpiry / 60)}:{(otpExpiry % 60).toString().padStart(2, '0')}
                </div>

                <div className="flex justify-center mb-4">
                  <button
                    onClick={handleVerifyLoginOtp}
                    disabled={loading || verificationCode.length < 6}
                    className="rounded-full bg-gradient-to-b from-[#ffd66b] to-[#d4af37] text-black font-bold px-6 py-2 disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>
                </div>

                <button
                  onClick={handleResendLoginOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="text-[#D4AF37] hover:underline disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
