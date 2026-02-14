const wishlistService = require("../services/wishlist.service");

exports.list = async (req, res) => {
  try {
    const items = await wishlistService.list(req.user.id);
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) return res.status(400).json({ error: "title and category required" });
    const item = await wishlistService.create(req.user.id, { title, category });
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await wishlistService.remove(req.params.id, req.user.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
