const Notice = require("../models/Notice");

// STAFF: Add Notice
exports.addNotice = async (req, res) => {
  try {
    const { title, message } = req.body;

    const notice = await Notice.create({
      title,
      message,
      createdBy: req.user.id,
    });

    res.json(notice);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ALL: Get all notices
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json(err);
  }
};
