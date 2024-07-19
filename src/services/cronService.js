import cron from 'node-cron'
import cronController from '../api/v1/cron/cron.controller.js';
import attendanceController from "../api/v1/attendance/attendance.controller.js"

//To mark the attendance  
// cron.schedule("* * * * *", async () => {
// await cronController.updateAttendance()
// });

//If user is inactive this cron will 

cron.schedule("30 7 * * *", async () => {
await attendanceController.attedanceCron();
});

cron.schedule("* * * * *", async () => {
    cronController.updateActiveStatus()
});

// cron.schedule("* * * * *", async () => {
//     cronController.EarnedLeaveCreditCron()
// });


export default cron