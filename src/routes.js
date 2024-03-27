// import primaryRoute from './common/routes.js'
import adminRoutes from './api/v1/admin/admin.route.js'
import authRoutes from './api/v1/auth/auth.routes.js';
import masterRoutes from './api/v1/master/master.routes.js';

/**
 * @export
 * @param {any} app
 */
export default function routes(app) {
    app.use('/api/admin', adminRoutes)
    app.use("/api/auth", authRoutes)
    app.use("/api/master", masterRoutes)
    return app;
}