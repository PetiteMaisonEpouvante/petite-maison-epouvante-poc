const { Router } = require("express");
const { jwtCheck } = require("../middleware/auth");
const { resolveUser } = require("../middleware/resolveUser");
const ctrl = require("../controllers/report.controller");

const router = Router();

router.post("/", jwtCheck, resolveUser, ctrl.create);

module.exports = router;
