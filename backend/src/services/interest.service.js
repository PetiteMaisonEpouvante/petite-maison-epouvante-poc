const prisma = require("../prisma");

exports.getByUser = async (userId) => {
  return prisma.userInterest.findMany({ where: { userId } });
};

exports.setForUser = async (userId, categories) => {
  // Remove all existing interests and replace
  await prisma.userInterest.deleteMany({ where: { userId } });

  if (categories.length === 0) return [];

  await prisma.userInterest.createMany({
    data: categories.map((category) => ({ userId, category })),
  });

  return prisma.userInterest.findMany({ where: { userId } });
};
