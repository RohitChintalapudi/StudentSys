const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  markAttendance,
  getAttendance,
  getAttendancePercentage,
} = require("../controllers/attendanceController");

// STAFF marks attendance
router.post("/mark", auth, markAttendance);

// Attendance percentage (must come before /:studentId to avoid route conflict)
router.get("/percentage/:studentId", auth, getAttendancePercentage);

// STAFF or STUDENT can view attendance
router.get("/:studentId", auth, getAttendance);

module.exports = router;
