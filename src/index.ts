import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";
import dayjs from "dayjs";
import { config } from "dotenv";
config();
const fs = require("fs");
import path from "path";

const token = process.env.TELEGRAM_TOKEN || "";
const chatId = process.env.TELEGRAM_CHAT_ID || "";

const start = async () => {
  const today = dayjs().format("YYYY-MM-DD");
  const url = `https://raw.githubusercontent.com/real-time-news/readhub/main/data/${today}.json`;
  const res = await fetch(url);
  const data = await res.json();

  const bot = new TelegramBot(token, { polling: false });

  const filePath = path.resolve(__dirname, `../data/sentMessageIds.json`);

  const sendMessage = (text, i) => {
    setTimeout(() => {
      bot.sendMessage(chatId, text);
    }, i * 3000);
  };

  fs.readFile(filePath, (err, fileData) => {
    const fileDataJson = JSON.parse(fileData.toString());
    const list = [...fileDataJson];

    const reverseData = data.reverse();
    reverseData.forEach((item: any, i: number) => {
      const { title, summary, uuid } = item;
      const text = `${title}\n${summary}\n${"#ReadHub"}`;
      const isExist = list.includes(uuid);
      if (isExist) return;
      list.push(uuid);
      sendMessage(text, i);
    });

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
