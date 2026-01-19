const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getMe,
  logout,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
} = require("../controllers/authController");
const { protect, superadmin } = require("../middleware/auth");

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

// Superadmin only routes
router.post("/create-admin", protect, superadmin, createAdmin);
router.get("/admins", protect, superadmin, getAllAdmins);
router.delete("/admins/:id", protect, superadmin, deleteAdmin);

module.exports = router;
