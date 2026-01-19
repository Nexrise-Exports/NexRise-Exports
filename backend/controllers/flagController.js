const Flag = require("../models/Flag");

// @desc    Get all flags
// @route   GET /api/flags
// @access  Public
exports.getFlags = async (req, res) => {
  try {
    const flags = await Flag.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: flags,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create a flag
// @route   POST /api/flags
// @access  Private/Admin
exports.createFlag = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    const flag = await Flag.create({
      name,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      data: flag,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a flag
// @route   DELETE /api/flags/:id
// @access  Private/Admin
exports.deleteFlag = async (req, res) => {
  try {
    const flag = await Flag.findById(req.params.id);
    if (!flag) {
      return res.status(404).json({
        success: false,
        message: "Flag not found",
      });
    }

    await flag.deleteOne();

    res.status(200).json({
      success: true,
      message: "Flag deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
