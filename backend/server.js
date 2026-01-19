const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./connections/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000","http://localhost:3001", process.env.FRONTEND_URL, process.env.NEXT_PUBLIC_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/gemini", require("./routes/geminiRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/enquiries", require("./routes/enquiryRoutes"));
app.use("/api/documentation", require("./routes/documentationRoutes"));
app.use("/api/faqs", require("./routes/faqRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/flags", require("./routes/flagRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
