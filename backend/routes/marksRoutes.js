const router = require("express").Router();
const auth = require("../middleware/auth");
const { addMarks, getMarks } = require("../controllers/marksController");

router.get("/:studentId", auth, getMarks);
router.post("/add", auth, addMarks);

module.exports = router;
