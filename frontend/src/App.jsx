import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  SlidersHorizontal, 
  Package, 
  IndianRupee, 
  Tag, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

// API base URL pointing to the Express server
const API_URL = 'http://localhost:5000/api/products';

// Reusable Custom Modal Component
function Modal({ isOpen, onClose, title, children }) {
  // Listen for the Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      // Prevent body scrolling when modal is active
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
    // Backdrop overlay (clicking here closes the modal)
    <div className="custom-modal-overlay" onClick={onClose}>
      {/* Modal Content Box (propagation stopped so clicks inside don't close it) */}
      <div className="custom-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0 fw-bold text-white">{title}</h4>
          <button 
            type="button" 
            className="btn border-0 p-1 text-secondary hover-text-white bg-transparent" 
            onClick={onClose} 
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="custom-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  // --- STATE SYSTEM ---
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: ''
  });

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Focus States
  const [editId, setEditId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Global UI/UX States
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('All');

  // Available Product Categories
  const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Other'];

  // Fetch initial database items on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Helper function to display temporary overlay success/error alerts
  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // --- API SERVICE METHODS ---

  // 1. GET: Retrieve all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        showAlert(data.message || 'Failed to fetch products', 'danger');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showAlert('Could not connect to server. Verify backend is running.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Syncs modal form inputs with React state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open Add Product form modal
  const openAddModal = () => {
    setFormData({ name: '', price: '', category: '' });
    setEditId(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Product form modal and pre-fill details
  const openEditModal = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category
    });
    setEditId(product._id);
    setIsEditModalOpen(true);
  };

  // Trigger Delete confirmation modal
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Close all modal states
  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditId(null);
    setProductToDelete(null);
  };

  // 2. POST & PUT: Submit form data to create or update products
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field Validation checks
    if (!formData.name.trim() || !formData.price || !formData.category) {
      showAlert('All fields (Name, Price, Category) are required.', 'warning');
      return;
    }

    if (parseFloat(formData.price) < 0) {
      showAlert('Price cannot be negative.', 'warning');
      return;
    }

    setLoading(true);

    try {
      let response;
      if (editId) {
        // Trigger PUT API to edit product details
        response = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Trigger POST API to save new product
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const data = await response.json();

      if (data.success) {
        showAlert(data.message || 'Saved successfully!', 'success');
        closeAllModals();
        fetchProducts(); // Auto-refresh table view
      } else {
        showAlert(data.message || 'Error occurred', 'danger');
      }
    } catch (error) {
      console.error('Error submitting product form:', error);
      showAlert('Server error. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE: Remove product from database
  const handleDelete = async () => {
    if (!productToDelete) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${productToDelete._id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        showAlert('Product deleted successfully!', 'success');
        closeAllModals();
        fetchProducts(); // Auto-refresh table view
      } else {
        showAlert(data.message || 'Failed to delete product', 'danger');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showAlert('Server error. Could not delete product.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // --- SAAS STATISTICS CALCULATIONS ---
  const totalItems = products.length;

  const totalValue = products.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  const categoryCounts = products.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  let topCategory = 'None';
  let maxCount = 0;
  Object.keys(categoryCounts).forEach(cat => {
    if (categoryCounts[cat] > maxCount) {
      maxCount = categoryCounts[cat];
      topCategory = cat;
    }
  });

  // Filter products based on search strings and selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilterCategory === 'All' || product.category === selectedFilterCategory;
    return matchesSearch && matchesCategory;
  });

  // Helper for category label colors
  const getCategoryBadgeClass = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('elect')) return 'badge-electronics';
    if (cat.includes('cloth')) return 'badge-clothing';
    if (cat.includes('home')) return 'badge-home';
    if (cat.includes('book')) return 'badge-books';
    return 'badge-other';
  };

  const isAnyModalOpen = isAddModalOpen || isEditModalOpen || isDeleteModalOpen;

  return (
    <div className="container py-5 px-4">
      {/* Background Wrapper with Conditional Blur Filter when modals are active */}
      <div className={isAnyModalOpen ? 'modal-backdrop-blur' : ''}>
        
        {/* Modern SaaS Header Section */}
        <header className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-5 animate-fade-in">
          <div>
            <div className="d-inline-flex align-items-center mb-1">
              <Package className="text-gradient me-2" size={32} />
              <h1 className="m-0 fw-extrabold tracking-tight d-inline fs-2">
                <span className="text-gradient">Stock</span>
                <span className="text-white">Sync</span>
              </h1>
            </div>
            <p className="text-secondary m-0" style={{ fontSize: '0.95rem' }}>
              Full-Stack CRUD inventory manager and dashboard analytics.
            </p>
          </div>
          <div>
            <button
              onClick={openAddModal}
              className="btn btn-glow-primary px-4 py-2 d-flex align-items-center gap-2 fw-semibold"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </header>

        {/* Metric Analytics Row */}
        <section className="row g-4 mb-5 animate-fade-in">
          {/* Total Catalog Items Card */}
          <div className="col-md-4">
            <div className="metric-card text-white">
              <div>
                <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '0.85rem' }}>Total Products</span>
                <span className="fs-2 fw-extrabold d-block">{totalItems}</span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Unique catalog entries</span>
              </div>
              <div className="metric-icon-container metric-icon-indigo">
                <Package size={24} />
              </div>
            </div>
          </div>

          {/* Cumulative Stock Worth Card */}
          <div className="col-md-4">
            <div className="metric-card text-white">
              <div>
                <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '0.85rem' }}>Total Value</span>
                <span className="fs-2 fw-extrabold d-block text-gradient-cyan">
                  ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Sum value of active inventory</span>
              </div>
              <div className="metric-icon-container metric-icon-cyan">
                <IndianRupee size={24} />
              </div>
            </div>
          </div>

          {/* Leading Category Item count */}
          <div className="col-md-4">
            <div className="metric-card text-white">
              <div>
                <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '0.85rem' }}>Lead Category</span>
                <span className="fs-2 fw-extrabold d-block text-white">{topCategory}</span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {maxCount > 0 ? `${maxCount} products listed` : 'No categories active'}
                </span>
              </div>
              <div className="metric-icon-container metric-icon-violet">
                <Tag size={24} />
              </div>
            </div>
          </div>
        </section>

        {/* Global Action Notifications */}
        {alert && (
          <div className={`alert alert-${alert.type} glass-panel border-0 text-white animate-fade-in mb-4 d-flex align-items-center justify-content-between p-3`} role="alert">
            <div className="d-flex align-items-center gap-3">
              {alert.type === 'success' ? (
                <CheckCircle2 className="text-success" size={22} />
              ) : (
                <AlertTriangle className="text-warning" size={22} />
              )}
              <span>{alert.message}</span>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={() => setAlert(null)} aria-label="Close"></button>
          </div>
        )}

        {/* Inventory Directory Table Section */}
        <section className="card glass-panel text-white p-4 animate-fade-in">
          
          {/* Table Directory Controls (Search & Category filter dropdowns) */}
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
            
            {/* Search Input */}
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

            {/* Category Selector */}
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

          {/* Spinner view while synchronization is loading */}
          {loading && products.length === 0 ? (
            <div className="text-center py-5">
              <Loader2 className="animate-spin text-primary fs-3 mb-3" size={36} />
              <p className="text-secondary">Synchronizing database inventory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State Panel when no inventory products are detected */
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
            /* Fully Responsive Inventory Table Grid */
            <div className="table-responsive animate-fade-in">
              <table className="table custom-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: '40%' }}>Product Info</th>
                    <th scope="col" style={{ width: '25%' }}>Category</th>
                    <th scope="col" style={{ width: '20%' }}>Price</th>
                    <th scope="col" style={{ width: '15%' }} className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="animate-fade-in">
                      {/* Name & ID column */}
                      <td>
                        <div className="fw-bold text-white fs-5">{product.name}</div>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          ID: {product._id}
                        </small>
                      </td>
                      {/* Category Badge column */}
                      <td>
                        <span className={`badge badge-category ${getCategoryBadgeClass(product.category)}`}>
                          {product.category}
                        </span>
                      </td>
                      {/* Product Price Column */}
                      <td>
                        <span className="fw-bold text-gradient-cyan fs-5">
                          ₹{parseFloat(product.price).toFixed(2)}
                        </span>
                      </td>
                      {/* CRUD Edit/Delete Actions */}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Global Footer info */}
        <footer className="text-center mt-5 text-secondary animate-fade-in">
          <p className="m-0" style={{ fontSize: '0.9rem' }}>
            StockSync Application Core v1.1.0 &bull; Node.js & Mongoose Backend &bull; SaaS Modal Layout
          </p>
        </footer>
      </div>

      {/* --- ADD PRODUCT MODAL --- */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={closeAllModals} 
        title="Add New Product"
      >
        <form onSubmit={handleSubmit}>
          {/* Product Name Input */}
          <div className="mb-3">
            <label htmlFor="add-name" className="form-label text-secondary fw-semibold">Product Name</label>
            <input
              type="text"
              className="form-control custom-input"
              id="add-name"
              name="name"
              placeholder="e.g. Wireless Headphones"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Price Input */}
          <div className="mb-3">
            <label htmlFor="add-price" className="form-label text-secondary fw-semibold">Price (₹ INR)</label>
            <div className="input-group">
              <span className="input-group-text custom-input border-end-0 text-secondary">₹</span>
              <input
                type="number"
                step="0.01"
                className="form-control custom-input border-start-0"
                id="add-price"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="mb-4">
            <label htmlFor="add-category" className="form-label text-secondary fw-semibold">Category</label>
            <select
              className="form-select custom-input"
              id="add-category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary border-0 px-4"
              onClick={closeAllModals}
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
                <Plus size={16} />
              )}
              Save Product
            </button>
          </div>
        </form>
      </Modal>

      {/* --- EDIT PRODUCT MODAL --- */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={closeAllModals} 
        title="Edit Product Details"
      >
        <form onSubmit={handleSubmit}>
          {/* Product Name Input */}
          <div className="mb-3">
            <label htmlFor="edit-name" className="form-label text-secondary fw-semibold">Product Name</label>
            <input
              type="text"
              className="form-control custom-input"
              id="edit-name"
              name="name"
              placeholder="e.g. Wireless Headphones"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Price Input */}
          <div className="mb-3">
            <label htmlFor="edit-price" className="form-label text-secondary fw-semibold">Price (₹ INR)</label>
            <div className="input-group">
              <span className="input-group-text custom-input border-end-0 text-secondary">₹</span>
              <input
                type="number"
                step="0.01"
                className="form-control custom-input border-start-0"
                id="edit-price"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="mb-4">
            <label htmlFor="edit-category" className="form-label text-secondary fw-semibold">Category</label>
            <select
              className="form-select custom-input"
              id="edit-category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary border-0 px-4"
              onClick={closeAllModals}
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
      </Modal>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={closeAllModals} 
        title="Confirm Deletion"
      >
        <div className="text-center py-2">
          <AlertTriangle className="text-danger mb-3" size={48} />
          <p className="text-white fs-5 fw-semibold mb-2">Are you sure?</p>
          <p className="text-secondary mb-4">
            You are about to delete product <strong className="text-white">"{productToDelete?.name}"</strong>. This action is permanent and cannot be undone.
          </p>
          
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary border-0 px-4"
              onClick={closeAllModals}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger px-4 d-flex align-items-center gap-2"
              onClick={handleDelete}
              disabled={loading}
              style={{ borderRadius: '10px' }}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Trash2 size={16} />
              )}
              Delete Product
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
