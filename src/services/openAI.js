import { OpenAI } from "openai";
import dotenv from "dotenv";
import logger from "../utils/logger.utils.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});


export const chatGptOptimise = async (prompt) => {
  
  const userPrompt = `
        Optimize the following artist prompt for clarity and creativity:
        • ${prompt.trim()}

        Return only the final optimized prompt sentence—no extra commentary.
        `.trim();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at refining and optimizing creative prompts. " +
            "Your output should be polished, clear, and inspiring."
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 250,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("chatGptOptimise error:", error);
    throw error;
  }
};


export const moodBased = async (mood, prompt) => {

  const userPrompt = `
        Generate one vivid, ${mood}-inspired prompt for an artist or designer, based on the following description:
        • ${prompt.trim()}

        Return only the final, evocative sentence—no bullet points or commentary.
        `.trim();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a highly creative prompt generator for artists and designers. " +
            "Your outputs must be concise, vivid, and immediately inspirational."
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 250,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    throw error;
  }
};

export const creativeSpark = async (prompt) => {

  const moodPrompt = `
        Generate one vivid, mood-driven prompt for an artist or designer based on the following elements:
        • ${prompt.trim()}

        Return only the final, evocative sentence—no bullet points or extra commentary.
        `.trim();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a highly creative prompt generator for artists and designers. " +
            "Your responses must be concise, vivid, and immediately inspirational."
        },
        { role: "user", content: moodPrompt },
      ],
      temperature: 0.9,
      max_tokens: 250,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    throw error;
  };
}

  export const textToImage = async (prompt, count = 1) => {
    try {
      // const images = [];
      // for (let i = 1; i <= count; i++) {
      //   const response = await openai.images.generate({
      //     model: "dall-e-3",
      //     prompt,
      //     n: 1,
      //     size: "1024x1024",
      //   });

      //   if (response?.data[0]?.url) {
      //     images.push(response.data[0].url);
      //   }
      // }

      const images = [
        "https://oaidalleapiprodscus.blob.core.windows.net/private/org-McrMnn7cZPZRAOpkt18l6w00/user-NttFeSjYC8ACEYPrrfTF3uLu/img-reDFVG8VfTmsGjYcE06qWX8n.png?st=2025-06-09T12%3A18%3A31Z&se=2025-06-09T14%3A18%3A31Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=cc612491-d948-4d2e-9821-2683df3719f5&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-09T11%3A06%3A14Z&ske=2025-06-10T11%3A06%3A14Z&sks=b&skv=2024-08-04&sig=bP9OYj%2BWb0U8vPBW1FpnECee39iz/52skqXsjiSzyyU%3D",
        "https://oaidalleapiprodscus.blob.core.windows.net/private/org-McrMnn7cZPZRAOpkt18l6w00/user-NttFeSjYC8ACEYPrrfTF3uLu/img-qqUg3zgPC7wAbjZsHha9c77q.png?st=2025-06-09T12%3A18%3A45Z&se=2025-06-09T14%3A18%3A45Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=cc612491-d948-4d2e-9821-2683df3719f5&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-08T16%3A41%3A14Z&ske=2025-06-09T16%3A41%3A14Z&sks=b&skv=2024-08-04&sig=dyBQOn1a50/sMXr7It3zafEvKwT1L8fqhv2ASprh8sk%3D",
        "https://oaidalleapiprodscus.blob.core.windows.net/private/org-McrMnn7cZPZRAOpkt18l6w00/user-NttFeSjYC8ACEYPrrfTF3uLu/img-O9QRMe3lEy2V6LAjbH4DTSRY.png?st=2025-06-09T12%3A18%3A58Z&se=2025-06-09T14%3A18%3A58Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=cc612491-d948-4d2e-9821-2683df3719f5&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-09T01%3A02%3A28Z&ske=2025-06-10T01%3A02%3A28Z&sks=b&skv=2024-08-04&sig=%2BOxZPUdKJ13Xc5d7%2BZlSh6T3YaXhBSIWW%2BjBZvFDlSE%3D",
        "https://oaidalleapiprodscus.blob.core.windows.net/private/org-McrMnn7cZPZRAOpkt18l6w00/user-NttFeSjYC8ACEYPrrfTF3uLu/img-FYZpRObzbSQedKFMH2lXwmct.png?st=2025-06-09T12%3A19%3A10Z&se=2025-06-09T14%3A19%3A10Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=cc612491-d948-4d2e-9821-2683df3719f5&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-09T13%3A19%3A10Z&ske=2025-06-10T13%3A19%3A10Z&sks=b&skv=2024-08-04&sig=DJj2zUSLn05XIpbRVYrKWMUBdwuHA9M7b02VxVKfLiE%3D",
      ];

      return images;
    } catch (error) {
      logger.error(
        "An error occured while converting text to image service : %s",
        error.message
      );

      throw error;
    }
  };
