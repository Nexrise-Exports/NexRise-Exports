const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getAllProducts); // Public access for frontend
router.get("/:id", getProductById); // Public access for frontend

// Protected routes (admin only)
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;

