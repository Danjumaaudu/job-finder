import cron from "node-cron";
import bot from "../telegram-bot";
import { Fetchjobs } from "../services/job-services";
import { Subscriber } from "../models/subscribers";
import { isNewJob } from "../store/job-store";
import { sendToTelegram } from "../services/telegram";
export function startScheduler() {
  cron.schedule(" */10 * * * *", async () => {
    console.log("Running job fetcher");
    const jobs = await Fetchjobs();
    for (const job of jobs) {
      const fresh = isNewJob(job.id);
      if (fresh) {
        await sendToTelegram({
          title: job.title,
          company: job.company,
          link: job.link ?? "No link available",
        });
      }
    }
  });
}
