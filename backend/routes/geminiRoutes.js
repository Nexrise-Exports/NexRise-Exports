const express = require("express");
const router = express.Router();
const { generateProductDetails } = require("../controllers/geminiController");
const { protect } = require("../middleware/auth");

// Protected routes
router.post("/generate-product-details", protect, generateProductDetails);

module.exports = router;
