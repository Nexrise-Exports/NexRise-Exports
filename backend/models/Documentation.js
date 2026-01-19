const mongoose = require("mongoose");

const documentationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Image is required"],
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
documentationSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Documentation", documentationSchema);
