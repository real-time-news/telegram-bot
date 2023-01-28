import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
config();

const token = process.env.TELEGRAM_TOKEN || "";
const chatId = process.env.TELEGRAM_CHAT_ID || "";

const bot = new TelegramBot(token, { polling: true });

// 启动时发送消息;
bot.sendMessage(chatId, "Hello World");

// bot.on("message", (msg) => {
//   setInterval(() => {
//     const date = new Date(0);
//     bot.sendMessage(chatId, `Received your message${date}`);
//   }, 5000);
// });
