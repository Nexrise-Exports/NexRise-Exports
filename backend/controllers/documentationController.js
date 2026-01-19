const Documentation = require("../models/Documentation");

// @desc    Create new documentation
// @route   POST /api/documentation
// @access  Private
exports.createDocumentation = async (req, res) => {
  try {
    const { title, image, status } = req.body;

    // Validation
    if (!title || !image) {
      return res.status(400).json({
        success: false,
        message: "Title and image are required",
      });
    }

    // Create documentation
    const documentation = await Documentation.create({
      title,
      image,
      status: status || "active",
    });

    res.status(201).json({
      success: true,
      message: "Documentation created successfully",
      data: {
        documentation,
      },
    });
  } catch (error) {
    console.error("Error creating documentation:", error);
    res.status(500).json({
      success: false,
      message: "Error creating documentation",
      error: error.message,
    });
  }
};

// @desc    Get all documentation
// @route   GET /api/documentation
// @access  Public
exports.getAllDocumentation = async (req, res) => {
  try {
    const { status } = req.query;

    // Build query
    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    // Get documentation
    const documentation = await Documentation.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: {
        documentation,
      },
    });
  } catch (error) {
    console.error("Error fetching documentation:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching documentation",
      error: error.message,
    });
  }
};

// @desc    Get documentation by ID
// @route   GET /api/documentation/:id
// @access  Public
exports.getDocumentationById = async (req, res) => {
  try {
    const documentation = await Documentation.findById(req.params.id);

    if (!documentation) {
      return res.status(404).json({
        success: false,
        message: "Documentation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        documentation,
      },
    });
  } catch (error) {
    console.error("Error fetching documentation:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching documentation",
      error: error.message,
    });
  }
};

// @desc    Update documentation
// @route   PUT /api/documentation/:id
// @access  Private
exports.updateDocumentation = async (req, res) => {
  try {
    const { title, image, status } = req.body;

    const documentation = await Documentation.findById(req.params.id);

    if (!documentation) {
      return res.status(404).json({
        success: false,
        message: "Documentation not found",
      });
    }

    // Update fields
    if (title) documentation.title = title;
    if (image) documentation.image = image;
    if (status) documentation.status = status;

    await documentation.save();

    res.status(200).json({
      success: true,
      message: "Documentation updated successfully",
      data: {
        documentation,
      },
    });
  } catch (error) {
    console.error("Error updating documentation:", error);
    res.status(500).json({
      success: false,
      message: "Error updating documentation",
      error: error.message,
    });
  }
};

// @desc    Delete documentation
// @route   DELETE /api/documentation/:id
// @access  Private
exports.deleteDocumentation = async (req, res) => {
  try {
    const documentation = await Documentation.findById(req.params.id);

    if (!documentation) {
      return res.status(404).json({
        success: false,
        message: "Documentation not found",
      });
    }

    await Documentation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lisence/Certification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting documentation:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting documentation",
      error: error.message,
    });
  }
};
