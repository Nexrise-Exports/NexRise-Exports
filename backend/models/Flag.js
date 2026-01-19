const mongoose = require("mongoose");

const flagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Country name is required"],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Flag", flagSchema);
