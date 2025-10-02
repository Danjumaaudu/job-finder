interface Job {
  title: string;
  company: string;
  link: string;
  source: string;
}

export function formatjob(job: Job) {
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
