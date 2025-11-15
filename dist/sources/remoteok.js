"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteokScraper = RemoteokScraper;
exports.getRecentRemoteOkJobs = getRecentRemoteOkJobs;
const playwright_1 = require("playwright");
const remote_okmodels_1 = require("../models/remote-okmodels");
async function RemoteokScraper() {
    const browser = await playwright_1.chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://remoteok.com/", {
        waitUntil: "domcontentloaded",
        timeout: 60000,
    });
    await page.waitForSelector("tr.job");
    const jobs = await page.$$eval("tr.job", (rows) => rows
        .map((row) => {
        const title = row.querySelector("h2")?.textContent?.trim() || "Untitled";
        const company = row.querySelector(".companyLink")?.textContent?.trim() || "Unknown";
        const href = row.querySelector("a.preventLink")?.getAttribute("href") || "";
        if (!href)
            return null;
        const link = "https://remoteok.com" + href;
        const datePosted = row.querySelector("time")?.getAttribute("datetime") ||
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
        .filter(Boolean));
    for (const job of jobs) {
        await remote_okmodels_1.RemoteOkModel.updateOne({ id: job.id }, job, { upsert: true });
    }
    await browser.close();
    return jobs.slice(0, 20);
}
async function getRecentRemoteOkJobs(limit = 10) {
    return await remote_okmodels_1.RemoteOkModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
}
//# sourceMappingURL=remoteok.js.map