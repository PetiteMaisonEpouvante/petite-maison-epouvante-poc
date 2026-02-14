const prisma = require("../prisma");

exports.findOrCreate = async (listingId, userId) => {
  // Check if a conversation already exists between this user and the listing owner
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) throw new Error("Listing not found");

  const existing = await prisma.conversation.findFirst({
    where: {
      listingId,
      participants: {
        every: { userId: { in: [userId, listing.userId] } },
      },
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: listing.userId } } },
      ],
    },
    include: {
      participants: { include: { user: { select: { id: true, nickname: true, avatar: true } } } },
      listing: { select: { id: true, title: true } },
    },
  });

  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      listingId,
      participants: {
        createMany: {
          data: [{ userId }, { userId: listing.userId }],
        },
      },
    },
    include: {
      participants: { include: { user: { select: { id: true, nickname: true, avatar: true } } } },
      listing: { select: { id: true, title: true } },
    },
  });
};

exports.listByUser = async (userId) => {
  return prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      listing: { select: { id: true, title: true, images: true } },
      participants: { include: { user: { select: { id: true, nickname: true, avatar: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });
};

exports.getById = async (id, userId) => {
  const conv = await prisma.conversation.findUnique({
    where: { id },
    include: {
      participants: { include: { user: { select: { id: true, nickname: true, avatar: true } } } },
      listing: { select: { id: true, title: true } },
    },
  });

  if (!conv) return null;
  const isParticipant = conv.participants.some((p) => p.userId === userId);
  if (!isParticipant) return null;

  return conv;
};
