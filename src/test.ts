import { FetchWWR } from "./sources/weworkremotely";
import { Fetchjobs } from "./services/job-services";

(async () => {
  const jobs = await Fetchjobs();
  console.log("Fetched", jobs.length, "jobs");
  console.log(jobs.slice(0, 5));
})();