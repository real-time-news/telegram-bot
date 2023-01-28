import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
config();

const token = process.env.TELEGRAM_TOKEN || "";
const chatId = process.env.TELEGRAM_CHAT_ID || "";

console.log("process.env", process.env);

const bot = new TelegramBot(token, { polling: true });

const date = new Date();

// 启动时发送消息;
bot.sendMessage(chatId, `Hello World ${date}`);

// 停止机器人
bot.stopPolling();

//关闭机器人
bot.close();

// bot.on("message", (msg) => {
//   setInterval(() => {
//     const date = new Date(0);
//     bot.sendMessage(chatId, `Received your message${date}`);
//   }, 5000);
// });
