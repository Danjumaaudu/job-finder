"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const jobberman_scraper_1 = require("../sources/jobberman-scraper");
const remoteok_1 = require("../sources/remoteok");
const weworkremotely_1 = require("../sources/weworkremotely");
(async () => {
    try {
        await (0, db_1.connectDB)();
        console.log("Running RemoteOK...");
        await (0, remoteok_1.RemoteokScraper)();
        console.log("Running Jobberman...");
        await (0, jobberman_scraper_1.JobbermanScrapper)();
        console.log("Running WeWorkRemotely...");
        await (0, weworkremotely_1.FetchWWR)();
        console.log("All scrapers completed!");
    }
    catch (err) {
        console.error(err);
    }
    finally {
        process.exit(0);
    }
})();
//# sourceMappingURL=runscrapers.js.map