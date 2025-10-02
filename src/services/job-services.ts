import {fetchalljobs} from "../sources/aggregator";
import { FetchWWR } from "../sources/weworkremotely";
import { isNewJob } from "../store/job-store";

export async function Fetchjobs() {
  const jobs: { title: string; company: string; link: string }[] = [];
  try {
    const [alljobs, wwrJobs] = await Promise.all([
      fetchalljobs(),
      FetchWWR(),
    ]);
    //console.log("RemoteOK jobs:", remoteokJobs.length);
    //console.log("WWR jobs:", wwrJobs.length);
    //console.log("First WWR job:", wwrJobs[0]);
    const allJobs = [...alljobs, ...wwrJobs];
    return allJobs.filter((job) => isNewJob(job.id));
    //console.log("All jobs Fetched", allJobs.slice(0, 3));
    //return allJobs;
  } catch (error) {
    console.error("error fetching jobs:", error);
    throw new Error("failed to fetch jobs");
  }
}
