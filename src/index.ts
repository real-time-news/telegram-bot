import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";
import dayjs from "dayjs";
import path from "path";
import { config } from "dotenv";
// import { getAIResponseForNews } from "./getAIResponseForNews";

config();
const fs = require("fs");
const token = process.env.TELEGRAM_TOKEN || "";
const chatId = process.env.TELEGRAM_CHAT_ID || "";
const bot = new TelegramBot(token, { polling: false });

const start = async () => {
  const today = dayjs().format("YYYY-MM-DD");
  const readhubUrl = `https://raw.githubusercontent.com/real-time-news/readhub/main/data/${today}.json`;
  const zaobaoUrl = `https://raw.githubusercontent.com/real-time-news/zaobao/main/data/${today}.json`;
  const readhubRes = await fetch(readhubUrl);
  const zaobaoRes = await fetch(zaobaoUrl);
  const readhubData = await readhubRes.json();
  const zaobaoData = await zaobaoRes.json();

  const filePath = path.resolve(__dirname, `../data/sentMessageIds.json`);

  const sendMessage = (text: string, i: number) => {
    setTimeout(() => {
      bot.sendMessage(chatId, text);
    }, i * 3000);
  };

  await fs.readFile(filePath, async (err, fileData) => {
    const fileDataJson = JSON.parse(fileData.toString());
    let fileDataList = [...fileDataJson];
    const reverseData = readhubData.reverse();

    for (let i = 0; i < reverseData.length; i++) {
      const { title, summary, uuid } = reverseData[i];
      const isExist = fileDataList.includes(uuid);

      if (isExist) {
        continue;
      }

      // const AITextSummary = await getAIResponseForNews(title + summary);
      const AITextSummary = "暂无";
      const text = `${title}\n${summary}\n\nAI总结:${AITextSummary}\n${"#ReadHub"}`;

      fileDataList.push(uuid);
      sendMessage(text, i);
    }

    if (fileDataList.length >= 2000) {
      fileDataList = fileDataList.slice(1000);
    }

    fs.writeFile(filePath, JSON.stringify([...fileDataList]), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  await fs.readFile(filePath, async (err, fileData) => {
    const fileDataJson = JSON.parse(fileData.toString());
    let fileDataList = [...fileDataJson];
    const reverseData = zaobaoData.reverse();

    for (let i = 0; i < reverseData.length; i++) {
      const { title, uuid, summary } = reverseData[i];
      const isExist = fileDataList.includes(uuid);

      if (isExist) {
        continue;
      }

      // const AITextSummary = await getAIResponseForNews(title);
      const AITextSummary = "暂无";

      const text = `${title}\n${summary}\n\nAI总结:${AITextSummary}\n${"#联合早报"}`;

      fileDataList.push(uuid);
      sendMessage(text, i);
    }

    if (fileDataList.length >= 2000) {
      fileDataList = fileDataList.slice(1000);
    }

    fs.writeFile(filePath, JSON.stringify(fileDataList), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
};

start();
