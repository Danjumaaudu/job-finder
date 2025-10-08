import { chromium } from "playwright";
import { job } from "../types/Jobs";
import { WeWorkRemotelyModel } from "../models/weworkremotelyModels";
import { connectDB } from "../config/db";

(async () => {
  await connectDB();
  await FetchWWR();
})();

export async function FetchWWR(): Promise<job[]> {
  const browser = await chromium.launch({ headless: true }); // slowMo helps visually debug
  const page = await browser.newPage();
  const url = "https://weworkremotely.com/remote-jobs";

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 }); // wait for all network calls to finish

  // Give the page some breathing room to fully render JS content
  await page.waitForTimeout(5000);

  // Check what’s actually being rendered
  const html = await page.content();
  if (!html.includes("new-listing-container")) {
    console.log("❌ No job list found. The page might be loading dynamically.");
  }

  // Now select the jobs
  const jobs: job[] = await page.$$eval(
    "li.new-listing-container.feature",
    (items) =>
      items.map((item) => {
        const link = item.querySelector("a")?.getAttribute("href") || "";
        const title =
          item
            .querySelector("h3.new-listing__header__title")
            ?.textContent?.trim() || "Unknown";
        const company =
          item
            .querySelector("p.new-listing__company-name")
            ?.textContent?.trim() || "Unknown";

        return {
          id: `wwr:${link.split("/").pop() || encodeURIComponent(link)}`,
          title,
          company,
          link: `https://weworkremotely.com${link}`,
          source: "WeWorkRemotely",
        };
      })
  );
  for (const job of jobs) {
    await WeWorkRemotelyModel.updateOne({ id: job.id }, job, { upsert: true });
  }
  console.log(`✅ Scraped ${jobs.length} jobs from WeWorkRemotely`);
  console.log(jobs.slice(0, 3)); // Preview first few jobs

  await browser.close();
  return jobs;
}

export async function getRecentWWRJobs(limit = 10) {
  return await WeWorkRemotelyModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
