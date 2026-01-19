const Product = require("../models/Product");

// @desc    Create new product
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    const {
      propertyTitle,
      category,
      description,
      origin,
      biologicalBackground,
      usage,
      keyCharacteristics,
      displayPhoto,
      additionalPhotos,
      status,
      subcategory,
    } = req.body;

    // Validation
    if (
      !propertyTitle ||
      !category ||
      !description ||
      !origin ||
      !biologicalBackground ||
      !usage ||
      !keyCharacteristics ||
      !displayPhoto
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Create product
    const product = await Product.create({
      propertyTitle,
      category,
      description,
      origin,
      biologicalBackground,
      usage,
      keyCharacteristics,
      displayPhoto,
      additionalPhotos: additionalPhotos || [],
      status: status || "active",
      subcategory: subcategory || null,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, category } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get products
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Private
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    const {
      propertyTitle,
      category,
      description,
      origin,
      biologicalBackground,
      usage,
      keyCharacteristics,
      displayPhoto,
      additionalPhotos,
      status,
      subcategory,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update fields
    if (propertyTitle) product.propertyTitle = propertyTitle;
    if (category) product.category = category;
    if (description) product.description = description;
    if (origin) product.origin = origin;
    if (biologicalBackground)
      product.biologicalBackground = biologicalBackground;
    if (usage) product.usage = usage;
    if (keyCharacteristics) product.keyCharacteristics = keyCharacteristics;
    if (displayPhoto) product.displayPhoto = displayPhoto;
    if (additionalPhotos) product.additionalPhotos = additionalPhotos;
    if (status) product.status = status;
    if (subcategory !== undefined) product.subcategory = subcategory;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};
