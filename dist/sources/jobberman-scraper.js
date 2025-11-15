"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobbermanScrapper = JobbermanScrapper;
exports.getRecentJobbermanJobs = getRecentJobbermanJobs;
const playwright_1 = require("playwright");
const jobberman_model_1 = require("../models/jobberman-model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function JobbermanScrapper(maxpages = 4) {
    const browser = await playwright_1.chromium.launch({ headless: true });
    const jobs = [];
    //loop through 4 pages searching for recent jobs
    for (let pageNum = 1; pageNum <= maxpages; pageNum++) {
        const url = pageNum === 1
            ? "https://www.jobberman.com/jobs"
            : `https://www.jobberman.com/jobs?page=${pageNum}`;
        const page = await browser.newPage();
        // block heavy resources
        await page.route("**/*", (route) => {
            return ["image", "font", "stylesheet"].includes(route.request().resourceType())
                ? route.abort()
                : route.continue();
        });
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
        //console.log(await page.content());
        // scroll to load more jobs (Jobberman lazy loads)
        await autoScroll(page);
        // wait for at least one job card
        await page.waitForSelector("a[href*='/listings/']");
        // extract job info from job card containers
        const jobLinks = await page.$$eval("a[href*='/listings/']", (cards) => cards.map((card) => card.href));
        for (const link of jobLinks) {
            const jobPage = await browser.newPage();
            await jobPage.goto(link, {
                waitUntil: "domcontentloaded",
                timeout: 60000,
            });
            const title = await jobPage.$eval("h1[data-cy='title-job']", (el) => el.textContent?.trim() || "Unknown");
            const datePosted = (await jobPage
                .$eval("p.text-xs.text-gray-500", (el) => el.textContent?.trim())
                .catch(() => "Unknown")) || "Unknown";
            const company = (await jobPage
                .$eval("h2.pb-1.text-sm.font-normal", (el) => el.textContent?.trim())
                .catch(() => "Unknown")) || "Unknown";
            jobs.push({
                id: `jobberman:${link.split("/").pop() || encodeURIComponent(link)}`,
                title,
                company,
                link,
                datePosted,
                source: "Jobberman",
            });
            await jobPage.close();
        }
        console.log("Visiting:", url); // after each page
        console.log(" Found job links:", jobLinks.length); // after extracting links
        console.log(" Total collected so far:", jobs.length); // inside the loop
        await page.close();
    }
    //to avoid deduplication
    for (const job of jobs) {
        await jobberman_model_1.JobberManModel.updateOne({ id: job.id }, job, { upsert: true });
    }
    const Jobs = Array.from(new Map(jobs.map((job) => [job.id, job])).values());
    await browser.close();
    return Jobs;
}
// helper to scroll down gradually
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 500;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 300);
        });
    });
}
async function getRecentJobbermanJobs(limit = 10) {
    return await jobberman_model_1.JobberManModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
}
/*if (require.main === module) {
  import("mongoose").then(async (mongoose) => {
    try {
      await mongoose.connect(process.env.MONGO_URL as string);
      console.log("🧠 MongoDB connected, running scraper...");

      const jobs = await JobbermanScrapper(1);
      console.log("✅ Finished scraping:", jobs.length, "jobs");
      console.log("📊 Example job:", jobs[0]);
    } catch (err) {
      console.error("❌ Error running scraper:", err);
    } finally {
      await mongoose.disconnect();
      process.exit(0);
    }
  });
}
*/
//# sourceMappingURL=jobberman-scraper.js.map