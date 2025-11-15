import { connectDB } from "../config/db";
import { JobbermanScrapper } from "../sources/jobberman-scraper";
import { RemoteokScraper } from "../sources/remoteok";
import { FetchWWR } from "../sources/weworkremotely";

(async () => {
  try {
    await connectDB();

    console.log("Running RemoteOK...");
    await RemoteokScraper();

    console.log("Running Jobberman...");
    await JobbermanScrapper();

    console.log("Running WeWorkRemotely...");
    await FetchWWR();

    console.log("All scrapers completed!");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
