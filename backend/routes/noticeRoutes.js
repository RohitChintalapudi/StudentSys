const router = require("express").Router();
const auth = require("../middleware/auth");
const { addNotice, getNotices } = require("../controllers/noticeController");

// STAFF: Create notice
router.post("/add", auth, addNotice);

// STUDENTS + STAFF: View notices
router.get("/", auth, getNotices);

module.exports = router;
