import OpenAI from "openai";

const AIText = async (prompt?: string) => {
  const openai = new OpenAI({
    apiKey: "sk-oIkZU9Qgk2Zl31Hs95Cc93266cB745C2B8Ea1c8e21Fd4a44",
    baseURL: "https://aihubmix.com/v1",
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

export default AIText;
