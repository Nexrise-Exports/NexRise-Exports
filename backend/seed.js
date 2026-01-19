const mongoose = require("mongoose");
const Category = require("./models/Category");
const dotenv = require("dotenv");

dotenv.config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "nexrise" });
    console.log("Connected to MongoDB Database: nexrise");

    const spiceCategory = {
      name: "Spice",
      subcategories: ["whole", "powder", "both"]
    };

    // Clear existing to avoid index issues with the new slug field
    await Category.deleteMany({ name: { $in: ["Spice", "Spices"] } });
    
    await Category.create(spiceCategory);
    console.log("Created 'Spice' category with subcategories: whole, powder, both");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
