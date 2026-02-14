const { Router } = require("express");
const { jwtCheck } = require("../middleware/auth");
const { resolveUser } = require("../middleware/resolveUser");
const ctrl = require("../controllers/notification.controller");

const router = Router();

router.get("/", jwtCheck, resolveUser, ctrl.list);
router.patch("/:id/read", jwtCheck, resolveUser, ctrl.markAsRead);
router.patch("/read-all", jwtCheck, resolveUser, ctrl.markAllAsRead);

module.exports = router;
