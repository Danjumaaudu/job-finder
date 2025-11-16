// services/telegram.ts
import bot from "../telegram-bot";
import { Subscriber } from "../models/subscribers";

export async function sendToTelegram(job: {
  title: string;
  company: string;
  summary?: string;
  link: string;
  datePosted?: string;
}) {
  const subscribers = await Subscriber.find();

  for (const sub of subscribers) {
    let text = `💼 *${job.title}*\n🏢 ${job.company}`;

    if (job.summary) {
      text += `\n\n📝 *Summary*\n${job.summary}`;
    }

    text += `\n\n🔗 [Apply Here](${job.link})`;

    await bot.sendMessage(sub.chatId, text, {
      parse_mode: "Markdown",
      disable_web_page_preview: false,
    });
  }
}
