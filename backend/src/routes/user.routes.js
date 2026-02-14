const { Router } = require("express");
const { jwtCheck } = require("../middleware/auth");
const { resolveUser } = require("../middleware/resolveUser");
const ctrl = require("../controllers/user.controller");

const router = Router();

router.get("/interests", jwtCheck, resolveUser, ctrl.getInterests);
router.put("/interests", jwtCheck, resolveUser, ctrl.setInterests);

module.exports = router;
