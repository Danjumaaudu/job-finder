import { JobbermanScrapper } from "./jobberman-scraper";
import { RemoteokScraper } from "./remoteok";
import { job } from "./jobberman-scraper";

export async function fetchalljobs(): Promise<job[]> {
  const result = await Promise.allSettled([
    JobbermanScrapper(),
    RemoteokScraper()
  ]);

  const jobs: job[] = [];

  for (const r of result) {
    if (r.status === "fulfilled") {
      jobs.push(...r.value);
    } else {
      console.error("Scraper failed", r.reason);
    }
  }

  // dedupe
  const seen = new Set<string>();
  const dedupe: job[] = [];
  for (const j of jobs) {
    const key = (j.link || j.company + j.title).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      dedupe.push(j);
    }
  }

  return dedupe;
}
