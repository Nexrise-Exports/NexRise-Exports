const express = require("express");
const router = express.Router();
const { getTestimonials, createTestimonial, deleteTestimonial } = require("../controllers/testimonialController");
const { protect } = require("../middleware/auth");

router.route("/")
  .get(getTestimonials)
  .post(protect, createTestimonial);

router.route("/:id")
  .delete(protect, deleteTestimonial);

module.exports = router;
