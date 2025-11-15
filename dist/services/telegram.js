"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToTelegram = sendToTelegram;
// services/telegram.ts
const telegram_bot_1 = __importDefault(require("../telegram-bot"));
const subscribers_1 = require("../models/subscribers");
async function sendToTelegram(job) {
    const subscribers = await subscribers_1.Subscriber.find();
    for (const sub of subscribers) {
        const text = `💼 *${job.title}*\n🏢 ${job.company}\n🔗 [Apply Here](${job.link})`;
        await telegram_bot_1.default.sendMessage(sub.chatId, text, { parse_mode: "Markdown" });
    }
}
//# sourceMappingURL=telegram.js.map