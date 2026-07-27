import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "../routes/project.js";
import authRoutes from "../routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://community-connect-frontend-01.s3-website.eu-north-1.amazonaws.com',
    'https://community-connect-frontend-01.s3-website.eu-north-1.amazonaws.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/test", (req, res) => {
  res.json({
    message: "Community Connect Backend (AWS Native) running fine!",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Test API: http://localhost:${PORT}/api/test`);
});
