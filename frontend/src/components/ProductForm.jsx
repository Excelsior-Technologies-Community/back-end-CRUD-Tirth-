import React from 'react';

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
                e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' style='background:%2327272a;width:100%25;height:100%25;'><path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'></path><polyline points='3.27 6.96 12 12.01 20.73 6.96'></polyline><line x1='12' y1='22.08' x2='12' y2='12'></line></svg>";
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ProductForm;
