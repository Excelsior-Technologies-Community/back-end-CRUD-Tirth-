import React from 'react';
import Dashboard from './pages/Dashboard';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Root Application Component
 * Mounts the main Dashboard controller view.
 */
function App() {
  return (
    <>
      <Dashboard />
      {/* Toast notifications container configured as per requirements */}
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
