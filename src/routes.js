import adminRoutes from './api/v1/admin/admin.route.js'
import authRoutes from './api/v1/auth/auth.routes.js';
import masterRoutes from './api/v1/master/master.routes.js';
import mappingRoutes from './api/v1/mapping/mapping.routes.js';
import userRoutes from './api/v1/user/user.routes.js';
import authentication from './middleware/authentication.js';

/**
 * @export
 * @param {any} app
 */
export default function routes(app) {
    app.use('/api/admin', authentication.authenticate, adminRoutes)
    app.use("/api/auth", authRoutes)
    app.use("/api/master", authentication.authenticate, masterRoutes)
    app.use("/api/mapping", mappingRoutes)
    app.use("/api/user", userRoutes)
    return app;
}