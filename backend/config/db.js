const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://roy:1234@cluster0.obfm1cr.mongodb.net/?appName=Cluster0"
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    console.error("Please check your MongoDB connection string");
    // Don't exit - allow server to start even if DB fails (for testing)
    // process.exit(1);
  }
};

module.exports = connectDB;
