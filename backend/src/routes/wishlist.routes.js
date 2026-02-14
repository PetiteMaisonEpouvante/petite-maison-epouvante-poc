const { Router } = require("express");
const { jwtCheck } = require("../middleware/auth");
const { resolveUser } = require("../middleware/resolveUser");
const ctrl = require("../controllers/wishlist.controller");

const router = Router();

router.get("/", jwtCheck, resolveUser, ctrl.list);
router.post("/", jwtCheck, resolveUser, ctrl.create);
router.delete("/:id", jwtCheck, resolveUser, ctrl.remove);

module.exports = router;
