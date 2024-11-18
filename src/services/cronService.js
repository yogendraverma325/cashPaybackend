import cron from "node-cron";
import cronController from "../api/v1/cron/cron.controller.js";
import attendanceController from "../api/v1/attendance/attendance.controller.js";

cron.schedule("30 1 * * *", async () => {
  await attendanceController.attedanceCron();
});

cron.schedule("* * * * *", async () => {
  await cronController.updateManager();
  await cronController.updatePolicy();
});

cron.schedule("* * * * *", async () => {
  cronController.updateActiveStatus();
});

cron.schedule("50 7 * * *", async () => {
  console.log("cron is running in very seconds");
  // cronController.EarnedLeaveCreditCron();
});

cron.schedule("0 0 * * *", async () => {
  await cronController.blockAccess()
});

cron.schedule("* 10,11 * * *", async () => {
  cronController.newJoinEmployee();
});

cron.schedule("0 7 * * *", async () => {
  await cronController.prePasswordExpiryNotification()
  await cronController.postPasswordExpiryNotification()
})

export default cron;
