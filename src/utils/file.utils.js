import logger from "./logger.utils.js";
import axios from "axios";
import fs from "fs";
import path from "path";

export const savePromptImage = async (imageUrl, userId) => {
  try {
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const directoryName = `images/${userId}`;
    const relativePath = path.join("public", directoryName);
    const fileName = `image-${Date.now()}.png`;
    const fullPath = path.join(process.cwd(), relativePath, fileName); // Absolute path

    console.log("fullpath...", fullPath);

    fs.mkdirSync(relativePath, { recursive: true });

    fs.writeFileSync(fullPath, imageResponse.data);

    console.log("return...", path.join("/", directoryName, fileName));
    return path.join("/", directoryName, fileName);
  } catch (error) {
    logger.error(
      "An error occurred while saving file utils: %s",
      error.message
    );
    throw error;
  }
};

export const removeFile = async (file) => {
  try {
    const filePath = path.resolve(`./public/${file}`);

    if (fs.existsSync(filePath)) {
      return await fs.promises.unlink(filePath);
    }

    return true;
  } catch (error) {
    throw error;
  }
};
