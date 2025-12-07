const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  roll: String,
  department: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

module.exports = mongoose.model("Student", StudentSchema);
