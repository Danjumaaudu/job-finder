import { job } from "../types/Jobs";
export declare function RemoteokScraper(): Promise<job[]>;
export declare function getRecentRemoteOkJobs(limit?: number): Promise<(import("mongoose").FlattenMaps<import("../models/jobmodels").IJob> & Required<{
    _id: import("mongoose").FlattenMaps<unknown>;
}> & {
    __v: number;
})[]>;
//# sourceMappingURL=remoteok.d.ts.map