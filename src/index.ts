import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";
import dayjs from "dayjs";
import { config } from "dotenv";
config();
const fs = require("fs");
import path from "path";
import AIText from "./AIText";

const token = process.env.TELEGRAM_TOKEN || "";
const chatId = process.env.TELEGRAM_CHAT_ID || "";

const start = async () => {
  const today = dayjs().format("YYYY-MM-DD");
  const url = `https://raw.githubusercontent.com/real-time-news/readhub/main/data/${today}.json`;
  console.log(url);
  const res = await fetch(url);
  const data = await res.json();

  const bot = new TelegramBot(token, { polling: false });

  const filePath = path.resolve(__dirname, `../data/sentMessageIds.json`);

  const sendMessage = (text, i) => {
    setTimeout(() => {
      bot.sendMessage(chatId, text);
    }, i * 3000);
  };

  fs.readFile(filePath, async (err, fileData) => {
    const fileDataJson = JSON.parse(fileData.toString());
    const list = [...fileDataJson];

    const reverseData = data.reverse();

    for (let i = 0; i < reverseData.length; i++) {
      const { title, summary, uuid } = reverseData[i];

      const isExist = list.includes(uuid);
      if (isExist) return;

      const AITextSummary = await AIText(title + summary);
      const text = `${title}\n${summary}\n\nAI总结:\n${AITextSummary}\n${"#ReadHub"}`;

      list.push(uuid);
      sendMessage(text, i);
    }

    fs.writeFile(filePath, JSON.stringify([...list]), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  // 启动时发送消息;
  // bot.sendMessage(chatId, `Hello World ${date} ${data}`);
};

start();
