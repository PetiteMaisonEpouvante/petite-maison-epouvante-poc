const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { auth } = require("express-oauth2-jwt-bearer");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ status: "ko", error: String(e) });
  }
});

app.get("/hello", (_req, res) => res.json({ message: "Hello Epouvante 👻" }));

// Auth0 JWT middleware (API)
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

app.get("/me", jwtCheck, (req, res) => {
  res.json({ sub: req.auth?.payload?.sub, payload: req.auth?.payload });
});

// DB demo endpoint (protected)
app.post("/items", jwtCheck, async (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ error: "title required" });

  const item = await prisma.item.create({ data: { title } });
  res.json(item);
});

module.exports = { app };
