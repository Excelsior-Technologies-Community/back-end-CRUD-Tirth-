import React from 'react';

// Helper function to get default category-based fallback images
const getCategoryFallbackImage = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('elect')) {
    return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=150&q=80';
  }
  if (cat.includes('cloth')) {
    return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=150&q=80';
  }
  if (cat.includes('home')) {
    return 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80';
  }
  if (cat.includes('book')) {
    return 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=150&q=80';
  }
  return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=150&q=80';
};

/**
 * Reusable Product Input Form Fields
 * Used in both Add and Edit modals to prevent code duplication.
 */
function ProductForm({ formData, onChange, categories }) {
  return (
    <>
      {/* Product Name Field */}
      <div className="mb-3">
        <label className="form-label text-secondary fw-semibold">Product Name</label>
        <input
          type="text"
          className="form-control custom-input"
          name="name"
          placeholder="e.g. Wireless Headphones"
          value={formData.name}
          onChange={onChange}
          required
        />
      </div>

      {/* Product Price Field */}
      <div className="mb-3">
        <label className="form-label text-secondary fw-semibold">Price (₹ INR)</label>
        <div className="input-group">
          <span className="input-group-text custom-input border-end-0 text-secondary">₹</span>
          <input
            type="number"
            step="0.01"
            className="form-control custom-input border-start-0"
            name="price"
            placeholder="0.00"
            value={formData.price}
            onChange={onChange}
            required
          />
        </div>
      </div>

      {/* Product Category Field */}
      <div className="mb-4">
        <label className="form-label text-secondary fw-semibold">Category</label>
        <select
          className="form-select custom-input"
          name="category"
          value={formData.category}
          onChange={onChange}
          required
        >
          <option value="" disabled>Select a category</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Image URL Field */}
      <div className="mb-3">
        <label className="form-label text-secondary fw-semibold">Image URL</label>
        <input
          type="url"
          className="form-control custom-input"
          name="image"
          placeholder="e.g. https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
          value={formData.image || ''}
          onChange={onChange}
        />
      </div>

      {/* Live Image Preview */}
      {formData.image && (
        <div className="mb-3">
          <label className="form-label text-secondary fw-semibold d-block">Image Preview</label>
          <div className="d-flex align-items-center justify-content-center border rounded p-1" style={{ borderColor: 'var(--panel-border)', backgroundColor: 'var(--input-bg)', width: '64px', height: '64px', overflow: 'hidden' }}>
            <img
              src={formData.image}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
              onError={(e) => {
                e.target.src = getCategoryFallbackImage(formData.category);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ProductForm;
