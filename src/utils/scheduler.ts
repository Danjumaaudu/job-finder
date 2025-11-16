import cron from "node-cron";
import { summarizeJob } from "../gemini";
import { Fetchjobs } from "../services/job-services";
import { filterJobWithGemini } from "../gemini";
import { isNewJob } from "../store/job-store";
import { sendToTelegram } from "../services/telegram";
export function startScheduler() {
  cron.schedule("*/10 * * * *", async () => {
    console.log("Running job fetcher");
    const jobs = await Fetchjobs();
    for (const job of jobs) {
      const fresh = isNewJob(job.id);
      if (!fresh) continue; 
       const userPrefs = { role: "frontend", level: "junior", remote: true };
       const match = await filterJobWithGemini(job, userPrefs);

    if (!match) continue;
     const summary = await summarizeJob(job);

        await sendToTelegram({
          title: job.title,
          company: job.company,
          summary,
          link: job.link ?? "No link available",
        });
      
    }
  });
}
