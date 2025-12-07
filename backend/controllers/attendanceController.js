const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// Mark attendance for a student
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    // avoid duplicate attendance for same date
    const exists = await Attendance.findOne({ studentId, date });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this date" });
    }

    const record = await Attendance.create({ studentId, date, status });
    res.json(record);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get attendance of a student
exports.getAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await Attendance.find({ studentId });
    res.json(records);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get attendance percentage
exports.getAttendancePercentage = async (req, res) => {
  try {
    const { studentId } = req.params;

    const total = await Attendance.countDocuments({ studentId });
    const present = await Attendance.countDocuments({
      studentId,
      status: "present",
    });

    const percentage = total === 0 ? 0 : (present / total) * 100;

    res.json({ percentage });
  } catch (err) {
    res.status(500).json(err);
  }
};
