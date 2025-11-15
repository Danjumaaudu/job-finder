"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*import { chromium } from "playwright";

export type job = {
  id: string;
  title: string;
  company: string;
  link: string;
  source: string;
};

export async function fetchGlassdoorjobs(
  searchpage = "https://www.glassdoor.com/Job/nigeria-jobs-SRCH_IL.0,7_IN178.htm"
): Promise<job[]> {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
    locale: "en-US",
    extraHTTPHeaders: {
      "accept-language": "en-US,en;q=0.9",
    },
  });
  const page = await context.newPage();

  try {
    await page.goto(searchpage, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    console.log("Page loaded:", page.url());
    await page.screenshot({ path: "glassdoor.png", fullPage: true });
    // wait for job cards
    await page.waitForSelector("a[data-test='job-link']", {
      state: "attached",
    });

    // scroll down to load more
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const jobElements = await page.$$("a[data-test='job-link']");
    console.log("Found job elements:", jobElements.length);

    if (jobElements.length === 0) {
      const html = await page.content();
      console.log("No jobs found. Page snapshot start:\n", html.slice(0, 500));
      return []; // early exit
    }

    // collect jobs directly from the results page
    const jobs: job[] = await page.$$eval("li.react-job-listing", (cards) =>
      cards.map((card) => {
        const titleEl = card.querySelector("a[data-test='job-link']");
        const companyEl = card.querySelector("div[data-test='employer-name']");
        const link = titleEl ? (titleEl as HTMLAnchorElement).href : "Unknown";

        return {
          id:
            (link.includes("jobListingId=")
              ? link.split("jobListingId=")[1]
              : link.split("/").pop()) || link,
          title: titleEl?.textContent?.trim() || "Unknown",
          company: companyEl?.textContent?.trim() || "Unknown",
          link,
          source: "Glassdoor",
        };
      })
    );

    return jobs.slice(0, 20); // limit for testing
  } finally {
    await browser.close();
  }
}
*/ 
//# sourceMappingURL=glassdoor-scraper.js.map