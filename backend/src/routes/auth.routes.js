const { Router } = require("express");
const { jwtCheck } = require("../middleware/auth");
const ctrl = require("../controllers/auth.controller");

const router = Router();

router.get("/me", jwtCheck, ctrl.getMe);
router.post("/sync", jwtCheck, ctrl.sync);

module.exports = router;
