const Course = require("../models/Course");

exports.addCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.json(course);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getCourses = async (req, res) => {
  try {
    const data = await Course.find();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};
