const Enquiry = require("../models/Enquiry");

// @desc    Create new enquiry
// @route   POST /api/enquiries
// @access  Public
exports.createEnquiry = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      message, 
      type, 
      productId, 
      productName,
      company,
      companyWebsite,
      certifications,
      categories,
      yearsInBusiness,
      anticipatedVolume,
      distributionModel,
      productsOfInterest
    } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // Create enquiry
    const enquiry = await Enquiry.create({
      name,
      email,
      phone: phone || "",
      message,
      type: type || "general",
      productId: productId || null,
      productName: productName || null,
      company: company || null,
      companyWebsite: companyWebsite || null,
      certifications: certifications || null,
      categories: categories || [],
      yearsInBusiness: yearsInBusiness || null,
      anticipatedVolume: anticipatedVolume || null,
      distributionModel: distributionModel || [],
      productsOfInterest: productsOfInterest || [],
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: {
        enquiry,
      },
    });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Error creating enquiry",
      error: error.message,
    });
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private
exports.getAllEnquiries = async (req, res) => {
  try {
    const { type, status } = req.query;

    // Build query
    const query = {};
    if (type && type !== "all") {
      query.type = type;
    }
    if (status && status !== "all") {
      query.status = status;
    }

    // Get enquiries
    const enquiries = await Enquiry.find(query)
      .populate("productId", "propertyTitle displayPhoto category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        enquiries,
      },
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching enquiries",
      error: error.message,
    });
  }
};

// @desc    Get enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Private
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate(
      "productId",
      "propertyTitle displayPhoto category description origin"
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        enquiry,
      },
    });
  } catch (error) {
    console.error("Error fetching enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching enquiry",
      error: error.message,
    });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private
exports.updateEnquiry = async (req, res) => {
  try {
    const { status } = req.body;

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    if (status) {
      enquiry.status = status;
    }

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: {
        enquiry,
      },
    });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Error updating enquiry",
      error: error.message,
    });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    await Enquiry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting enquiry",
      error: error.message,
    });
  }
};

