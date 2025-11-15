"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const job_services_1 = require("../services/job-services");
const job_store_1 = require("../store/job-store");
const telegram_1 = require("../services/telegram");
node_cron_1.default.schedule(" 3 * * * *", async () => {
    console.log("Running job fetcher");
    const jobs = await (0, job_services_1.Fetchjobs)();
    for (const job of jobs) {
        const fresh = (0, job_store_1.isNewJob)(job.id);
        if (fresh) {
            await (0, telegram_1.sendToTelegram)({
                title: job.title,
                company: job.company,
                link: job.link ?? "No link available",
            });
        }
    }
});
//# sourceMappingURL=scheduler.js.map