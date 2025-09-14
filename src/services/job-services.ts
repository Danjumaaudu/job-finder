import { Fetchremoteok } from "../sources/remoteok";
import { FetchWWR } from "../sources/weworkremotely";
import { isNewJob } from "../store/job-store";

export async function Fetchjobs() {
try{
      const [remoteokJobs, wwrJobs] = await Promise.all([
         Fetchremoteok(),
         FetchWWR(),
      ]);
      const allJobs = [...remoteokJobs, wwrJobs];
      return allJobs.filter((job)=> isNewJob(job.id))
}catch(error){
     console.error("error fetching jobs:", error);
     throw new Error("failed to fetch jobs");
}
}
