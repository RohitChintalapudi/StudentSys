const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  marks: Number,
  grade: String,
});

module.exports = mongoose.model("Marks", MarksSchema);
