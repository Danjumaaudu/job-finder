"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatjob = formatjob;
function formatjob(job) {
    const title = job.title || "No title";
    const company = job.company || "company doesnt not exist";
    const link = job.link || "link not accessible";
    return `
💼 *${title}*
🏢 ${company}
🔗 [Apply Here](${link})
🌐 Source: ${job.source}
  `;
}
//# sourceMappingURL=job_formatter.js.map