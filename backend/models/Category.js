const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  subcategories: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.pre("save", function() {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
  }
});

module.exports = mongoose.model("Category", categorySchema);
