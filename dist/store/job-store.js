"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNewJob = isNewJob;
const seenJobs = new Set();
function isNewJob(jobId) {
    if (seenJobs.has(jobId)) {
        return false;
    }
    seenJobs.add(jobId);
    return true;
}
//# sourceMappingURL=job-store.js.map