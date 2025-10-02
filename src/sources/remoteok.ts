import { chromium } from "playwright";
import { job } from "./jobberman-scraper";

export async function RemoteokScraper(): Promise<job[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://remoteok.com/", { waitUntil: "networkidle" });
  await page.waitForSelector("tr.job");

  const jobs: job[] = await page.$$eval("tr.job", (rows) =>
    rows.map((row) => {
      const title = row.querySelector("h2")?.textContent?.trim() || "Untitled";
      const company =
        row.querySelector(".companyLink")?.textContent?.trim() || "Unknown";
      const href = row.querySelector("a.preventLink")?.getAttribute("href") || "";
      const link = "https://remoteok.com" + href;

      return {
        id: link.split("/").pop() || link,
        title,
        company,
        link: link || "no-link",
        source: "RemoteOK",
      };
    })
  );

  await browser.close();
  return jobs.slice(0, 20);
}
