import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, User, Loader2, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import { registerUser } from '../services/authApi';

/**
 * Register Page Component
 * Allows new users to sign up by entering their name and email.
 */
function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // If user is already logged in, redirect them to dashboard
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

    const { name, email } = formData;

    // 1. Basic validation checks
    if (!name.trim() || !email.trim()) {
      toast.warning('Please enter both your name and email address.');
      return;
    }

    setLoading(true);

    try {
      // 2. Perform API request to register
      const data = await registerUser({ name, email });
      
      if (data.success) {
        toast.success(data.message || 'Registration successful! Check your email.');
        // 3. Redirect to login page to sign in with temporary password
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
          <h5 className="auth-title text-white">Create Account</h5>
          <p className="auth-subtitle">Register to begin catalog management</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit}>
          {/* Name input field */}
          <div className="mb-3">
            <label className="form-label text-secondary fw-semibold">Name</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--panel-border)', color: 'var(--text-secondary)' }}>
                <User size={16} />
              </span>
              <input
                type="text"
                name="name"
                className="form-control custom-input border-start-0"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email input field */}
          <div className="mb-4">
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

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-glow-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating Account...
              </>
            ) : (
              'Register Account'
            )}
          </button>
        </form>

        {/* Login page link */}
        <div className="text-center mt-4">
          <p className="text-secondary m-0" style={{ fontSize: '0.85rem' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-white fw-semibold hover-text-primary text-decoration-none">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
