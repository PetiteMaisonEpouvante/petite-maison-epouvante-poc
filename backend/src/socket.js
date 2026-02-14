const { Server } = require("socket.io");
const { authenticateSocket } = require("./middleware/socketAuth");
const messageService = require("./services/message.service");

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    console.log(`Socket connected: ${userId}`);

    // Join personal room for notifications
    socket.join(`user:${userId}`);

    // Chat: join a conversation room
    socket.on("chat:join", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    // Chat: send a message
    socket.on("chat:message", async ({ conversationId, content }) => {
      try {
        const message = await messageService.create(conversationId, userId, content);
        io.to(`conversation:${conversationId}`).emit("chat:message", message);
      } catch (e) {
        socket.emit("chat:error", { error: e.message });
      }
    });

    // Chat: leave a conversation room
    socket.on("chat:leave", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${userId}`);
    });
  });
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };
