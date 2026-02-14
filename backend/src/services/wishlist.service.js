const prisma = require("../prisma");

exports.list = async (userId) => {
  return prisma.wishlist.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

exports.create = async (userId, data) => {
  return prisma.wishlist.create({
    data: { title: data.title, category: data.category, userId },
  });
};

exports.remove = async (id, userId) => {
  const item = await prisma.wishlist.findUnique({ where: { id } });
  if (!item || item.userId !== userId) return null;
  await prisma.wishlist.delete({ where: { id } });
  return true;
};
