const reportService = require("../services/report.service");
const listingService = require("../services/listing.service");
const userService = require("../services/user.service");

exports.listReports = async (req, res) => {
  try {
    const result = await reportService.listAll(req.query);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.reviewReport = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["REVIEWED", "DISMISSED"].includes(status)) {
      return res.status(400).json({ error: "status must be REVIEWED or DISMISSED" });
    }
    const report = await reportService.review(req.params.id, status);
    res.json(report);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["ACTIVE", "SUSPENDED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const listing = await listingService.updateStatus(req.params.id, status);
    res.json(listing);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["USER", "MODERATOR", "ADMIN"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const user = await userService.updateRole(req.params.id, role);
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await userService.listAll();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
