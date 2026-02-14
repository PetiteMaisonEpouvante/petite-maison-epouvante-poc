const reportService = require("../services/report.service");

exports.create = async (req, res) => {
  try {
    const { reason, details, targetType, listingId, messageId } = req.body;
    if (!reason || !targetType) {
      return res.status(400).json({ error: "reason and targetType required" });
    }
    const report = await reportService.create(req.user.id, {
      reason,
      details,
      targetType,
      listingId,
      messageId,
    });
    res.status(201).json(report);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
