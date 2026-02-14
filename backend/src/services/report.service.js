const prisma = require("../prisma");

exports.create = async (reporterId, data) => {
  return prisma.report.create({
    data: {
      reason: data.reason,
      details: data.details,
      targetType: data.targetType,
      reporterId,
      listingId: data.listingId || null,
      messageId: data.messageId || null,
    },
  });
};

exports.listAll = async ({ status, page = 1, limit = 20 } = {}) => {
  const where = {};
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        reporter: { select: { id: true, nickname: true, email: true } },
        listing: { select: { id: true, title: true, status: true, userId: true } },
        message: { select: { id: true, content: true, senderId: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.report.count({ where }),
  ]);

  return { items, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
};

exports.review = async (id, status) => {
  return prisma.report.update({ where: { id }, data: { status } });
};
