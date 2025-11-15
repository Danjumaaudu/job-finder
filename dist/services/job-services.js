"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetchjobs = Fetchjobs;
const aggregator_1 = require("../sources/aggregator");
async function Fetchjobs(limit = 10) {
    return await (0, aggregator_1.getAllRecentJobs)(limit);
}
//# sourceMappingURL=job-services.js.map