const notificationService = require("../services/notification.service");

exports.list = async (req, res) => {
  try {
    const result = await notificationService.listByUser(req.user.id, req.query);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await notificationService.markAsRead(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
