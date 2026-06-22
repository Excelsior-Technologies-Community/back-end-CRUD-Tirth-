// Helper function to get default category-based fallback images
const getUserImageFallback = (name, category) => {
  const nameLower = (name || '').toLowerCase();
  const catLower = (category || '').toLowerCase();
  
  if (nameLower.includes('wireless gaming mouse')) {
    return 'https://pbs.twimg.com/media/GAtXv_Ja8AAi49x.jpg';
  }
  if (nameLower.includes('gaming mouse') || nameLower.includes('mouse')) {
    return 'https://www.3ona51.com/images/products/gaming-mouses/razer-basilisk-v3-35k-black-rz01-05230100-r3m1/600.jpg';
  }
  if (nameLower.includes('car')) {
    return 'https://weeklysamirror.news/wp-content/uploads/2025/05/MOTORINGFerrari-12Cilindr.png';
  }
  if (nameLower.includes('bottle')) {
    return 'https://media.intersport.fr/is/image/intersportfr/JX0015_11I_FA?$produit_m$&$product_grey$';
  }
  if (nameLower.includes('laptop') || nameLower.includes('keyboard')) {
    return 'https://media-assets.hyperinvento.com/companies/c31a99fe-fc32-4275-a453-18c2131fef39/products/97839e51-9a1c-4746-8489-1712c04808b5/featureds/images/3c703838574946dd8073ea67f3f7c474-product-featured-lg.jpg';
  }
  
  if (catLower.includes('elect')) {
    return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=150&q=80';
  }
  if (catLower.includes('cloth')) {
    return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=150&q=80';
  }
  if (catLower.includes('home')) {
    return 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80';
  }
  if (catLower.includes('book')) {
    return 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=150&q=80';
  }
  return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=150&q=80';
};

/**
 * Reusable Product Input Form Fields
 * Used in both Add and Edit modals to prevent code duplication.
 */
function ProductForm({ 
  formData, 
  onChange, 
  categories,
  imageOption = 'select',
  setImageOption,
  selectedFile,
  setSelectedFile,
  existingImages = []
}) {
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

      {/* Image Source Selection Option */}
      <div className="mb-3">
        <label className="form-label text-secondary fw-semibold d-block">Image Option</label>
        <div className="btn-group w-100" role="group">
          <button
            type="button"
            className={`btn btn-sm ${imageOption === 'select' ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
            onClick={() => setImageOption('select')}
            style={{ borderRadius: '8px 0 0 8px', borderRight: '1px solid rgba(255,255,255,0.1)' }}
          >
            Select Existing
          </button>
          <button
            type="button"
            className={`btn btn-sm ${imageOption === 'upload' ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
            onClick={() => setImageOption('upload')}
            style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}
          >
            Upload Image
          </button>
          <button
            type="button"
            className={`btn btn-sm ${imageOption === 'url' ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
            onClick={() => setImageOption('url')}
            style={{ borderRadius: '0 8px 8px 0' }}
          >
            Image URL
          </button>
        </div>
      </div>

      {imageOption === 'select' && (
        /* Dropdown to select existing images */
        <div className="mb-3">
          <label className="form-label text-secondary fw-semibold">Select Existing Image</label>
          <select
            className="form-select custom-input"
            name="image"
            value={formData.image || ''}
            onChange={onChange}
          >
            <option value="">-- Choose an Image --</option>
            {existingImages.map((imgName, idx) => (
              <option key={idx} value={imgName}>{imgName}</option>
            ))}
          </select>
        </div>
      )}

      {imageOption === 'upload' && (
        /* File input to upload a new image */
        <div className="mb-3">
          <label className="form-label text-secondary fw-semibold">Upload Image File</label>
          <input
            type="file"
            className="form-control custom-input"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
        </div>
      )}

      {imageOption === 'url' && (
        /* Text input to paste image URL */
        <div className="mb-3">
          <label className="form-label text-secondary fw-semibold">Image URL</label>
          <input
            type="url"
            className="form-control custom-input"
            name="image"
            placeholder="e.g. https://example.com/image.jpg"
            value={formData.image || ''}
            onChange={onChange}
          />
        </div>
      )}

      {/* Live Image Preview */}
      {((imageOption === 'select' && formData.image) || 
        (imageOption === 'url' && formData.image) || 
        (imageOption === 'upload' && selectedFile)) && (
        <div className="mb-3">
          <label className="form-label text-secondary fw-semibold d-block">Image Preview</label>
          <div className="d-flex align-items-center justify-content-center border rounded p-1" style={{ borderColor: 'var(--panel-border)', backgroundColor: 'var(--input-bg)', width: '96px', height: '96px', overflow: 'hidden' }}>
            <img
              src={
                imageOption === 'upload'
                  ? URL.createObjectURL(selectedFile)
                  : (formData.image && (formData.image.startsWith('http://') || formData.image.startsWith('https://'))
                      ? formData.image
                      : `http://localhost:5000/uploads/${formData.image}`)
              }
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
              onError={(e) => {
                e.target.src = getUserImageFallback(formData.name, formData.category);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ProductForm;
