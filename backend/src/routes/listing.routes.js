const { Router } = require("express");
const { jwtCheck } = require("../middleware/auth");
const { resolveUser } = require("../middleware/resolveUser");
const ctrl = require("../controllers/listing.controller");

const router = Router();

router.get("/", ctrl.list);
router.get("/mine", jwtCheck, resolveUser, ctrl.getMyListings);
router.get("/:id", ctrl.getById);
router.post("/", jwtCheck, resolveUser, ctrl.create);
router.put("/:id", jwtCheck, resolveUser, ctrl.update);
router.delete("/:id", jwtCheck, resolveUser, ctrl.remove);

module.exports = router;
