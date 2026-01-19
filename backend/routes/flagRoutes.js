const express = require("express");
const router = express.Router();
const { getFlags, createFlag, deleteFlag } = require("../controllers/flagController");
const { protect } = require("../middleware/auth");

router.route("/")
  .get(getFlags)
  .post(protect, createFlag);

router.route("/:id")
  .delete(protect, deleteFlag);

module.exports = router;
