const Student = require("../models/Student");

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("courses");
    res.json(students);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getStudentInfo = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).populate("courses");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getStudentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Find all students enrolled in this course
    const students = await Student.find({ courses: courseId })
      .select("name roll department _id")
      .sort({ name: 1 });

    res.json(students);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { courses: courseId } },
      { new: true }
    );

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json(err);
  }
};
