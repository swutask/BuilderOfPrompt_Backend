import {
  chatGptOptimise,
  moodBased,
  creativeSpark,
} from "../services/openAI.js";
import Prompt from "../models/prompt.model.js";
import logger from "../utils/logger.utils.js";
import { removeFile } from "../utils/file.utils.js";


export const generateChatGptResponse = async (req, res) => {
  try {
    const { prompt } = req.body;
    const { loggedInUser } = req;
    const response = await chatGptOptimise(prompt);

    console.log("ioo", response);

    const cleanedResponse = response
      .replace(/^\d+\.\s*/gm, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!response) {
      return res.json({ success: false, message: "prompt generation failed" });
    }

    await Prompt.create({
      userId: loggedInUser?._id,
      prompt: cleanedResponse,
      type: "HISTORY",
    });

    return res.json({
      success: true,
      data: cleanedResponse,
      message: "Response generated",
    });
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: "error occured" });
  }
};

export const generateMoodBasedResponse = async (req, res) => {
  try {
      const { mood, prompt } = req.body;
      
      const { loggedInUser } = req;

    const response = await moodBased(mood, prompt);

    const cleanedResponse = response
      .replace(/^\d+\.\s*/gm, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!response) {
      return res.json({ success: false, message: "prompt generation failed" });
    }

    await Prompt.create({
      userId: loggedInUser?._id,
      prompt: cleanedResponse,
      type: "HISTORY",
    });

    return res.json({
      success: true,
      data: cleanedResponse,
      message: "Response generated",
    });
  } catch (error) {
    return res.json({ success: false, message: "error occured" });
  }
};

export const generateCreativeSpark = async (req, res) => {
  try {
    const { prompt } = req.body;
    const { loggedInUser } = req;

    const response = await creativeSpark(prompt);

    const cleanedResponse = response
      .replace(/^\d+\.\s*/gm, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!response) {
      return res.json({ success: false, message: "prompt generation failed" });
    }

    await Prompt.create({
      userId: loggedInUser?._id,
      prompt: cleanedResponse,
      type: "HISTORY",
    });

    return res.json({
      success: true,
      data: cleanedResponse,
      message: "Response generated",
    });
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: "error occured" });
  }
};

export const saveResponse = async (req, res) => {
  try {
    const { loggedInUser } = req;

    const { prompt } = req.body;

    await Prompt.create({
      userId: loggedInUser?._id,
      prompt: prompt,
      type: "SAVED",
    });

    return res.json({ success: true, message: "Prompt saved successfully." });
  } catch (error) {
    logger.error(
      "An error occurred while saving prompt controller : %",
      error.message,
      error
    );
    res.status(500).json({
      success: false,
      message: `An error occured while saving prompt controller : ${error.message}.`,
    });
  }
};

export const clearHistory = async (req, res) => {
  try {
    const { loggedInUser } = req;

    await Prompt.deleteMany({ userId: loggedInUser?._id, type: "HISTORY" });

    return res
      .status(200)
      .json({ success: true, message: "History cleared successfully." });
  } catch (error) {
    logger.error(
      "An error occurred while clear history controller : %s",
      error.message,
      {
        stack: error.stack,
      }
    );

    return res.status(error?.statusCode ?? 500).json({
      success: false,
      message:
        error?.message ??
        `An error occurred while clear history controller: ${error.message}`,
    });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const { loggedInUser } = req;

    const history = await Prompt.find({
      userId: loggedInUser._id,
      type: "HISTORY",
    });

    return res.status(200).json({
      success: true,
      messahe: "History fetched successfully.",
      data: history,
    });
  } catch (error) {
    logger.error(
      "An error occurred while getting user history controller : %s",
      error.message,
      {
        stack: error.stack,
      }
    );

    return res.status(error?.statusCode ?? 500).json({
      success: false,
      message:
        error?.message ??
        `An error occurred while getting user history controller: ${error.message}`,
    });
  }
};

export const getUserSavedPrompts = async (req, res) => {
  try {
    const { loggedInUser } = req;

    const savedPrompts = await Prompt.find({
      userId: loggedInUser._id,
      type: "SAVED"
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Saved prompts fetched successfully.",
      data: savedPrompts,
    });
  } catch (error) {
    logger.error(
      "An error occurred while getting user saved prompts controller : %s",
      error.message,
      {
        stack: error.stack,
      }
    );

    return res.status(error?.statusCode ?? 500).json({
      success: false,
      message:
        error?.message ??
        `An error occurred while getting user saved prompts controller: ${error.message}`,
    });
  }
};

export const deleteSavedPrompt = async (req, res) => {
  try {
    const { promptId } = req.params;
    const { loggedInUser } = req;

    const existingPrompt = await Prompt.findOne({
      _id: promptId,
      userId: loggedInUser._id,
      type: "SAVED",
    });

    if (!existingPrompt) {
      return res
        .status(200)
        .json({ success: true, message: "Prompt does not exist." });
    }

    const prompt = await Prompt.findByIdAndDelete(promptId).lean();

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: "Prompt not found.",
      });
    }

    await Promise.all(prompt.images.map((filePath) => removeFile(filePath)));

    return res
      .status(200)
      .json({ success: true, message: "Saved prompt deleted successfully." });
    
    
  } catch (error) {
    logger.error(
      "An error occurred while deleting saved prompt controller : %s",
      error.message,
      {
        stack: error.stack,
      }
    );

    return res.status(error?.statusCode ?? 500).json({
      success: false,
      message:
        error?.message ??
        `An error occurred while deleting saved prompt controller: ${error.message}`,
    });
  }
};
