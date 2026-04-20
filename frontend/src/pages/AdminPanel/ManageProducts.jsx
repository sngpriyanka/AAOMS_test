import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiImage, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';
import './AdminPanel.css';

function ManageProducts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [editFormData, setEditFormData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [imageInputMode, setImageInputMode] = useState('url'); // 'url' or 'upload'
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, filterCategory]);

  const fetchProducts = async () => {
    try {
      // Comprehensive products data from all categories
      const realProducts = [
        // T-SHIRTS
        { id: 1, name: 'BOLD HORIZONS: CLASSIC OVERSIZED T-SHIRT', category: 'tshirts', price: 1199, stock: 25, image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600', status: 'active', createdAt: '2026-04-09', sales: 156, sku: 'TSHIRT001', description: 'Classic oversized tshirt with bold horizons design' },
        { id: 2, name: 'WANDERLUST GRAPHIC T-SHIRT', category: 'tshirts', price: 1099, stock: 18, image: 'https://plus.unsplash.com/premium_photo-1718913936342-eaafff98834b?w=600', status: 'active', createdAt: '2026-04-09', sales: 124, sku: 'TSHIRT002', description: 'Wanderlust themed graphic tshirt' },
        { id: 3, name: 'MOUNTAIN EXPLORER T-SHIRT', category: 'tshirts', price: 1199, stock: 42, image: 'https://plus.unsplash.com/premium_photo-1690349404224-53f94f20df8f?w=600', status: 'active', createdAt: '2026-04-09', sales: 89, sku: 'TSHIRT003', description: 'Mountain explorer themed tshirt' },
        { id: 4, name: 'VINTAGE ADVENTURE T-SHIRT', category: 'tshirts', price: 999, stock: 5, image: 'https://images.unsplash.com/photo-1521498542256-5aeb47ba2b36?w=600', status: 'limited-stock', createdAt: '2026-04-09', sales: 76, sku: 'TSHIRT004', description: 'Vintage adventure design' },

        // PRINTED T-SHIRTS
        { id: 5, name: 'BOLD HORIZONS PRINTED T-SHIRT', category: 'printed-tshirts', price: 1199, stock: 20, image: 'https://images.unsplash.com/photo-1678951553950-90123af8b2eb?w=600', status: 'active', createdAt: '2026-04-09', sales: 95, sku: 'PRINT001', description: 'Printed tshirt with bold horizons' },
        { id: 6, name: 'WANDERLUST GRAPHIC PRINTED', category: 'printed-tshirts', price: 1099, stock: 15, image: 'https://images.unsplash.com/photo-1625578388299-c1a45099ccba?w=600', status: 'active', createdAt: '2026-04-09', sales: 82, sku: 'PRINT002', description: 'Wanderlust graphic printed tshirt' },
        { id: 7, name: 'MOUNTAIN EXPLORER PRINTED', category: 'printed-tshirts', price: 1199, stock: 18, image: 'https://plus.unsplash.com/premium_photo-1770394054132-641dcf97d782?w=600', status: 'active', createdAt: '2026-04-09', sales: 67, sku: 'PRINT003', description: 'Mountain explorer printed design' },

        // PLAIN T-SHIRTS
        { id: 8, name: 'ESSENTIAL COTTON T-SHIRT', category: 'plain-tshirts', price: 799, stock: 50, image: 'https://images.unsplash.com/photo-1759572095329-1dcf9522762b?w=600', status: 'active', createdAt: '2026-04-09', sales: 234, sku: 'PLAIN001', description: 'Essential cotton plain tshirt' },
        { id: 9, name: 'PREMIUM SUPIMA T-SHIRT', category: 'plain-tshirts', price: 1299, stock: 30, image: 'https://images.unsplash.com/photo-1618354691551-44de113f0164?w=600', status: 'active', createdAt: '2026-04-09', sales: 156, sku: 'PLAIN002', description: 'Premium supima cotton tshirt' },
        { id: 10, name: 'CLASSIC CREW NECK T-SHIRT', category: 'plain-tshirts', price: 699, stock: 45, image: 'https://plus.unsplash.com/premium_photo-1689565524694-88720c282271?w=600', status: 'active', createdAt: '2026-04-09', sales: 198, sku: 'PLAIN003', description: 'Classic crew neck plain tshirt' },

        // PRINTED SWEATSHIRTS
        { id: 11, name: 'MOUNTAIN CALLING SWEATSHIRT', category: 'printed-sweatshirts', price: 2299, stock: 12, image: 'https://images.unsplash.com/photo-1767610966967-7c6da03579ea?w=600', status: 'active', createdAt: '2026-04-09', sales: 67, sku: 'SWEAT001', description: 'Mountain calling printed sweatshirt' },
        { id: 12, name: 'ADVENTURE AWAITS SWEATSHIRT', category: 'printed-sweatshirts', price: 2199, stock: 14, image: 'https://images.unsplash.com/photo-1657130285329-70352efe9f09?w=600', status: 'active', createdAt: '2026-04-09', sales: 54, sku: 'SWEAT002', description: 'Adventure awaits printed sweatshirt' },

        // PLAIN SWEATSHIRTS
        { id: 13, name: 'ESSENTIAL PLAIN SWEATSHIRT', category: 'plain-sweatshirts', price: 1999, stock: 25, image: 'https://images.unsplash.com/photo-1633781935348-80f0b213179e?w=600', status: 'active', createdAt: '2026-04-09', sales: 145, sku: 'PSWEAT001', description: 'Essential plain sweatshirt' },
        { id: 14, name: 'CLASSIC CREWNECK SWEATSHIRT', category: 'plain-sweatshirts', price: 1899, stock: 20, image: 'https://images.unsplash.com/photo-1731570762889-ff7509212405?w=600', status: 'active', createdAt: '2026-04-09', sales: 123, sku: 'PSWEAT002', description: 'Classic crewneck sweatshirt' },

        // HOODIES
        { id: 15, name: 'CLASSIC TROOPER HOODIE', category: 'hoodies', price: 2699, stock: 15, image: 'https://images.unsplash.com/photo-1618333845076-890b5baf8ffe?w=600', status: 'active', createdAt: '2026-04-09', sales: 89, sku: 'HOOD001', description: 'Classic trooper hoodie' },
        { id: 16, name: 'EXPLORER ZIP-UP HOODIE', category: 'hoodies', price: 2999, stock: 10, image: 'https://images.unsplash.com/photo-1622567893612-a5345baa5c9a?w=600', status: 'active', createdAt: '2026-04-09', sales: 67, sku: 'HOOD002', description: 'Explorer zip-up hoodie' },
        { id: 17, name: 'OVERSIZED COMFORT HOODIE', category: 'hoodies', price: 2799, stock: 18, image: 'https://images.unsplash.com/photo-1680292783974-a9a336c10366?w=600', status: 'active', createdAt: '2026-04-09', sales: 94, sku: 'HOOD003', description: 'Oversized comfort hoodie' },

        // HOPPERS
        { id: 18, name: '9-POCKETS DENIM CARGO MAX HOPPERS', category: 'hoppers', price: 2875, stock: 8, image: 'https://aaoms.com/cdn/shop/files/BTP0015-Olive-Knee-Patch-Male-Front.jpg?v=1753454832&width=900', status: 'active', createdAt: '2026-04-09', sales: 56, sku: 'HOP001', description: '9-pockets denim cargo max hoppers' },
        { id: 19, name: 'AEGEAN BLUE AIRWAVE HOPPERS', category: 'hoppers', price: 2475, stock: 12, image: 'https://m.media-amazon.com/images/I/71FDRjV0EyL._AC_UY1100_.jpg', status: 'active', createdAt: '2026-04-09', sales: 78, sku: 'HOP002', description: 'Aegean blue airwave hoppers' },
        { id: 20, name: 'JET BLACK AIRWAVE HOPPERS', category: 'hoppers', price: 2475, stock: 20, image: 'https://thedancebible.com/cdn/shop/products/Men_Jogger_1_1_685078e4-4427-49fd-a0c6-fe7e003fef5c.jpg?v=1681586516', status: 'active', createdAt: '2026-04-09', sales: 65, sku: 'HOP003', description: 'Jet black airwave hoppers' },

        // TRAVEL PANTS
        { id: 21, name: 'TROOPERGO: ULTRA LIGHT TREKKING PANTS', category: 'travel-pants', price: 2475, stock: 10, image: 'https://images.unsplash.com/photo-1764726321742-6336144975bd?w=600', status: 'active', createdAt: '2026-04-09', sales: 43, sku: 'TRAVEL001', description: 'Ultra light trekking pants' },
        { id: 22, name: 'TROOPERGO: AIRWAVE TREKKING PANTS', category: 'travel-pants', price: 2475, stock: 14, image: 'https://plus.unsplash.com/premium_photo-1756154061397-879a4bcd0b7b?w=600', status: 'active', createdAt: '2026-04-09', sales: 51, sku: 'TRAVEL002', description: 'Airwave trekking pants' },
        { id: 23, name: 'CONVERTIBLE TRAVEL PANTS', category: 'travel-pants', price: 2799, stock: 7, image: 'https://images.unsplash.com/photo-1758565203908-199605f365e3?w=600', status: 'limited-stock', createdAt: '2026-04-09', sales: 38, sku: 'TRAVEL003', description: 'Convertible travel pants' },

        // CARGO PANTS
        { id: 24, name: 'TROOPERGO: 2-IN-1 UTILITY CARGO PANTS', category: 'cargo-pants', price: 4250, stock: 5, image: 'https://images.unsplash.com/photo-1766575694179-e159f786d2e3?w=600', status: 'limited-stock', createdAt: '2026-04-09', sales: 76, sku: 'CARGO001', description: '2-in-1 utility cargo pants' },
        { id: 25, name: 'DESERT TAN CARGO MAX HOPPERS', category: 'cargo-pants', price: 2875, stock: 9, image: 'https://lachicpick.in/wp-content/uploads/2023/08/988-6.png', status: 'active', createdAt: '2026-04-09', sales: 42, sku: 'CARGO002', description: 'Desert tan cargo max hoppers' },
        { id: 26, name: 'NAVY & BLACK TROOPERGO CARGO HOPPERS', category: 'cargo-pants', price: 2475, stock: 11, image: 'https://i.ebayimg.com/images/g/36sAAOSwv8Vh3QNk/s-l1000.jpg', status: 'active', createdAt: '2026-04-09', sales: 55, sku: 'CARGO003', description: 'Navy & black cargo hoppers' },

        // CARGO SHORTS
        { id: 27, name: 'TACTICAL CARGO SHORTS', category: 'cargo-shorts', price: 1875, stock: 16, image: 'https://images.unsplash.com/photo-1748565387500-849a7d3b4989?w=600', status: 'active', createdAt: '2026-04-09', sales: 72, sku: 'SHORT001', description: 'Tactical cargo shorts' },
        { id: 28, name: 'CLASSIC CARGO SHORTS', category: 'cargo-shorts', price: 1699, stock: 22, image: 'https://m.media-amazon.com/images/I/81lTvTXU5LL._AC_SL1500_.jpg', status: 'active', createdAt: '2026-04-09', sales: 88, sku: 'SHORT002', description: 'Classic cargo shorts' },
        { id: 29, name: 'RIPSTOP CARGO SHORTS', category: 'cargo-shorts', price: 1799, stock: 13, image: 'https://lane201.com/cdn/shop/files/mocha-cargo-shorts-1157642484.jpg?v=1759305099&width=2048', status: 'active', createdAt: '2026-04-09', sales: 61, sku: 'SHORT003', description: 'Ripstop cargo shorts' },

        // APRON
        { id: 30, name: 'CLASSIC CHEF APRON - BLACK', category: 'apron', price: 1499, stock: 20, image: 'https://cpimg.tistatic.com/05476522/b/4/Hospital-Staff-Apron.jpg', status: 'active', createdAt: '2026-04-09', sales: 105, sku: 'APRON001', description: 'Classic chef apron in black' },
        { id: 31, name: 'CLASSIC CHEF APRON - WHITE', category: 'apron', price: 1499, stock: 15, image: 'https://5.imimg.com/data5/ANDROID/Default/2021/7/KA/HX/OO/107036322/img-20210722-wa0014-jpg-500x500.jpg', status: 'active', createdAt: '2026-04-09', sales: 98, sku: 'APRON002', description: 'Classic chef apron in white' },
        { id: 32, name: 'CLASSIC CHEF APRON - NAVY', category: 'apron', price: 1499, stock: 18, image: 'https://img500.exportersindia.com/product_images/bc-500/dir_169/5065292/hospital-aprons-1498916168-3099356.jpeg', status: 'active', createdAt: '2026-04-09', sales: 92, sku: 'APRON003', description: 'Classic chef apron in navy' },
        { id: 33, name: 'BARISTA APRON - DENIM', category: 'apron', price: 1799, stock: 12, image: 'https://www.retterworkwear.com/uploaded-files/category/images/thumbs/Nurse-Tops-thumbs-300X300.jpg', status: 'active', createdAt: '2026-04-09', sales: 67, sku: 'APRON004', description: 'Barista apron in denim' },
        { id: 34, name: 'UTILITY WORK APRON', category: 'apron', price: 1999, stock: 10, image: 'https://4.imimg.com/data4/TS/AJ/MY-2676438/cotton-apron-500x500.jpg', status: 'active', createdAt: '2026-04-09', sales: 52, sku: 'APRON005', description: 'Utility work apron' },

        // SCRUBS
        { id: 35, name: 'CLASSIC V-NECK SCRUB TOP - CEIL BLUE', category: 'scrubs', price: 1299, stock: 25, image: 'https://images.unsplash.com/photo-1579496785978-3351b928db46?w=600', status: 'active', createdAt: '2026-04-09', sales: 156, sku: 'SCRUB001', description: 'V-neck scrub top in ceil blue' },
        { id: 36, name: 'CLASSIC V-NECK SCRUB TOP - NAVY', category: 'scrubs', price: 1299, stock: 22, image: 'https://images.unsplash.com/photo-1594819394842-ecc71eca5c94?w=600', status: 'active', createdAt: '2026-04-09', sales: 143, sku: 'SCRUB002', description: 'V-neck scrub top in navy' },
        { id: 37, name: 'DRAWSTRING SCRUB PANTS - CEIL BLUE', category: 'scrubs', price: 1199, stock: 30, image: 'https://images.unsplash.com/photo-1613852131675-a2283b88c399?w=600', status: 'active', createdAt: '2026-04-09', sales: 198, sku: 'SCRUB003', description: 'Drawstring scrub pants in ceil blue' },
        { id: 38, name: 'DRAWSTRING SCRUB PANTS - NAVY', category: 'scrubs', price: 1199, stock: 28, image: 'https://images.unsplash.com/photo-1599621957815-82a36cd33cc5?w=600', status: 'active', createdAt: '2026-04-09', sales: 187, sku: 'SCRUB004', description: 'Drawstring scrub pants in navy' },
        { id: 39, name: 'SCRUB SET - CEIL BLUE (TOP + PANTS)', category: 'scrubs', price: 2299, stock: 15, image: 'https://images.unsplash.com/photo-1579496785978-3351b928db46?w=600', status: 'active', createdAt: '2026-04-09', sales: 124, sku: 'SCRUB005', description: 'Complete scrub set in ceil blue' },

        // BOUTIQUE PRODUCTS
        { id: 40, name: 'HANDCRAFTED LEATHER JOURNAL', category: 'boutique-products', price: 1899, stock: 8, image: 'https://plus.unsplash.com/premium_photo-1682096060450-6ac06a3a0478?w=600', status: 'active', createdAt: '2026-04-09', sales: 31, sku: 'BOUT001', description: 'Handcrafted leather journal' },
        { id: 41, name: 'ARTISAN CANVAS TOTE BAG', category: 'boutique-products', price: 1599, stock: 14, image: 'https://images.unsplash.com/photo-1601432093209-8af1fd74b054?w=600', status: 'active', createdAt: '2026-04-09', sales: 44, sku: 'BOUT002', description: 'Artisan canvas tote bag' },
        { id: 42, name: 'VINTAGE BRASS COMPASS', category: 'boutique-products', price: 2499, stock: 5, image: 'https://images.unsplash.com/photo-1763971922552-fa9cbe06db7a?w=600', status: 'limited-stock', createdAt: '2026-04-09', sales: 18, sku: 'BOUT003', description: 'Vintage brass compass' },
        { id: 43, name: 'HAND-STITCHED PASSPORT HOLDER', category: 'boutique-products', price: 1299, stock: 11, image: 'https://images.unsplash.com/photo-1765269304156-7e4fff7e45ab?w=600', status: 'active', createdAt: '2026-04-09', sales: 37, sku: 'BOUT004', description: 'Hand-stitched passport holder' },
        { id: 44, name: 'WOODEN WATCH - WALNUT', category: 'boutique-products', price: 3999, stock: 3, image: 'https://images.unsplash.com/photo-1772683530217-b2dfb462c483?w=600', status: 'limited-stock', createdAt: '2026-04-09', sales: 12, sku: 'BOUT005', description: 'Wooden watch in walnut' },
      ];
      setProducts(realProducts);
      setFilteredProducts(realProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    setFilteredProducts(filtered);
  };

  const deleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
      setShowModal(false);
      toast.success('Product deleted successfully!');
    }
  };

  const handleEditClick = () => {
    setEditFormData({ ...selectedProduct });
    setModalMode('edit');
  };

  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    if (!editFormData.name || !editFormData.price || !editFormData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id ? editFormData : p
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setSelectedProduct(editFormData);
    setModalMode('view');
    toast.success('Product updated successfully!');
  };

  const handleAddProduct = () => {
    setShowAddForm(true);
    setEditFormData({
      id: Date.now(),
      name: '',
      category: 't-shirts',
      price: 0,
      stock: 0,
      image: '',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      sales: 0,
      sku: '',
      description: ''
    });
    setImageInputMode('url');
    setImageUrlInput('');
    setImagePreviewError(false);
  };

  const handleSaveNewProduct = () => {
    if (!editFormData.name || !editFormData.price || !editFormData.stock || !editFormData.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newProduct = {
      ...editFormData,
      price: parseInt(editFormData.price),
      stock: parseInt(editFormData.stock),
      status: parseInt(editFormData.stock) === 0 ? 'out-of-stock' : parseInt(editFormData.stock) < 10 ? 'limited-stock' : 'active'
    };

    setProducts([newProduct, ...products]);
    setShowAddForm(false);
    toast.success('Product added successfully!');
  };

  const handleChangeImage = () => {
    setShowImageOptions(true);
    setImageInputMode('url');
    setImageUrlInput(editFormData.image || '');
    setImagePreviewError(false);
  };

  const handleImageUrlChange = (url) => {
    setImageUrlInput(url);
    if (url.trim()) {
      const img = new Image();
      img.onload = () => {
        setImagePreviewError(false);
        setEditFormData(prev => ({ ...prev, image: url }));
      };
      img.onerror = () => {
        setImagePreviewError(true);
        setEditFormData(prev => ({ ...prev, image: '' }));
      };
      img.src = url;
    } else {
      setEditFormData(prev => ({ ...prev, image: '' }));
    }
  };

  const handleImageUrlSubmit = () => {
    if (imageUrlInput.trim()) {
      setEditFormData(prev => ({ ...prev, image: imageUrlInput }));
      setShowImageOptions(false);
      setImagePreviewError(false);
    } else {
      toast.error('Please enter a valid image URL');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditFormData(prev => ({ ...prev, image: event.target.result }));
        setShowImageOptions(false);
        setImagePreviewError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status) => {
    const colors = { active: '#4CAF50', 'limited-stock': '#FF9800', 'out-of-stock': '#F44336' };
    return colors[status] || '#999';
  };

  // All categories from the project
  const categories = [
    'tshirts',
    'boutique-products',
    'printed-tshirts',
    'plain-tshirts',
    'printed-sweatshirts',
    'plain-sweatshirts',
    'hoodies',
    'hoppers',
    'travel-pants',
    'cargo-pants',
    'cargo-shorts',
    'apron',
    'scrubs'
  ];

  return (
    <div className="admin-container">
      <div className="admin-header-section">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1>📦 Product Management</h1>
        <p>Add, edit, and manage products</p>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="product-management-container">
          {/* Search & Filters */}
          <div className="filters-section">
            <div className="search-input">
              <FiSearch />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
              ))}
            </select>

            <button className="action-btn" style={{ backgroundColor: '#4CAF50' }} onClick={handleAddProduct}>
              <FiPlus /> Add Product
            </button>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="category" style={{ textTransform: 'capitalize', color: '#666', fontSize: '12px' }}>{product.category}</p>
                    <p className="price">Rs. {product.price.toLocaleString()}</p>
                    <div className="stock-info">
                      <span>Stock: <strong>{product.stock}</strong></span>
                      <span className="badge" style={{ backgroundColor: getStatusColor(product.status), marginLeft: '10px' }}>
                        {product.status}
                      </span>
                    </div>
                    <p className="sales">Sales: {product.sales}</p>
                    {product.sku && <p style={{ fontSize: '11px', color: '#999' }}>SKU: {product.sku}</p>}
                  </div>
                  <div className="product-actions">
                    <button 
                      className="icon-btn"
                      onClick={() => { setSelectedProduct(product); setEditFormData(product); setModalMode('edit'); setShowModal(true); }}
                    >
                      <FiEdit2 /> Edit Details
                    </button>
                    <button 
                      className="icon-btn"
                      onClick={() => { setSelectedProduct(product); setEditFormData(product); setShowImageOptions(true); setImageInputMode('url'); setImageUrlInput(product.image || ''); setModalMode('edit'); setShowModal(true); }}
                    >
                      <FiImage /> Change Image
                    </button>
                    <button 
                      className="icon-btn delete"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#999' }}>
                No products found
              </div>
            )}
          </div>

          {/* Product Detail Modal */}
          {showModal && selectedProduct && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{modalMode === 'edit' ? 'Edit Product' : 'Product Details'}</h2>
                  <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
                </div>
                <div className="modal-body">
                  {modalMode === 'edit' ? (
                    <div className="product-form">
                      <div className="form-group">
                        <label>Product Image</label>
                        <div style={{ marginBottom: '10px', border: '2px solid #ddd', borderRadius: '4px', padding: '10px', backgroundColor: '#f9f9f9' }}>
                          {editFormData.image ? (
                            <img src={editFormData.image} alt="Preview" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }} onError={() => console.warn('Image failed to load')} />
                          ) : (
                            <div style={{ width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                              No image selected
                            </div>
                          )}
                        </div>
                        
                        {!showImageOptions ? (
                          <button className="action-btn" onClick={handleChangeImage} style={{ width: '100%' }}>
                            <FiImage /> Change Image
                          </button>
                        ) : (
                          <div style={{ border: '1px solid #2196F3', borderRadius: '4px', padding: '12px', backgroundColor: '#f0f7ff' }}>
                            <div style={{ marginBottom: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button 
                                className="action-btn" 
                                onClick={() => setImageInputMode('url')}
                                style={{ 
                                  flex: 1, 
                                  minWidth: '100px',
                                  backgroundColor: imageInputMode === 'url' ? '#2196F3' : '#ddd',
                                  color: imageInputMode === 'url' ? 'white' : 'black'
                                }}
                              >
                                🔗 URL
                              </button>
                              <button 
                                className="action-btn" 
                                onClick={() => setImageInputMode('upload')}
                                style={{ 
                                  flex: 1, 
                                  minWidth: '100px',
                                  backgroundColor: imageInputMode === 'upload' ? '#2196F3' : '#ddd',
                                  color: imageInputMode === 'upload' ? 'white' : 'black'
                                }}
                              >
                                📤 Upload
                              </button>
                            </div>

                            {imageInputMode === 'url' ? (
                              <div>
                                <input 
                                  type="text"
                                  value={imageUrlInput}
                                  onChange={(e) => handleImageUrlChange(e.target.value)}
                                  placeholder="Paste image URL here"
                                  style={{ 
                                    width: '100%', 
                                    padding: '8px', 
                                    borderRadius: '4px', 
                                    border: `2px solid ${imagePreviewError ? '#F44336' : '#2196F3'}`,
                                    marginBottom: '8px',
                                    boxSizing: 'border-box'
                                  }}
                                />
                                {imagePreviewError && <p style={{ color: '#F44336', fontSize: '12px', marginBottom: '8px' }}>⚠️ Invalid image URL</p>}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button 
                                    className="action-btn" 
                                    onClick={handleImageUrlSubmit}
                                    style={{ flex: 1, backgroundColor: '#4CAF50' }}
                                  >
                                    ✓ Use URL
                                  </button>
                                  <button 
                                    className="action-btn" 
                                    onClick={() => setShowImageOptions(false)}
                                    style={{ flex: 1, backgroundColor: '#999' }}
                                  >
                                    ✕ Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <input 
                                  type="file" 
                                  id="image-upload-input"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  style={{ 
                                    width: '100%', 
                                    padding: '8px',
                                    marginBottom: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                  }}
                                />
                                <button 
                                  className="action-btn" 
                                  onClick={() => setShowImageOptions(false)}
                                  style={{ width: '100%', backgroundColor: '#999' }}
                                >
                                  ✕ Done
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Product Name *</label>
                        <input 
                          type="text"
                          value={editFormData.name || ''}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          placeholder="Enter product name"
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                      </div>
                      <div className="form-group">
                        <label>SKU</label>
                        <input 
                          type="text"
                          value={editFormData.sku || ''}
                          onChange={(e) => handleFormChange('sku', e.target.value)}
                          placeholder="Enter SKU"
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Category *</label>
                        <select 
                          value={editFormData.category || 'tshirts'}
                          onChange={(e) => handleFormChange('category', e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>
                              {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea 
                          value={editFormData.description || ''}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          placeholder="Enter product description"
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '60px' }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Price (Rs.) *</label>
                        <input 
                          type="number"
                          value={editFormData.price || 0}
                          onChange={(e) => handleFormChange('price', e.target.value)}
                          placeholder="Enter price"
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Stock Amount *</label>
                        <input 
                          type="number"
                          value={editFormData.stock || 0}
                          onChange={(e) => handleFormChange('stock', e.target.value)}
                          placeholder="Enter stock amount"
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="product-detail">
                      <div className="detail-item" style={{ gridColumn: '1/-1', marginBottom: '20px' }}>
                        <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '4px' }} />
                      </div>
                      <div className="detail-item">
                        <label>Name</label>
                        <p><strong>{selectedProduct.name}</strong></p>
                      </div>
                      <div className="detail-item">
                        <label>SKU</label>
                        <p>{selectedProduct.sku}</p>
                      </div>
                      <div className="detail-item">
                        <label>Category</label>
                        <p style={{ textTransform: 'capitalize' }}>{selectedProduct.category}</p>
                      </div>
                      <div className="detail-item">
                        <label>Description</label>
                        <p>{selectedProduct.description}</p>
                      </div>
                      <div className="detail-item">
                        <label>Price</label>
                        <p>Rs. {selectedProduct.price.toLocaleString()}</p>
                      </div>
                      <div className="detail-item">
                        <label>Stock</label>
                        <p>{selectedProduct.stock} units</p>
                      </div>
                      <div className="detail-item">
                        <label>Status</label>
                        <p>
                          <span className="badge" style={{ backgroundColor: getStatusColor(selectedProduct.status) }}>
                            {selectedProduct.status}
                          </span>
                        </p>
                      </div>
                      <div className="detail-item">
                        <label>Total Sales</label>
                        <p>{selectedProduct.sales}</p>
                      </div>
                      <div className="detail-item">
                        <label>Created Date</label>
                        <p>{selectedProduct.createdAt}</p>
                      </div>
                    </div>
                  )}

                  <div className="modal-actions">
                    {modalMode === 'edit' ? (
                      <>
                        <button className="action-btn save-changes" onClick={handleSaveEdit}>
                          ✓ Save Changes
                        </button>
                        <button className="action-btn cancel-btn" onClick={() => setModalMode('view')}>
                          ✕ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="action-btn edit-details" onClick={handleEditClick}>
                          <FiEdit2 /> Edit Details
                        </button>
                        <button className="action-btn delete" onClick={() => deleteProduct(selectedProduct.id)}>
                          <FiTrash2 /> Delete Product
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Product Modal */}
          {showAddForm && (
            <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Add New Product</h2>
                  <button className="modal-close" onClick={() => setShowAddForm(false)}><FiX /></button>
                </div>
                <div className="modal-body">
                  <div className="product-form">
                    <div className="form-group">
                      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        Product Image *
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setImageInputMode('url')}
                            style={{
                              padding: '4px 10px',
                              fontSize: '12px',
                              backgroundColor: imageInputMode === 'url' ? '#2196F3' : '#ddd',
                              color: imageInputMode === 'url' ? '#fff' : '#333',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: imageInputMode === 'url' ? '600' : '400'
                            }}
                          >
                            URL
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageInputMode('upload')}
                            style={{
                              padding: '4px 10px',
                              fontSize: '12px',
                              backgroundColor: imageInputMode === 'upload' ? '#4CAF50' : '#ddd',
                              color: imageInputMode === 'upload' ? '#fff' : '#333',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: imageInputMode === 'upload' ? '600' : '400'
                            }}
                          >
                            Upload
                          </button>
                        </div>
                      </label>
                      {imageInputMode === 'url' ? (
                        <input 
                          type="text"
                          value={imageUrlInput}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          placeholder="Enter image URL or paste Unsplash image link"
                          style={{ 
                            width: '100%', 
                            padding: '8px', 
                            borderRadius: '4px', 
                            border: `2px solid ${imagePreviewError ? '#F44336' : '#ddd'}`,
                            boxSizing: 'border-box'
                          }}
                        />
                      ) : (
                        <div>
                          <input 
                            type="file" 
                            id="add-product-image-upload"
                            accept="image/*"
                            onChange={(e) => {
                              handleImageUpload(e);
                              setImageInputMode('url');
                            }}
                            style={{ 
                              width: '100%', 
                              padding: '8px',
                              border: '1px solid #ddd',
                              borderRadius: '4px'
                            }}
                          />
                        </div>
                      )}
                      {imagePreviewError && imageInputMode === 'url' && <p style={{ color: '#F44336', fontSize: '12px', marginTop: '8px' }}>⚠️ Invalid image URL</p>}
                      {editFormData.image && (
                        <img 
                          src={editFormData.image} 
                          alt="Preview" 
                          style={{ 
                            width: '100%', 
                            maxHeight: '150px', 
                            objectFit: 'cover', 
                            borderRadius: '4px', 
                            marginTop: '10px' 
                          }} 
                          onError={() => {
                            setImagePreviewError(true);
                            toast.error('Invalid image');
                          }}
                        />
                      )}
                    </div>
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input 
                        type="text"
                        value={editFormData.name || ''}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        placeholder="Enter product name"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>SKU</label>
                      <input 
                        type="text"
                        value={editFormData.sku || ''}
                        onChange={(e) => handleFormChange('sku', e.target.value)}
                        placeholder="Enter SKU code (e.g., BTOSTHO5)"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select 
                        value={editFormData.category || 'tshirts'}
                        onChange={(e) => handleFormChange('category', e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea 
                        value={editFormData.description || ''}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        placeholder="Enter product description"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '60px' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Price (Rs.) *</label>
                      <input 
                        type="number"
                        value={editFormData.price || 0}
                        onChange={(e) => handleFormChange('price', e.target.value)}
                        placeholder="Enter price in Rupees"
                        min="0"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Stock Amount *</label>
                      <input 
                        type="number"
                        value={editFormData.stock || 0}
                        onChange={(e) => handleFormChange('stock', e.target.value)}
                        placeholder="Enter stock quantity"
                        min="0"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button className="action-btn" style={{ backgroundColor: '#4CAF50' }} onClick={handleSaveNewProduct}>
                      ✓ Add Product
                    </button>
                    <button className="action-btn cancel-btn" onClick={() => setShowAddForm(false)}>
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ManageProducts;
