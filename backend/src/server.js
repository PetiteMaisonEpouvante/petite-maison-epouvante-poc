const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const prisma = require("./prisma");

const authRoutes = require("./routes/auth.routes");
const listingRoutes = require("./routes/listing.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const notificationRoutes = require("./routes/notification.routes");
const conversationRoutes = require("./routes/conversation.routes");
const reportRoutes = require("./routes/report.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    const allowed = (process.env.CORS_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);

    // Pas d'origin (curl, healthcheck) => OK
    if (!origin) return cb(null, true);

    if (allowed.length === 0) return cb(null, true); // fallback dev
    if (allowed.includes(origin)) return cb(null, true);

    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));
app.use(express.json());

// Health check
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ status: "ko", error: String(e) });
  }
});

// Public greeting
app.get("/hello", (_req, res) => res.json({ message: "Hello Epouvante" }));

// API routes
app.use("/auth", authRoutes);
app.use("/listings", listingRoutes);
app.use("/wishlists", wishlistRoutes);
app.use("/notifications", notificationRoutes);
app.use("/conversations", conversationRoutes);
app.use("/reports", reportRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);

module.exports = { app };
