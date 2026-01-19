const express = require("express");
const router = express.Router();
const {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} = require("../controllers/enquiryController");
const { protect } = require("../middleware/auth");

// Public route
router.post("/", createEnquiry);

// Protected routes
router.get("/", protect, getAllEnquiries);
router.get("/:id", protect, getEnquiryById);
router.put("/:id", protect, updateEnquiry);
router.delete("/:id", protect, deleteEnquiry);

module.exports = router;
