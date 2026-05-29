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
    </>
  );
}

export default ProductForm;
