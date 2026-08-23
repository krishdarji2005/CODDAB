import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { TextHoverEffect } from '../../components/ui/TextHoverEffect';
import styles from './Login.module.css';

// ─── API base URL ────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  // ── Redirect authenticated users away from Login ──────────────────────────
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]             = useState({});
  const [apiError, setApiError]         = useState('');
  const [submitting, setSubmitting]     = useState(false);

  // While auth state is hydrating, render nothing to avoid flashing the form
  if (loading || isAuthenticated) return null;

  // ── Client-side validation ─────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    return errs;
  };

  // ── Submission ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.message || 'Login failed. Please check your credentials.';
        setApiError(msg);
        toast.error(msg);
        return;
      }

      login(data.token, data.user);
      toast.success('Welcome back!');
      navigate('/', { replace: true });
    } catch {
      const msg = 'Unable to reach the server. Please try again.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  return (
    <div className={styles.page}>

      {/* ════════ LEFT — Form Column ════════ */}
      <div className={styles.formColumn}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <Link to="/" className={styles.brand}>
            <img
              src="/CoddabLogoKrish.svg"
              alt="Coddab logo"
              className={styles.logoMark}
            />
            <span className={styles.brandName}>Coddab</span>
          </Link>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={14} />
            Back to home
          </Link>
        </header>

        {/* Form Area */}
        <main className={styles.formArea}>
          <div className={styles.formInner}>

            {/* Header */}
            <div className={styles.header}>
              <h1 className={styles.title}>Sign in to Coddab</h1>
              <p className={styles.subtitle}>
                Welcome back. Enter your credentials to continue.
              </p>
            </div>

            {/* Form */}
            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="login-email">
                  Email
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                      if (apiError) setApiError('');
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="you@example.com"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    autoComplete="email"
                    disabled={submitting}
                  />
                </div>
                {errors.email && (
                  <span className={styles.errorMsg}>
                    <AlertCircle size={12} />
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="login-password">
                  <span>Password</span>
                  <button
                    type="button"
                    className={styles.forgotLink}
                    onClick={() => toast('Password reset coming soon!')}
                  >
                    Forgot password?
                  </button>
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                      if (apiError) setApiError('');
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••"
                    className={`${styles.input} ${styles.inputPassword} ${errors.password ? styles.inputError : ''}`}
                    autoComplete="current-password"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    className={styles.eyeToggle}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <span className={styles.errorMsg}>
                    <AlertCircle size={12} />
                    {errors.password}
                  </span>
                )}
              </div>

              {/* API error */}
              {apiError && (
                <span className={styles.errorMsg}>
                  <AlertCircle size={12} />
                  {apiError}
                </span>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={styles.submitBtn}
              >
                {submitting ? (
                  <>
                    <span className={styles.spinner} />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className={styles.footerText}>
              Don&apos;t have an account?{' '}
              <Link to="/register" className={styles.footerLink}>
                Create one
              </Link>
            </p>

          </div>
        </main>
      </div>

      {/* ════════ RIGHT — Iconic Brand Showcase (X.com Style Cleanliness) ════════ */}
      <div className={styles.visualContainer}>
        <div className={styles.visualFrame}>
          
          {/* Subtle Ambient Glows */}
          <div className={styles.ambientGlowOrange} />
          <div className={styles.ambientGlowPurple} />

          {/* Grid pattern */}
          <div className={styles.gridPattern} />

          {/* Iconic Centerpiece */}
          <div className={styles.textEffectWrap}>
            <TextHoverEffect text="CODDAB" />
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
