import React from 'react';
import { Package, Search, SlidersHorizontal, Loader2, Edit3, Trash2 } from 'lucide-react';

/**
 * ProductTable Component
 * Renders the search controls, category filter, loading indicator,
 * empty directory state, and the responsive product list table.
 */
function ProductTable({
  products,
  filteredProducts,
  searchTerm,
  setSearchTerm,
  selectedFilterCategory,
  setSelectedFilterCategory,
  categories,
  loading,
  openEditModal,
  openDeleteModal
}) {
  
  // Helper function to return the correct CSS class for category labels
  const getCategoryBadgeClass = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('elect')) return 'badge-electronics';
    if (cat.includes('cloth')) return 'badge-clothing';
    if (cat.includes('home')) return 'badge-home';
    if (cat.includes('book')) return 'badge-books';
    return 'badge-other';
  };

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

  return (
    <section className="card glass-panel text-white p-4 animate-fade-in">
      
      {/* Directory Title, Total Counts, and Search/Filters Controls */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-md-6">
          <h3 className="m-0 fw-bold d-flex align-items-center gap-2">
            <Package className="text-secondary" size={22} />
            Inventory Directory
            <span className="badge bg-dark border border-secondary text-secondary fs-6 py-1 px-2">
              {filteredProducts.length} of {products.length}
            </span>
          </h3>
        </div>
        
        {/* Search Bar Input */}
        <div className="col-md-3">
          <div className="input-group">
            <span className="input-group-text custom-input border-end-0 text-secondary">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control custom-input border-start-0 ps-0"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter Dropdown */}
        <div className="col-md-3">
          <div className="input-group">
            <span className="input-group-text custom-input border-end-0 text-secondary">
              <SlidersHorizontal size={18} />
            </span>
            <select
              className="form-select custom-input border-start-0 ps-0"
              value={selectedFilterCategory}
              onChange={(e) => setSelectedFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading state spinner */}
      {loading && products.length === 0 ? (
        <div className="text-center py-5">
          <Loader2 className="animate-spin text-primary fs-3 mb-3" size={36} />
          <p className="text-secondary">Synchronizing database inventory...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty directory state panel */
        <div className="text-center py-5 glass-panel border-dashed border-2 m-3 animate-fade-in">
          <Package className="text-secondary mb-3 d-block mx-auto" size={48} />
          <h4 className="fw-semibold text-secondary">No Products Found</h4>
          <p className="text-muted col-md-8 mx-auto">
            {products.length === 0
              ? "Your warehouse inventory directory is empty. Click '+ Add Product' to insert your first catalog item!"
              : "No items match your active filters. Try resetting search criteria or choosing another category."}
          </p>
          {products.length > 0 && (
            <button
              className="btn btn-sm btn-outline-secondary mt-2 px-3 fw-semibold"
              onClick={() => { setSearchTerm(''); setSelectedFilterCategory('All'); }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        /* Responsive HTML Table Grid */
        <div className="table-responsive animate-fade-in">
          <table className="table custom-table mb-0 align-middle">
            <thead>
              <tr>
                <th scope="col" style={{ width: '15%' }}>Image</th>
                <th scope="col" style={{ width: '30%' }}>Product Info</th>
                <th scope="col" style={{ width: '20%' }}>Category</th>
                <th scope="col" style={{ width: '20%' }}>Price</th>
                <th scope="col" style={{ width: '15%' }} className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => {
                const fallbackImg = getCategoryFallbackImage(product.category);
                return (
                  <tr key={product._id} className="animate-fade-in">
                    {/* Thumbnail Image Column */}
                    <td>
                      <div className="d-flex align-items-center justify-content-center border rounded bg-dark" style={{ width: '48px', height: '48px', overflow: 'hidden', borderColor: 'var(--panel-border)' }}>
                        <img
                          src={product.image || fallbackImg}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = fallbackImg;
                          }}
                        />
                      </div>
                    </td>
                    {/* Name and Database ID Column */}
                    <td>
                      <div className="fw-bold text-white fs-5">{product.name}</div>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        ID: {product._id}
                      </small>
                    </td>
                  {/* Category Type Column */}
                  <td>
                    <span className={`badge badge-category ${getCategoryBadgeClass(product.category)}`}>
                      {product.category}
                    </span>
                  </td>
                  {/* Value Column */}
                  <td>
                    <span className="fw-bold text-gradient-cyan fs-5">
                      ₹{parseFloat(product.price).toFixed(2)}
                    </span>
                  </td>
                  {/* Action Column Buttons */}
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <button
                        type="button"
                        className="btn-action btn-action-edit"
                        onClick={() => openEditModal(product)}
                        title="Edit product"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-action-delete"
                        onClick={() => openDeleteModal(product)}
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ProductTable;
