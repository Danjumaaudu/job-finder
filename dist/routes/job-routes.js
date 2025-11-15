"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_services_1 = require("../services/job-services");
const jobrouter = (0, express_1.Router)();
jobrouter.get("/", async (req, res) => {
    try {
        const newJobs = await (0, job_services_1.Fetchjobs)();
        res.status(200).json({ count: newJobs.length, jobs: newJobs });
        return;
    }
    catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Failed to get data" });
    }
});
exports.default = jobrouter;
//# sourceMappingURL=job-routes.js.map