import { Configuration, OpenAIApi } from "openai";

const AIText = async (prompt?: string) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  if (!prompt) return Promise.resolve("");

  //捕获错误
  try {
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: `${prompt} 请一句话评价这条新闻`,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1000,
      stream: false,
      n: 1,
    });
    const { data } = completion || {};
    const { choices } = data || [];
    const { text } = choices[0] || {};
    const trimText = text?.trim();
    return trimText || "";
  } catch (error) {
    console.log(error);
  }
};

export default AIText;
