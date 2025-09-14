import fetch from "node-fetch";

export async function Fetchremoteok() {
  const response = await fetch("https://remoteok.com/api", {
    headers: {
      "User-Agent": "Mozilla/5.0", //in order to avoid 403
    },
  });
  const jobs: any = await response.json();

  return jobs
  .filter((jobs:any)=>jobs.id)
  .map((job:any) => ({
    id:`remoteok-${jobs.id}`,
    company: job.company,
    position: job.position,
    link: job.url,
    source: "Remoteok",

  }));
}
