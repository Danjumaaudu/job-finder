"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRecentJobs = getAllRecentJobs;
const jobberman_scraper_1 = require("./jobberman-scraper");
const remoteok_1 = require("./remoteok");
const weworkremotely_1 = require("./weworkremotely");
async function getAllRecentJobs(limit = 10) {
    try {
        // Run all job fetchers in parallel
        const results = await Promise.allSettled([
            (0, weworkremotely_1.getRecentWWRJobs)(limit),
            (0, jobberman_scraper_1.getRecentJobbermanJobs)(limit),
            (0, remoteok_1.getRecentRemoteOkJobs)(limit),
        ]);
        const jobs = [];
        // Collect successful results
        for (const [index, result] of results.entries()) {
            const sourceNames = ["WWR", "Jobberman", "RemoteOK"];
            if (result.status === "fulfilled") {
                console.log(`✅ ${sourceNames[index]} returned ${result.value.length} jobs`);
                jobs.push(...result.value);
            }
            else {
                console.error("❌ Scraper failed:", result.reason);
            }
        }
        // ✅ Deduplicate by ID (or fallback key)
        const seen = new Set();
        const deduped = [];
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
        console.log(`✅ Aggregated ${jobs.length} jobs → ${deduped.length} after dedupe`);
        return deduped;
    }
    catch (err) {
        console.error("⚠️ Error in getAllRecentJobs:", err);
        return [];
    }
}
//# sourceMappingURL=aggregator.js.map