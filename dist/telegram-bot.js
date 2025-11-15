"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const job_services_1 = require("./services/job-services");
const subscribers_1 = require("./models/subscribers");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const sent_jobsModel_1 = require("./models/sent-jobsModel");
dotenv_1.default.config();
const token = process.env.TELEGRAM_BOT_TOKEN;
//mongodb connection
mongoose_1.default
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Mongo connected"))
    .catch((err) => console.error("Unable to connect to mongodb", err));
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
// /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const existing = await subscribers_1.Subscriber.findOne({ chatId });
        if (!existing) {
            await subscribers_1.Subscriber.create({ chatId });
            bot.sendMessage(chatId, "Hello there 👋🏿, welcome to Job Finder! I’ll send you a list of recent jobs.");
        }
        else {
            bot.sendMessage(chatId, "Seems like you have already subscribed ✅");
        }
    }
    catch (err) {
        console.error(err);
        bot.sendMessage(chatId, "Error subscribing, please try again later");
    }
});
// /jobs
bot.onText(/\/jobs/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Fetching latest jobs... 🔍");
    const jobs = await (0, job_services_1.Fetchjobs)(15); // aggregated across all sources
    const today = new Date().toDateString();
    const todayJobs = jobs.filter((j) => {
        const jobDate = j.datePosted ? new Date(j.datePosted).toDateString() : "";
        return jobDate === today;
    });
    if (todayJobs.length === 0) {
        bot.sendMessage(chatId, "No jobs found at the moment. Try again later.");
        return;
    }
    //checks db if job has already been sent
    const sentForuser = await sent_jobsModel_1.SentJobsModel.find({ chatId }).lean();
    const sentIds = new Set(sentForuser.map((s) => s.jobId));
    const newJobs = jobs.filter((j) => !sentIds.has(j.id));
    if (!newJobs.length)
        return bot.sendMessage(chatId, "No new jobs yet");
    // sends only new jobs
    const chunkSize = 9;
    for (let i = 0; i < newJobs.length; i += chunkSize) {
        const chunk = newJobs.slice(i, i + chunkSize);
        const text = chunk
            .map((job) => `💼 *${job.title}*\n🏢 ${job.company}\n🔗 [Apply Here](${job.link})`)
            .join("\n\n");
        await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
    }
    // 💾 Save sent job IDs to prevent re-sending next time
    await sent_jobsModel_1.SentJobsModel.insertMany(newJobs.map((j) => ({ jobId: j.id })), { ordered: false } // ignore duplicates gracefully
    );
    // ✅ One single callback_query handler
    /*bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id!;
    const data = query.data!;
  
    // Step 1: User chooses filter
    if (data.startsWith("filter_")) {
      let keyword = "";
      if (data === "filter_dev") keyword = "developer";
      if (data === "filter_va") keyword = "virtual assistant";
      if (data === "filter_design") keyword = "designer";
      if (data === "filter_other") keyword = "other";
  
      // Ask if today or all jobs
      bot.sendMessage(chatId, `Do you want only today's ${keyword} jobs?`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Yes ✅", callback_data: `today_${keyword}` },
              { text: "No ❌", callback_data: `all_${keyword}` },
            ],
          ],
        },
      });
      return;
    }
  
    // Step 2: User chooses "today" or "all"
    if (data.startsWith("today_") || data.startsWith("all_")) {
      const keyword = data.split("_")[1] as string; // "developer", "va", etc.
      const onlyToday = data.startsWith("today_");
  
      bot.sendMessage(
        chatId,
        `Searching ${onlyToday ? "today's" : "all"} ${keyword} jobs... 🔍`
      );
  
      const jobs: job[] = await Fetchjobs();
  
      if (jobs.length === 0) {
        bot.sendMessage(chatId, "No jobs found at the moment. Try again later.");
        return;
      }
  
      // Filter + limit
      const filtered = jobs.filter((j) => {
        const matchKeyword = j.title
          .toLowerCase()
          .includes(keyword.toLowerCase());
        const matchDate = onlyToday
          ? j.datePosted?.toLowerCase().includes("today")
          : true;
        return matchKeyword && matchDate;
      });
  
      const topJobs = filtered.slice(0, 10);
  
      if (topJobs.length === 0) {
        bot.sendMessage(chatId, "No matching jobs found.");
        return;
      }
      const chunkSize = 9;
      for (let i = 0; i < filtered.length; i += chunkSize) {
        const chunk = filtered.slice(i, i + chunkSize);
  
        const text = chunk
          .map(
            (job) =>
              `💼 *${job.title}*\n🏢 ${job.company}\n🔗 [Apply Here](${job.link})`
          )
          .join("\n\n");
  
        bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
      }
    }
  });*/
    console.log(`sent${newJobs.length} new jobs to ${chatId}`);
});
exports.default = bot;
//# sourceMappingURL=telegram-bot.js.map