import TelegramBot from "node-telegram-bot-api";
import { Fetchjobs } from "./services/job-services";
import { Subscriber } from "./models/subscribers";
import { job } from "./types/Jobs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { SentJobsModel } from "./models/sent-jobsModel";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN as string;

//mongodb connection
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error("Unable to connect to mongodb", err));

const bot = new TelegramBot(token, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 60, // long polling timeout
      limit: 100, // batch updates
      allowed_updates: ["message", "callback_query"],
    },
  },
});

// /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const existing = await Subscriber.findOne({ chatId });
    if (!existing) {
      await Subscriber.create({ chatId });
      bot.sendMessage(
        chatId,
        "Hello there 👋🏿, welcome to Job Finder! I’ll send you a list of recent jobs."
      );
    } else {
      bot.sendMessage(chatId, "Seems like you have already subscribed ✅");
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "Error subscribing, please try again later");
  }
});

// /jobs
bot.onText(/\/jobs/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Fetching latest jobs... 🔍");

  const jobs = await Fetchjobs(15); // aggregated across all sources

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
  const sentForuser = await SentJobsModel.find({ chatId }).lean();
  const sentIds = new Set(sentForuser.map((s) => s.jobId));

  const newJobs = jobs.filter((j) => !sentIds.has(j.id));
  if (!newJobs.length) return bot.sendMessage(chatId, "No new jobs yet");

  // sends only new jobs
  const chunkSize = 9;
  for (let i = 0; i < newJobs.length; i += chunkSize) {
    const chunk = newJobs.slice(i, i + chunkSize);
    const text = chunk
      .map(
        (job) =>
          `💼 *${job.title}*\n🏢 ${job.company}\n🔗 [Apply Here](${job.link})`
      )
      .join("\n\n");

    await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  }

  // 💾 Save sent job IDs to prevent re-sending next time
  await SentJobsModel.insertMany(
    newJobs.map((j) => ({ jobId: j.id })),
    { ordered: false } // ignore duplicates gracefully
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
export default bot;
