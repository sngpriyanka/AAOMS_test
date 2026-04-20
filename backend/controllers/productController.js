const Database = require('../models/Database');
const { validateProductData } = require('../utils/validators');
const PRODUCTS_COLLECTION = 'products';

exports.getAllProducts = (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;
    
    let products = Database.readAll(PRODUCTS_COLLECTION);

    // Filter by category
    if (category) {
      products = products.filter(p => p.category === category);
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      products = products.filter(p => {
        const price = parseFloat(p.price);
        if (minPrice && price < parseFloat(minPrice)) return false;
        if (maxPrice && price > parseFloat(maxPrice)) return false;
        return true;
      });
    }

    // Search by name or description
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.tagline && p.description.tagline.toLowerCase().includes(searchLower))
      );
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(skip, skip + limitNum);

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        total: products.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(products.length / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

exports.getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const product = Database.read(PRODUCTS_COLLECTION, id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

exports.getProductBySlug = (req, res) => {
  try {
    const { slug } = req.params;
    const products = Database.readAll(PRODUCTS_COLLECTION);
    const product = products.find(p => p.slug === slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

exports.createProduct = (req, res) => {
  try {
    // Only admin or super admin can create products
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create products'
      });
    }

    const validation = validateProductData(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const newProduct = Database.create(PRODUCTS_COLLECTION, {
      ...req.body,
      createdBy: req.user.id,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

exports.updateProduct = (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update products'
      });
    }

    const { id } = req.params;
    const updated = Database.update(PRODUCTS_COLLECTION, id, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

exports.deleteProduct = (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete products'
      });
    }

    const { id } = req.params;
    Database.delete(PRODUCTS_COLLECTION, id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Get customization options for aprons and scrubs
exports.getCustomizationOptions = (req, res) => {
  try {
    const { category } = req.query;

    if (category === 'apron' || category === 'scrub') {
      const options = {
        success: true,
        data: {
          types: [
            {
              id: 'embroidery_name',
              name: 'Embroidery with Name',
              price: 200,
              description: 'Add your name with embroidery'
            },
            {
              id: 'embroidery_logo',
              name: 'Embroidery with Logo',
              price: 300,
              description: 'Add your company logo with embroidery'
            },
            {
              id: 'both',
              name: 'Name + Logo Embroidery',
              price: 400,
              description: 'Add both name and logo'
            }
          ]
        }
      };
      return res.json(options);
    }

    res.json({
      success: true,
      data: {
        types: []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customization options',
      error: error.message
    });
  }
};
