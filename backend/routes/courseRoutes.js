const router = require("express").Router();
const auth = require("../middleware/auth");
const { addCourse, getCourses } = require("../controllers/courseController");

router.post("/add", auth, addCourse);
router.get("/", auth, getCourses);

module.exports = router;
