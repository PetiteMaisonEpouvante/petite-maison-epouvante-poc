const prisma = require("../prisma");

async function resolveUser(req, res, next) {
  const sub = req.auth?.payload?.sub;
  if (!sub) return res.status(401).json({ error: "Unauthorized" });

  const user = await prisma.user.findUnique({ where: { auth0Sub: sub } });
  if (!user) return res.status(404).json({ error: "User not found. Please sync your profile first." });

  req.user = user;
  next();
}

module.exports = { resolveUser };
