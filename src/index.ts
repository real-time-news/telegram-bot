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
  const zaobaoUrl = `https://raw.githubusercontent.com/real-time-news/zaobao/main/data/${today}.json`;
  const res = await fetch(url);
  const zaobaoRes = await fetch(zaobaoUrl);
  const data = await res.json();
  const zaobaoData = await zaobaoRes.json();

  const bot = new TelegramBot(token, { polling: false });

  const filePath = path.resolve(__dirname, `../data/sentMessageIds.json`);

  const sendMessage = (text, i) => {
    setTimeout(() => {
      bot.sendMessage(chatId, text);
    }, i * 3000);
  };

  await fs.readFile(filePath, async (err, fileData) => {
    const fileDataJson = JSON.parse(fileData.toString());
    const fileDataList = [...fileDataJson];
    const reverseData = data.reverse();

    for (let i = 0; i < reverseData.length; i++) {
      const { title, summary, uuid } = reverseData[i];
      const isExist = fileDataList.includes(uuid);

      if (isExist) {
        continue;
      }

      const AITextSummary = await AIText(title + summary);
      const text = `${title}\n${summary}\n\nAI总结:${AITextSummary}\n${"#ReadHub"}`;

      fileDataList.push(uuid);
      sendMessage(text, i);
    }

    fs.writeFile(filePath, JSON.stringify([...fileDataList]), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  await fs.readFile(filePath, async (err, fileData) => {
    const fileDataJson = JSON.parse(fileData.toString());
    const fileDataList = [...fileDataJson];
    const reverseData = zaobaoData.reverse();

    for (let i = 0; i < reverseData.length; i++) {
      const { title, uuid, summary } = reverseData[i];
      const isExist = fileDataList.includes(uuid);

      if (isExist) {
        continue;
      }

      const AITextSummary = await AIText(title);

      const text = `${title}\n${summary}\n\nAI总结:${AITextSummary}\n${"#联合早报"}`;

      fileDataList.push(uuid);
      sendMessage(text, i);
    }

    fs.writeFile(filePath, JSON.stringify([...fileDataList]), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
};

start();
