const express = require("express");
const router = express.Router();
const {
  createDocumentation,
  getAllDocumentation,
  getDocumentationById,
  updateDocumentation,
  deleteDocumentation,
} = require("../controllers/documentationController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getAllDocumentation);
router.get("/:id", getDocumentationById);

// Protected routes (admin only)
router.post("/", protect, createDocumentation);
router.put("/:id", protect, updateDocumentation);
router.delete("/:id", protect, deleteDocumentation);

module.exports = router;

