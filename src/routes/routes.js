import express from "express";
import adminRoutes from "../api/v1/admin/admin.route.js";
import authRoutes from "../api/v1/auth/auth.routes.js";
import masterRoutes from "../api/v1/master/master.routes.js";
import mappingRoutes from "../api/v1/mapping/mapping.routes.js";
import userRoutes from "../api/v1/user/user.routes.js";
import authentication from "../middleware/authentication.js";
import paymentRoutes from "../api/v1/payments/payment.routes.js";
import attendanceRoutes from "../api/v1/attendance/attendance.routes.js";
import masterExportRoutes from "../api/v1/master/export.routes.js";
import rateLimit from "../middleware/rateLimit.js";
import commanRoutes from "../api/v1/common/comman.routes.js";
import leave from "../api/v1/leave/leave.routes.js";
import adminMasterRoutes from "../api/v1/admin/master/master.route.js";
import cronRoutes from "../api/v1/cron/cron.routes.js";

const router = express.Router();

router.use("/export", masterExportRoutes);
router.use("/admin", authentication.authenticate, adminRoutes);
router.use("/auth", authRoutes);
router.use(
  "/master",
  authentication.authenticate,
  rateLimit.limiter,
  masterRoutes
);
router.use("/mapping", mappingRoutes);
router.use("/user", userRoutes);
router.use("/payment", paymentRoutes);
router.use("/attendance", authentication.authenticate, attendanceRoutes);
router.use("/comman", authentication.authenticate, commanRoutes);
router.use("/leave", authentication.authenticate, leave);
router.use("/admin/master", authentication.authenticate, adminMasterRoutes);

router.use("/cron", cronRoutes)

export default router;
