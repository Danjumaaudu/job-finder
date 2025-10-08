import { getAllRecentJobs } from "../sources/aggregator";

export async function Fetchjobs(limit = 10) {
  return await getAllRecentJobs(limit);
}
