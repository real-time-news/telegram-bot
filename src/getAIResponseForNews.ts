import OpenAI from "openai";

export const getAIResponseForNews = async (prompt?: string) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.BASEURL,
  });

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: `${prompt} 请一句话评价这条新闻` }],
    model: "gpt-3.5-turbo",
    stream: false,
  });

  const { choices } = chatCompletion || {};
  const { message = "" } = choices[0] || {};

  const { content = "" } = message || {};

  const trimText = content?.trim();

  return trimText || "";
};
