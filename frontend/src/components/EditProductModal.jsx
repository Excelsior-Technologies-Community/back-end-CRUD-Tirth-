import React, { useEffect } from 'react';
import { CheckCircle2, X, Loader2 } from 'lucide-react';
import ProductForm from './ProductForm';

/**
 * EditProductModal Component
 * Handles the popup dialog to modify an existing product record.
 */
function EditProductModal({ isOpen, onClose, formData, onChange, onSubmit, loading, categories }) {
  // Listen for Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // Modal background overlay
    <div className="custom-modal-overlay" onClick={onClose}>
      {/* Modal Dialog container */}
      <div className="custom-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0 fw-bold text-white">Edit Product Details</h4>
          <button 
            type="button" 
            className="btn border-0 p-1 text-secondary hover-text-white bg-transparent" 
            onClick={onClose} 
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit}>
          {/* Main Product Fields */}
          <ProductForm formData={formData} onChange={onChange} categories={categories} />

          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary border-0 px-4"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-glow-primary px-4 d-flex align-items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
