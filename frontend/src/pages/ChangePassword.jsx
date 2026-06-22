import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { changePassword } from '../services/authApi';

/**
 * Change Password Page Component
 * Forces users who logged in with a temporary password to update it.
 */
function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Route protection: User must be logged in with a token
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      toast.error('Access denied. Please log in first.');
      navigate('/login');
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
    const { currentPassword, newPassword, confirmPassword } = formData;

    // 1. Validation checks
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    setLoading(true);

    try {
      // 2. Call the backend Change Password API
      const data = await changePassword({ currentPassword, newPassword, confirmPassword });

      if (data.success) {
        toast.success(data.message || 'Password updated successfully!');

        // 3. Update the stored user object in localStorage to set isTempPassword to false
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.isTempPassword = false;
          localStorage.setItem('user', JSON.stringify(userObj));
        }

        // 4. Redirect to Dashboard
        navigate('/');
      } else {
        toast.error(data.message || 'Failed to update password.');
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast.error('Unable to connect to the authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        {/* Branding header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center mb-2">
            <KeyRound className="text-gradient me-2" size={28} />
            <span className="h4 m-0 fw-extrabold text-white">
              <span className="text-gradient">Stock</span>Sync
            </span>
          </div>
          <h5 className="auth-title text-white">Set New Password</h5>
          <p className="auth-subtitle text-secondary">Please replace your temporary password with a secure new one</p>
        </div>

        {/* Change Password Form */}
        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="mb-3">
            <label className="form-label text-secondary fw-semibold">Current (Temporary) Password</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--panel-border)', color: 'var(--text-secondary)' }}>
                <Lock size={16} />
              </span>
              <input
                type={showPasswords ? 'text' : 'password'}
                name="currentPassword"
                className="form-control custom-input border-start-0"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label text-secondary fw-semibold">New Password</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--panel-border)', color: 'var(--text-secondary)' }}>
                <Lock size={16} />
              </span>
              <input
                type={showPasswords ? 'text' : 'password'}
                name="newPassword"
                className="form-control custom-input border-start-0"
                placeholder="Minimum 6 characters"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="mb-4">
            <label className="form-label text-secondary fw-semibold">Confirm New Password</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--panel-border)', color: 'var(--text-secondary)' }}>
                <Lock size={16} />
              </span>
              <input
                type={showPasswords ? 'text' : 'password'}
                name="confirmPassword"
                className="form-control custom-input border-start-0 border-end-0"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="input-group-text bg-transparent border-start-0"
                style={{ borderColor: 'var(--panel-border)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                onClick={() => setShowPasswords(!showPasswords)}
                aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
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
                Updating Password...
              </>
            ) : (
              'Update Password & Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
