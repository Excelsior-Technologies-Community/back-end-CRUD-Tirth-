import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * ProtectedRoute Wrapper
 * Redirects user to /login page if JWT token is not found in localStorage.
 * Redirects user to /change-password if isTempPassword is true.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user) {
    try {
      const userObj = JSON.parse(user);
      if (userObj.isTempPassword) {
        return <Navigate to="/change-password" replace />;
      }
    } catch (err) {
      console.error('Error checking user password state:', err);
    }
  }
  
  return children;
}

/**
 * TempPasswordRoute Wrapper
 * Allows access only to logged-in users with a temporary password.
 * Redirects others to dashboard or login.
 */
function TempPasswordRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user) {
    try {
      const userObj = JSON.parse(user);
      if (!userObj.isTempPassword) {
        return <Navigate to="/" replace />;
      }
    } catch (err) {
      console.error('Error checking user password state:', err);
    }
  }

  return children;
}

/**
 * Root Application Component
 * Sets up BrowserRouter and defines page routing paths.
 */
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Change Password route */}
          <Route 
            path="/change-password" 
            element={
              <TempPasswordRoute>
                <ChangePassword />
              </TempPasswordRoute>
            } 
          />

          {/* Protected Main routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Toast notifications container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </>
  );
}

export default App;
