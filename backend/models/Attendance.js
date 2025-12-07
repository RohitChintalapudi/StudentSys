const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  date: String,
  status: { type: String, enum: ["present", "absent"] },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
