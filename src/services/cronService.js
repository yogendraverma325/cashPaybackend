import cron from 'node-cron'
import cronController from '../api/v1/cron/cron.controller.js';

//To mark the attendance  
// cron.schedule("* * * * *", async () => {
// await cronController.updateAttendance()
// });

//If user is inactive this cron will 
cron.schedule("* * * * *", async () => {
    cronController.updateActiveStatus()
});

export default cron