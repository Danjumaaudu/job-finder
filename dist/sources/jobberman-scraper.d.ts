import { job } from "../types/Jobs";
export declare function JobbermanScrapper(maxpages?: number): Promise<job[]>;
export declare function getRecentJobbermanJobs(limit?: number): Promise<(import("mongoose").FlattenMaps<import("../models/jobmodels").IJob> & Required<{
    _id: import("mongoose").FlattenMaps<unknown>;
}> & {
    __v: number;
})[]>;
//# sourceMappingURL=jobberman-scraper.d.ts.map