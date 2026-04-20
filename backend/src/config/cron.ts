import cron from "node-cron";
import { purgeOldTrash } from "../services/albumService.js";

// Run daily at 2:00 AM — purge albums in trash for 30+ days
export const startCronJobs = () => {
    cron.schedule("0 2 * * *", async () => {
        console.log("[CRON] Running trash auto-purge...");
        try {
            const result = await purgeOldTrash();
            console.log(`[CRON] Purged ${result.purged} old albums from trash.`);
        } catch (error) {
            console.error("[CRON] Trash purge failed:", error);
        }
    });

    console.log("[CRON] Trash auto-purge scheduled (daily at 2:00 AM)");
};
