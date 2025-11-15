import { job } from "../types/Jobs";
export declare function FetchWWR(): Promise<job[]>;
export declare function getRecentWWRJobs(limit?: number): Promise<(import("mongoose").FlattenMaps<import("../models/jobmodels").IJob> & Required<{
    _id: import("mongoose").FlattenMaps<unknown>;
}> & {
    __v: number;
})[]>;
//# sourceMappingURL=weworkremotely.d.ts.map