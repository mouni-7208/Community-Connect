import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/projects.js";   // ✅ our new DynamoDB routes
import authRoutes from "./routes/auth.js";          // ✅ NEW: Auth routes for Register/Login

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://community-connect-frontend-01.s3-website.eu-north-1.amazonaws.com',
    'http://community-connect-frontend-01.s3-website.eu-north-1.amazonaws.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);   // ✅ must add this line

// AWS DynamoDB connection confirmation
//console.log("✅ Connected to AWS DynamoDB (via SDK)");

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Community Connect Backend (AWS Native) running fine!",
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Test API: http://localhost:${PORT}/api/test`);
});
