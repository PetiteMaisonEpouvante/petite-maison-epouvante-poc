const prisma = require("../prisma");

exports.list = async ({ category, type, search, page = 1, limit = 20 }) => {
  const where = { status: "ACTIVE" };
  if (category) where.category = category;
  if (type) where.type = type;
  if (search) where.title = { contains: search, mode: "insensitive" };

  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { user: { select: { id: true, nickname: true, avatar: true } } },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.listing.count({ where }),
  ]);

  return { items, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
};

exports.getById = async (id) => {
  return prisma.listing.findUnique({
    where: { id },
    include: { user: { select: { id: true, nickname: true, avatar: true, email: true } } },
  });
};

exports.create = async (userId, data) => {
  const listing = await prisma.listing.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      condition: data.condition,
      type: data.type,
      images: data.images || [],
      status: "ACTIVE",
      userId,
    },
    include: { user: { select: { id: true, nickname: true, avatar: true } } },
  });

  // Notify users interested in this category
  const interested = await prisma.userInterest.findMany({
    where: { category: listing.category, userId: { not: userId } },
  });

  const notifications = interested.map((interest) => ({
    userId: interest.userId,
    title: "Nouvel article dans vos centres d'interet !",
    body: `"${listing.title}" en ${listing.category}`,
    link: `/listings/${listing.id}`,
  }));

  if (notifications.length > 0) {
    await prisma.notification.createMany({ data: notifications });
  }

  return { listing, notifiedUserIds: interested.map((i) => i.userId) };
};

exports.update = async (id, userId, data) => {
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return null;
  if (existing.userId !== userId) throw new Error("FORBIDDEN");

  return prisma.listing.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      condition: data.condition,
      type: data.type,
      images: data.images,
    },
    include: { user: { select: { id: true, nickname: true, avatar: true } } },
  });
};

exports.remove = async (id, userId) => {
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return null;
  if (existing.userId !== userId) throw new Error("FORBIDDEN");

  await prisma.$transaction(async (tx) => {
    const convs = await tx.conversation.findMany({
      where: { listingId: id },
      select: { id: true },
    });

    const convIds = convs.map(c => c.id);

    if (convIds.length) {
      await tx.report.updateMany({
        where: { messageId: { in: (await tx.message.findMany({
          where: { conversationId: { in: convIds } },
          select: { id: true }
        })).map(m => m.id) } },
        data: { messageId: null },
      });

      await tx.message.deleteMany({ where: { conversationId: { in: convIds } } });
      await tx.conversationParticipant.deleteMany({ where: { conversationId: { in: convIds } } });
      await tx.conversation.deleteMany({ where: { id: { in: convIds } } });
    }

    // reports sur listing sont déjà ON DELETE SET NULL → ok
    await tx.listing.delete({ where: { id } });
  });

  return true;
};


exports.getByUser = async (userId) => {
  return prisma.listing.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

exports.updateStatus = async (id, status) => {
  return prisma.listing.update({
    where: { id },
    data: { status },
  });
};
