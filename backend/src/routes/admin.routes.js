const { Router } = require("express");
const { jwtCheck } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");
const ctrl = require("../controllers/admin.controller");

const router = Router();

router.use(jwtCheck);
router.use(requireRole("ADMIN", "MODERATOR"));

router.get("/reports", ctrl.listReports);
router.patch("/reports/:id", ctrl.reviewReport);
router.patch("/listings/:id/status", ctrl.updateListingStatus);
router.get("/users", ctrl.listUsers);
router.patch("/users/:id/role", requireRole("ADMIN"), ctrl.updateUserRole);

module.exports = router;
