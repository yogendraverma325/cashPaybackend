import { rateLimit } from 'express-rate-limit'
import respHelper from '../helper/respHelper.js'


const limiter = rateLimit({
	windowMs: process.env.WINDOW_MS * 60 * 1000, // 2 minutes
	limit: process.env.REQUEST_LIMIT, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7',
	legacyHeaders: false,
    handler: (req, res) => {
        return respHelper(res, {
            status: 429
        });
      }
})



export default {
    limiter:limiter
}