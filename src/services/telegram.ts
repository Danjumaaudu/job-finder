// services/telegram.ts
import bot from "../telegram-bot";
import { Subscriber } from "../models/subscribers";

export async function sendToTelegram(job: { title: string; company: string; link: string; datePosted?: string; }) {
  const subscribers = await Subscriber.find();

  for (const sub of subscribers) {
    const text = `💼 *${job.title}*\n🏢 ${job.company}\n🔗 [Apply Here](${job.link})`;
    await bot.sendMessage(sub.chatId, text, { parse_mode: "Markdown" });
  }
}
