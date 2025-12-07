const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

connectDB();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// API Routes (must come before static files)
app.use("/auth", require("./routes/authRoutes"));
app.use("/courses", require("./routes/courseRoutes"));
app.use("/students", require("./routes/studentRoutes"));
app.use("/marks", require("./routes/marksRoutes"));
app.use("/attendance", require("./routes/attendanceRoutes"));
app.use("/notices", require("./routes/noticeRoutes"));
app.use("/transcript", require("./routes/transcriptRoutes"));

// Serve static files from frontend directory (after API routes)
app.use(express.static(path.join(__dirname, "../frontend")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/auth/login`);
});
