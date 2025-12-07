const Marks = require("../models/Marks");
const Student = require("../models/Student");

function calculateGrade(marks) {
  if (marks >= 90) return "A";
  if (marks >= 80) return "B";
  if (marks >= 70) return "C";
  if (marks >= 60) return "D";
  return "F";
}

exports.getMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // If studentId is "me", get the current user's student ID
    let targetStudentId = studentId;
    if (studentId === "me") {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      targetStudentId = student._id;
    }

    const marks = await Marks.find({ studentId: targetStudentId }).populate("courseId");
    res.json(marks);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addMarks = async (req, res) => {
  try {
    const { studentId, courseId, marks } = req.body;

    if (!studentId || !courseId || marks === undefined || marks === null) {
      return res
        .status(400)
        .json({ message: "Student ID, Course ID, and Marks are required" });
    }

    if (marks < 0 || marks > 100) {
      return res
        .status(400)
        .json({ message: "Marks must be between 0 and 100" });
    }

    const grade = calculateGrade(marks);

    const data = await Marks.create({ studentId, courseId, marks, grade });
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};
