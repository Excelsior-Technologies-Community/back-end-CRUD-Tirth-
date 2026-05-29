import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Package, 
  IndianRupee, 
  Tag, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  X
} from 'lucide-react';

// Import our modular components
import ProductTable from '../components/ProductTable';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';

// Import our decoupled api service helper functions
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../services/productApi';

/**
 * Common modal wrapper used for delete confirmation popup.
 */
function Modal({ isOpen, onClose, title, children }) {
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
    <div className="custom-modal-overlay" onClick={onClose}>
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

/**
 * Dashboard Page component
 */
function Dashboard() {
  // --- STATE SYSTEM ---
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: ''
  });

  // Modal control states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Focus entity states
  const [editId, setEditId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // UI status indicators
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('All');

  const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Other'];

  // Load database items on start
  useEffect(() => {
    fetchProductsList();
  }, []);

  // Show temporary overlay alert boxes
  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // --- CRUD API METHODS ---

  // 1. READ Products
  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
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

  // 2. CREATE or UPDATE Product form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      let data;
      if (editId) {
        // Edit flow
        data = await updateProduct(editId, formData);
      } else {
        // Create flow
        data = await createProduct(formData);
      }

      if (data.success) {
        showAlert(data.message || 'Saved successfully!', 'success');
        closeAllModals();
        fetchProductsList();
      } else {
        showAlert(data.message || 'Error occurred', 'danger');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showAlert('Server error. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE Product confirmation
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setLoading(true);
    try {
      const data = await deleteProduct(productToDelete._id);
      if (data.success) {
        showAlert('Product deleted successfully!', 'success');
        closeAllModals();
        fetchProductsList();
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

  // Forms and Modals inputs synchronization
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openAddModal = () => {
    setFormData({ name: '', price: '', category: '' });
    setEditId(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category
    });
    setEditId(product._id);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditId(null);
    setProductToDelete(null);
  };

  // --- STATISTICS CALCULATIONS ---
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

  // Search & category filtration list
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilterCategory === 'All' || product.category === selectedFilterCategory;
    return matchesSearch && matchesCategory;
  });

  const isAnyModalOpen = isAddModalOpen || isEditModalOpen || isDeleteModalOpen;

  return (
    <div className="container py-5 px-4">
      {/* Dynamic Blur when Modals are open */}
      <div className={isAnyModalOpen ? 'modal-backdrop-blur' : ''}>
        
        {/* Main App Title Header */}
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

        {/* Analytics stats Grid layout */}
        <section className="row g-4 mb-5 animate-fade-in">
          
          {/* Metrics total items count */}
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

          {/* Metrics cumulative stock value worth */}
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

          {/* Leading category name with high listing count */}
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

        {/* Global Notifications system */}
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

        {/* Inventory Directory Table component */}
        <ProductTable 
          products={products}
          filteredProducts={filteredProducts}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilterCategory={selectedFilterCategory}
          setSelectedFilterCategory={setSelectedFilterCategory}
          categories={categories}
          loading={loading}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />

        {/* Footer layout */}
        <footer className="text-center mt-5 text-secondary animate-fade-in">
          <p className="m-0" style={{ fontSize: '0.9rem' }}>
            StockSync Application Core v1.1.0 &bull; Node.js & Mongoose Backend &bull; SaaS Modal Layout
          </p>
        </footer>
      </div>

      {/* --- ADD PRODUCT DIALOG --- */}
      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={closeAllModals}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        loading={loading}
        categories={categories}
      />

      {/* --- EDIT PRODUCT DIALOG --- */}
      <EditProductModal 
        isOpen={isEditModalOpen}
        onClose={closeAllModals}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        loading={loading}
        categories={categories}
      />

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
              onClick={handleDeleteProduct}
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

export default Dashboard;
