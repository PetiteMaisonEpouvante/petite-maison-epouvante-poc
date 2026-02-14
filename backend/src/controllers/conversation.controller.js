const conversationService = require("../services/conversation.service");
const messageService = require("../services/message.service");

exports.list = async (req, res) => {
  try {
    const conversations = await conversationService.listByUser(req.user.id);
    res.json(conversations);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.create = async (req, res) => {
  try {
    const { listingId } = req.body;
    if (!listingId) return res.status(400).json({ error: "listingId required" });
    const conversation = await conversationService.findOrCreate(listingId, req.user.id);
    res.status(201).json(conversation);
  } catch (e) {
    if (e.message === "Listing not found") return res.status(404).json({ error: e.message });
    res.status(500).json({ error: String(e) });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const result = await messageService.listByConversation(req.params.id, req.user.id, req.query);
    res.json(result);
  } catch (e) {
    if (e.message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
    res.status(500).json({ error: String(e) });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: "content required" });
    const message = await messageService.create(req.params.id, req.user.id, content.trim());
    res.status(201).json(message);
  } catch (e) {
    if (e.message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
    res.status(500).json({ error: String(e) });
  }
};
