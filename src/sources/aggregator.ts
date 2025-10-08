import { getRecentJobbermanJobs } from "./jobberman-scraper";
import { getRecentRemoteOkJobs } from "./remoteok";
import { getRecentWWRJobs } from "./weworkremotely";
import { job } from "../types/Jobs";

export async function getAllRecentJobs(limit = 10): Promise<job[]> {
  try {
    // Run all job fetchers in parallel
    const results = await Promise.allSettled([
      getRecentWWRJobs(limit),
      getRecentJobbermanJobs(limit),
      getRecentRemoteOkJobs(limit),
    ]);

    const jobs: job[] = [];

    // Collect successful results
    for (const [index, result] of results.entries()) {
      const sourceNames = ["WWR", "Jobberman", "RemoteOK"];
      if (result.status === "fulfilled") {
        console.log(
          `✅ ${sourceNames[index]} returned ${result.value.length} jobs`
        );
        jobs.push(...result.value);
      } else {
        console.error("❌ Scraper failed:", result.reason);
      }
    }

    // ✅ Deduplicate by ID (or fallback key)
    const seen = new Set<string>();
    const deduped: job[] = [];

    for (const j of jobs) {
      const key = (j.id || `${j.source}_${j.company}_${j.title}`).toLowerCase();

      if (!seen.has(key)) {
        seen.add(key);

        // Ensure every job has a date
        if (!j.datePosted) {
          j.datePosted = new Date().toISOString();
        }

        deduped.push(j);
      }
    }

    console.log(
      `✅ Aggregated ${jobs.length} jobs → ${deduped.length} after dedupe`
    );

    return deduped;
  } catch (err) {
    console.error("⚠️ Error in getAllRecentJobs:", err);
    return [];
  }
}
