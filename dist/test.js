"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const job_services_1 = require("./services/job-services");
(async () => {
    const jobs = await (0, job_services_1.Fetchjobs)();
    console.log("Fetched", jobs.length, "jobs");
    console.log(jobs.slice(0, 5));
})();
//# sourceMappingURL=test.js.map