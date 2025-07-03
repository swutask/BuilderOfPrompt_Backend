import Prompt from "../models/prompt.model.js";
import { textToImage } from "../services/openAI.js";
import { generatePromptImage } from "../services/leonardo.services.js";
import { removeFile, savePromptImage } from "../utils/file.utils.js";
import logger from "../utils/logger.utils.js";

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    const existingPrompt = await Prompt.findById("6846cbae986c0b311c240b55");

    if (!existingPrompt) {
      return res
        .status(404)
        .json({ success: false, message: "Prompt does not exist." });
    }

    const images = await textToImage(existingPrompt.prompt);

    const data = [];

    try {
      for (const image of images) {
        data.push(await savePromptImage(image, "68467996e538fc66dce8a8cf"));
      }

      existingPrompt.images = [...existingPrompt?.images, ...data];

      existingPrompt.save();

      //    [
      //     "/images/68467996e538fc66dce8a8cf/image-1749477254742.png",
      //     "/images/68467996e538fc66dce8a8cf/image-1749477264456.png",
      //     "/images/68467996e538fc66dce8a8cf/image-1749477282995.png",
      //     "/images/68467996e538fc66dce8a8cf/image-1749477307475.png"
      // ]
    } catch (error) {
      for (const file of data) {
        await removeFile(file);
      }

      throw error;
    }

    return res.status(200).json({
      success: true,
      message: "Image generated successfully",
      data,
    });
  } catch (error) {
    logger.error(
      "An error occurred while generate image controller : %s",
      error.message,
      {
        stack: error.stack,
      }
    );

    return res.status(error?.statusCode ?? 500).json({
      success: false,
      message:
        error?.message ??
        `An error occurred while generate image : ${error.message}`,
    });
  }
};

export const leonardoImageGenerate = async (req, res) => {
  try {
    const { prompt } = req.body;

    const { loggedInUser } = req;
    
    if (loggedInUser.wallet < 3) {
      return res.json({ success: false, message: 'unsufficient token' });
    }

    if (!prompt) {
      return res.json({ success: false, message: 'missing prompt' });
    }

    const response = await generatePromptImage(prompt);

    await Prompt.create({
          userId: loggedInUser?._id,
          prompt: prompt,
          generationId: response,
          type: "SAVED",
          isGenerating: true
        });
    

    return res.json({ success: true, data: response, message: "images generation placed successfully" });

  } catch (error) {
    
    return res.json({ success: false, message: 'some error occured' });
  }

}
