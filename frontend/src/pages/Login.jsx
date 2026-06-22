import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Loader2, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import { loginUser } from '../services/authApi';

/**
 * Login Page Component
 * Allows existing users to authenticate with email and password.
 */
function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // If user is already logged in, redirect them directly to the dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic validation
    if (!formData.email.trim() || !formData.password) {
      toast.warning('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      // 2. Perform API call to sign in
      const data = await loginUser(formData);
      
      if (data.success) {
        toast.success(data.message || 'Login successful!');
        
        // 3. Save JWT token & user credentials in local storage
        const userObj = {
          id: data.data.id || data.data._id,
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          isTempPassword: data.data.isTempPassword
        };
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(userObj));

        // 4. Redirect based on password status
        if (data.data.isTempPassword) {
          toast.info('Please change your temporary password before proceeding.');
          navigate('/change-password');
        } else {
          navigate('/');
        }
      } else {
        toast.error(data.message || 'Login failed. Please check credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Unable to connect to the authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Branding header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center mb-2">
            <Package className="text-gradient me-2" size={28} />
            <span className="h4 m-0 fw-extrabold text-white">
              <span className="text-gradient">Stock</span>Sync
            </span>
          </div>
          <h5 className="auth-title text-white">Welcome Back</h5>
          <p className="auth-subtitle">Log in to manage your active inventory</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email input field */}
          <div className="mb-3">
            <label className="form-label text-secondary fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--panel-border)', color: 'var(--text-secondary)' }}>
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                className="form-control custom-input border-start-0"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="mb-4">
            <label className="form-label text-secondary fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--panel-border)', color: 'var(--text-secondary)' }}>
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control custom-input border-start-0 border-end-0"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="input-group-text bg-transparent border-start-0"
                style={{ borderColor: 'var(--panel-border)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-glow-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Authenticating...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Register page link */}
        <div className="text-center mt-4">
          <p className="text-secondary m-0" style={{ fontSize: '0.85rem' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-white fw-semibold hover-text-primary text-decoration-none">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
