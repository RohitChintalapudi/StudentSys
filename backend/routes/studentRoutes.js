const router = require("express").Router();
const auth = require("../middleware/auth");
const { enrollCourse, getStudents, getStudentInfo, getStudentsByCourse } = require("../controllers/studentController");

router.get("/list", auth, getStudents);
router.get("/me", auth, getStudentInfo);
router.get("/course/:courseId", auth, getStudentsByCourse);
router.post("/enroll", auth, enrollCourse);

module.exports = router;
