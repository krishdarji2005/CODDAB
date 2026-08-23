import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { TextHoverEffect } from '../../components/ui/TextHoverEffect';
import styles from './Register.module.css';

// ─── API base URL ────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const Register = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  // ── Redirect authenticated users away from Register ───────────────────────
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [errors, setErrors]                 = useState({});
  const [apiError, setApiError]             = useState('');
  const [submitting, setSubmitting]         = useState(false);

  // While auth state is hydrating, render nothing to avoid flashing the form
  if (loading || isAuthenticated) return null;

  // ── Client-side validation ─────────────────────────────────────────────────
  const validate = () => {
    const errs = {};

    if (!name.trim()) {
      errs.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errs.name = 'Must be at least 2 characters.';
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Must be at least 6 characters.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
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
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.message || 'Registration failed. Please try again.';
        setApiError(msg);
        toast.error(msg);
        return;
      }

      if (data.token && data.user) {
        login(data.token, data.user);
        toast.success('Account created — welcome to Coddab!');
        navigate('/', { replace: true });
      } else {
        toast.success('Account created! Please sign in.');
        navigate('/login', { replace: true });
      }
    } catch {
      const msg = 'Unable to reach the server. Please try again.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const clearError = (field) => {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
    if (apiError) setApiError('');
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
              <h1 className={styles.title}>Create your account</h1>
              <p className={styles.subtitle}>
                Get started with Coddab — collaborate in real-time.
              </p>
            </div>

            {/* Form */}
            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              {/* Name */}
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="register-name">
                  Full name
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); clearError('name'); }}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Alex Rivera"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    autoComplete="name"
                    disabled={submitting}
                  />
                </div>
                {errors.name && (
                  <span className={styles.errorMsg}>
                    <AlertCircle size={12} />
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="register-email">
                  Email
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
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
                <label className={styles.label} htmlFor="register-password">
                  Password
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Min. 6 characters"
                    className={`${styles.input} ${styles.inputPassword} ${errors.password ? styles.inputError : ''}`}
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="register-confirm">
                  Confirm password
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="register-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Re-enter password"
                    className={`${styles.input} ${styles.inputPassword} ${errors.confirmPassword ? styles.inputError : ''}`}
                    autoComplete="new-password"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    className={styles.eyeToggle}
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className={styles.errorMsg}>
                    <AlertCircle size={12} />
                    {errors.confirmPassword}
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
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className={styles.footerText}>
              Already have an account?{' '}
              <Link to="/login" className={styles.footerLink}>
                Sign in
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

export default Register;
