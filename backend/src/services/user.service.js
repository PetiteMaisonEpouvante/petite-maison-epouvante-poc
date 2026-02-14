const prisma = require("../prisma");

exports.upsertFromAuth0 = async (auth0Sub, { email, nickname, avatar }) => {
  return prisma.user.upsert({
    where: { auth0Sub },
    update: { email, nickname, avatar },
    create: { auth0Sub, email, nickname, avatar },
  });
};

exports.findBySub = async (auth0Sub) => {
  return prisma.user.findUnique({ where: { auth0Sub } });
};

exports.findById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

exports.updateRole = async (id, role) => {
  return prisma.user.update({ where: { id }, data: { role } });
};

exports.listAll = async () => {
  return prisma.user.findMany({
    select: { id: true, email: true, nickname: true, avatar: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
};
