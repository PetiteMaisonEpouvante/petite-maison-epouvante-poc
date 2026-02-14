const prisma = require("../prisma");

exports.listByConversation = async (conversationId, userId, { page = 1, limit = 50 } = {}) => {
  // Verify user is participant
  const participant = await prisma.conversationParticipant.findFirst({
    where: { conversationId, userId },
  });
  if (!participant) throw new Error("FORBIDDEN");

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, nickname: true, avatar: true } } },
      orderBy: { createdAt: "asc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.message.count({ where: { conversationId } }),
  ]);

  return { messages, total, page: Number(page) };
};

exports.create = async (conversationId, senderId, content) => {
  // Verify sender is participant
  const participant = await prisma.conversationParticipant.findFirst({
    where: { conversationId, userId: senderId },
  });
  if (!participant) throw new Error("FORBIDDEN");

  const message = await prisma.message.create({
    data: { conversationId, senderId, content },
    include: { sender: { select: { id: true, nickname: true, avatar: true } } },
  });

  // Update conversation timestamp
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
};
