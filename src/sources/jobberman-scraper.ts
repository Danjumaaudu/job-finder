import { chromium } from "playwright";

export type job = {
  id: string;
  title: string;
  company: string;
  link: string;
  source: string;
};

export async function JobbermanScrapper(
  url = "https://www.jobberman.com/jobs"
): Promise<job[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // block heavy resources
  await page.route("**/*", (route) => {
    return ["image", "font", "stylesheet"].includes(
      route.request().resourceType()
    )
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
  const jobLinks = await page.$$eval("a[href*='/listings/']", (cards) =>
    cards.map((card) => (card as HTMLAnchorElement).href)
  );

  const jobs: job[] = [];

  for (const link of jobLinks) {
    const jobPage = await browser.newPage();
    await jobPage.goto(link, { waitUntil: "domcontentloaded", timeout: 60000 });

    const title = await jobPage.$eval(
      "h1[data-cy='title-job']",
      (el) => el.textContent?.trim() || "Unknown"
    );

    const company =
      (await jobPage
        .$eval("h2.pb-1.text-sm.font-normal", (el) => el.textContent?.trim())
        .catch(() => "Unknown")) || "Unknown";

    jobs.push({
      id: link.split("/").pop() || "no-id",
      title,
      company,
      link: link || "no-link",
      source: "Jobberman",
    });

    await jobPage.close();
  }
    //to avoid deduplication
      const Jobs = Array.from(
    new Map(jobs.map((job) => [job.id, job])).values()
  );
  return Jobs;
}

// helper to scroll down gradually
async function autoScroll(page: any) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
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
