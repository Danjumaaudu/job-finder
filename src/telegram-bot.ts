import TelegramBot from "node-telegram-bot-api";
import { Fetchjobs } from "./services/job-services";
import { Subscriber } from "./models/subscribers";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN as string;

//mongodb connection
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error("Unable to connect to mongodb", err));

//creates and listens to new messages
const bot = new TelegramBot(token, {
  polling: true,
});
//saves the id when start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const existing = await Subscriber.findOne({ chatId });
    if (!existing) {
      await Subscriber.create({ chatId });
      bot.sendMessage(
        chatId,
        "hello there👋🏿, welcome to job finder.... ill send a lsit of recent jobs"
      );
    } else {
      bot.sendMessage(chatId, "Seems like you have already subscribe");
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "Error subscribing, please try again later");
  }
});

bot.onText(/\/jobs/, async (msg) => {
  const chatid = msg.chat.id;

  const jobs = await Fetchjobs();

  if (jobs.length === 0) {
    bot.sendMessage(
      chatid,
      "unfortunately no recent jobs come back in the next 3hrs"
    );
    return;
  }

  const alljobs = jobs
    .filter((jobs) => jobs.source.toLowerCase() === "remoteok" || "jobberman")
    .slice(0, 10);
  const weworkremotelyJobs = jobs
    .filter((jobs) => jobs.source.toLowerCase().includes("weworkremotely"))
    .slice(0, 10);

  const combined = [...alljobs, ...weworkremotelyJobs];

  for (const job of combined) {
    const text = `💼 *${job.title}*\n🏢 ${job.company}\n🔗 [Apply Here](${job.link})`;
    bot.sendMessage(chatid, text, { parse_mode: "Markdown" });
  }
});

export default bot;
