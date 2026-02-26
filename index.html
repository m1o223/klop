import cron from "node-cron";
import { getActiveReminders } from "./reminderService.js";
import { sendPushNotification } from "./notificationService.js";
import { db } from "../config/firebase.js";

export function startReminderScheduler() {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    const reminders = await getActiveReminders();

    for (const reminder of reminders) {
      if (reminder.time === currentTime) {
        const userDoc = await db.collection("users").doc(reminder.uid).get();
        const user = userDoc.data();

        if (user?.fcmToken) {
          await sendPushNotification(
            user.fcmToken,
            "تذكير 📌",
            `لا تنسى ${reminder.title}`
          );
        }
      }
    }
  });
}