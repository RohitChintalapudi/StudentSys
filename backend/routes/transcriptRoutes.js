const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getTranscript,
  downloadTranscript,
} = require("../controllers/transcriptController");


// PDF download (must come before /:studentId to avoid route conflict)
router.get("/pdf/:studentId", auth, downloadTranscript);

// Student or staff can view transcript
router.get("/:studentId", auth, getTranscript);

module.exports = router;
