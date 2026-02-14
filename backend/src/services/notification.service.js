const prisma = require("../prisma");

exports.listByUser = async (userId, { page = 1, limit = 20 } = {}) => {
  const [items, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.notification.count({ where: { userId } }),
  ]);

  const unreadCount = await prisma.notification.count({ where: { userId, read: false } });

  return { items, total, unreadCount, page: Number(page) };
};

exports.markAsRead = async (id, userId) => {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { read: true },
  });
};

exports.markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
};

exports.create = async (data) => {
  return prisma.notification.create({ data });
};
