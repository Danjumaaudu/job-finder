import { fetchalljobs } from "./sources/aggregator";

async function run() {
  const jobs = await fetchalljobs();
  console.log("alljobs : ", jobs);
  for (const j of jobs.slice(0, 30)) {
    console.log(`\n${j.title}\n${j.company}\n${j.link}\n${j.source}`);
  }
}

run().catch(console.error);

