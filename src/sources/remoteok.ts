import { chromium } from "playwright";
import { job } from "../types/Jobs";
import { RemoteOkModel } from "../models/remote-okmodels";
import { connectDB } from "../config/db";
(async () => {
  await connectDB();
  await RemoteokScraper();
})();

export async function RemoteokScraper(): Promise<job[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://remoteok.com/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForSelector("tr.job");

  const jobs: job[] = await page.$$eval(
    "tr.job",
    (rows) =>
      rows
        .map((row) => {
          const title =
            row.querySelector("h2")?.textContent?.trim() || "Untitled";
          const company =
            row.querySelector(".companyLink")?.textContent?.trim() || "Unknown";
          const href =
            row.querySelector("a.preventLink")?.getAttribute("href") || "";
          if (!href) return null;
          const link = "https://remoteok.com" + href;
          const datePosted =
            row.querySelector("time")?.getAttribute("datetime") ||
            row.querySelector(".date")?.textContent?.trim() ||
            new Date().toISOString();

          return {
            id: `remoteok:${link.split("/").pop() || encodeURIComponent(link)}`,
            title,
            company,
            link,
            datePosted,
            source: "RemoteOK",
          };
        })
        .filter(Boolean) as job[]
  );
  for (const job of jobs) {
    await RemoteOkModel.updateOne({ id: job.id }, job, { upsert: true });
  }
  await browser.close();
  return jobs.slice(0, 20);
}
export async function getRecentRemoteOkJobs(limit = 10) {
  return await RemoteOkModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
