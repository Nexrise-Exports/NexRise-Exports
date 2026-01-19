const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
  },
  type: {
    type: String,
    enum: ["general", "product", "supplier", "buyer"],
    default: "general",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: null,
  },
  productName: {
    type: String,
    default: null,
  },
  // Supplier and Buyer fields
  company: {
    type: String,
    trim: true,
  },
  companyWebsite: {
    type: String,
    trim: true,
  },
  certifications: {
    type: String,
    trim: true,
  },
  categories: {
    type: [String],
    default: [],
  },
  yearsInBusiness: {
    type: String,
    trim: true,
  },
  anticipatedVolume: {
    type: String,
    trim: true,
  },
  distributionModel: {
    type: [String],
    default: [],
  },
  productsOfInterest: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ["pending", "read", "replied", "closed"],
    default: "pending",
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
enquirySchema.pre("save", function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Enquiry", enquirySchema);
