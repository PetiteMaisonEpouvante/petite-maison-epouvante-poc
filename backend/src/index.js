require("dotenv").config();
const http = require("http");
const { app } = require("./server");
const { initSocket } = require("./socket");

const port = Number(process.env.PORT || 3000);
const server = http.createServer(app);

initSocket(server);

server.listen(port, () => console.log(`API listening on :${port}`));
