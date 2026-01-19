const express = require("express");
const router = express.Router();
const { getFaqs, createFaq, deleteFaq } = require("../controllers/faqController");

router.route("/").get(getFaqs).post(createFaq);
router.route("/:id").delete(deleteFaq);

module.exports = router;
