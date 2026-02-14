const listingService = require("../services/listing.service");
const { getIO } = require("../socket");

exports.list = async (req, res) => {
  try {
    const result = await listingService.list(req.query);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.getById = async (req, res) => {
  try {
    const listing = await listingService.getById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Not found" });
    res.json(listing);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.create = async (req, res) => {
  try {
    const { listing, notifiedUserIds } = await listingService.create(req.user.id, req.body);

    // Send real-time notifications via Socket.io
    const io = getIO();
    if (io) {
      for (const uid of notifiedUserIds) {
        io.to(`user:${uid}`).emit("notification:new", {
          title: "Nouvel article dans vos centres d'interet !",
          body: `"${listing.title}" en ${listing.category}`,
          link: `/listings/${listing.id}`,
        });
      }
    }

    res.status(201).json(listing);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

exports.update = async (req, res) => {
  try {
    const listing = await listingService.update(req.params.id, req.user.id, req.body);
    if (!listing) return res.status(404).json({ error: "Not found" });
    res.json(listing);
  } catch (e) {
    if (e.message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
    res.status(500).json({ error: String(e) });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await listingService.remove(req.params.id, req.user.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (e) {
    if (e.message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
    res.status(500).json({ error: String(e) });
  }
};

exports.getMyListings = async (req, res) => {
  try {
    const listings = await listingService.getByUser(req.user.id);
    res.json(listings);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
