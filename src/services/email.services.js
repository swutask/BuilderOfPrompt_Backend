import logger from "../utils/logger.utils.js";
import sendMail from "../utils/email.utils.js";
import fs from "fs";
import path from "path";

export const sendWebUrlEmail = async ({ email, token }) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }

    const url = `${process.env.FRONTEND_URL}/home?token=${token}`;

    const filePath = path.resolve("./src/templates/send-weburl-template.html");

    let html = fs.readFileSync(filePath, "utf8");

    html = html.replace("#URL#", url);

    const mailOptions = {
      to: email,
      subject: "Builder Prompt Website URL",
      html,
    };

    await sendMail(mailOptions);
  } catch (error) {
    logger.error(
      "An error occurred while send web url email service %s",
      error.message
    );
    throw error;
  }
};
