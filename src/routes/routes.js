import express from 'express'
import adminRoutes from '../api/v1/admin/admin.route.js'
import authRoutes from '../api/v1/auth/auth.routes.js';
import masterRoutes from '../api/v1/master/master.routes.js';
import mappingRoutes from '../api/v1/mapping/mapping.routes.js';
import userRoutes from '../api/v1/user/user.routes.js';
import authentication from '../middleware/authentication.js';
import paymentRoutes from '../api/v1/payments/payment.routes.js';
import masterExportRoutes from '../api/v1/master/export.routes.js'

const router = express.Router()

router.use("/export", masterExportRoutes)
router.use('/admin', authentication.authenticate, adminRoutes)
router.use("/auth", authRoutes)
router.use("/master", authentication.authenticate, masterRoutes)
router.use("/mapping", mappingRoutes)
router.use("/user", userRoutes)
router.use("/payment", paymentRoutes)



export default router