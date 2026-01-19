const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  propertyTitle: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  subcategory: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  origin: {
    type: String,
    required: [true, "Origin is required"],
    trim: true,
  },
  biologicalBackground: {
    type: String,
    required: [true, "Biological background is required"],
    trim: true,
  },
  usage: {
    type: String,
    required: [true, "Usage is required"],
    trim: true,
  },
  keyCharacteristics: {
    type: String,
    required: [true, "Key characteristics is required"],
    trim: true,
  },
  displayPhoto: {
    type: String,
    required: [true, "Display photo is required"],
  },
  additionalPhotos: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp before saving
productSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Product", productSchema);
