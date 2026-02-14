const { Router } = require("express");
const { jwtCheck } = require("../middleware/auth");
const { resolveUser } = require("../middleware/resolveUser");
const ctrl = require("../controllers/conversation.controller");

const router = Router();

router.get("/", jwtCheck, resolveUser, ctrl.list);
router.post("/", jwtCheck, resolveUser, ctrl.create);
router.get("/:id/messages", jwtCheck, resolveUser, ctrl.getMessages);
router.post("/:id/messages", jwtCheck, resolveUser, ctrl.sendMessage);

module.exports = router;
