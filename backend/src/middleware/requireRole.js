const prisma = require("../prisma");

function requireRole(...roles) {
  return async (req, res, next) => {
    const sub = req.auth?.payload?.sub;
    if (!sub) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { auth0Sub: sub } });
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = user;
    next();
  };
}

module.exports = { requireRole };
