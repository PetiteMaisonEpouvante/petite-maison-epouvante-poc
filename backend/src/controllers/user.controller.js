const interestService = require("../services/interest.service");

exports.getInterests = async (req, res) => {
  try {
    const interests = await interestService.getByUser(req.user.id);
    res.json(interests);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.setInterests = async (req, res) => {
  try {
    const { categories } = req.body;
    if (!Array.isArray(categories)) {
      return res.status(400).json({ error: "categories must be an array" });
    }
    const interests = await interestService.setForUser(req.user.id, categories);
    res.json(interests);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
