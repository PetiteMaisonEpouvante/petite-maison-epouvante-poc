const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");

const jwksClient = jwksRsa({
  jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
});

function getKey(header, callback) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

async function authenticateSocket(socket, next) {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));

  jwt.verify(
    token,
    getKey,
    {
      audience: process.env.AUTH0_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
      algorithms: ["RS256"],
    },
    async (err, decoded) => {
      if (err) return next(new Error("Invalid token"));

      const prisma = require("../prisma");
      const user = await prisma.user.findUnique({
        where: { auth0Sub: decoded.sub },
      });

      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    }
  );
}

module.exports = { authenticateSocket };
