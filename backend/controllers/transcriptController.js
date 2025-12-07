const Student = require("../models/Student");
const Marks = require("../models/Marks");
const Attendance = require("../models/Attendance");
const { calculateGPA } = require("../utils/gpa");
const generateTranscriptPDF = require("../utils/pdfGenerator");

exports.getTranscript = async (req, res) => {
  try {
    const { studentId } = req.params;

    // 1. Get student info
    const student = await Student.findById(studentId).populate("courses");
    if (!student) return res.status(404).json({ message: "Student not found" });

    // 2. Get marks with course details
    const marks = await Marks.find({ studentId }).populate("courseId");

    // 3. Calculate GPA
    const gpa = calculateGPA(marks);

    // 4. Attendance percentage
    const total = await Attendance.countDocuments({ studentId });
    const present = await Attendance.countDocuments({
      studentId,
      status: "present",
    });
    const attendancePct =
      total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    // FINAL TRANSCRIPT RESPONSE
    const transcript = {
      studentDetails: {
        name: student.name,
        roll: student.roll,
        department: student.department,
      },
      courses: student.courses,
      marks: marks
        .filter((m) => m.courseId) // Filter out marks with deleted courses
        .map((m) => ({
          course: m.courseId.courseName,
          courseCode: m.courseId.courseCode,
          credits: m.courseId.credits,
          marks: m.marks,
          grade: m.grade,
        })),
      gpa,
      attendancePercentage: attendancePct,
    };

    res.json(transcript);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.downloadTranscript = async (req, res) => {
  try {
    const { studentId } = req.params;

    // --- Reuse logic from getTranscript here ---
    const student = await Student.findById(studentId).populate("courses");
    if (!student) return res.status(404).json({ message: "Student not found" });

    const marks = await Marks.find({ studentId }).populate("courseId");

    const gpa = calculateGPA(marks);

    const total = await Attendance.countDocuments({ studentId });
    const present = await Attendance.countDocuments({
      studentId,
      status: "present",
    });
    const attendancePct =
      total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    const transcript = {
      studentDetails: {
        name: student.name,
        roll: student.roll,
        department: student.department,
      },
      marks: marks
        .filter((m) => m.courseId) // Filter out marks with deleted courses
        .map((m) => ({
          course: m.courseId.courseName,
          courseCode: m.courseId.courseCode,
          credits: m.courseId.credits,
          marks: m.marks,
          grade: m.grade,
        })),
      gpa,
      attendancePercentage: attendancePct,
    };

    // Generate & send PDF
    generateTranscriptPDF(transcript, res);
  } catch (err) {
    res.status(500).json(err);
  }
};
