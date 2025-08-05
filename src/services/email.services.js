import logger from "../utils/logger.utils.js";
import sendMail from "../utils/email.utils.js";
import { existsSync, readFileSync } from "fs";
import path from "path";

export const sendWebUrlEmail = async ({ email, token }) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }

    const url = `${process.env.FRONTEND_URL}/home?token=${token}`;

    const filePath = path.resolve("./src/templates/send-weburl-template.html");

    const privacyPolicyPath = path.resolve("./public/pdfs/Junk_Journal_Studio_Refund_Policy_Legal.pdf");

    const termsOfServicePath = path.resolve("./public/pdfs/Junk_Journal_Studio_Terms_of_Service_Legal.pdf");

    const attachments = [];

    if (existsSync(privacyPolicyPath)) {
      const privacyBuffer = readFileSync(privacyPolicyPath).toString("base64");

      attachments.push({
        filename: 'Privacy-Policy.pdf',
        content: privacyBuffer,
        contentType: "application/pdf",
        contentDisposition: 'attachment; filename="Privacy- Policy.pdf"',
        encoding: "base64",
      })
    } else {
      logger.warn('Privacy policy pdf not found at :-', privacyPolicyPath);
    }

    if (existsSync(termsOfServicePath)) {
      const termsBuffer = readFileSync(termsOfServicePath).toString("base64");

      attachments.push({
        filename: 'Terms-of-Service.pdf',
        content: termsBuffer,
        contentType: "application/pdf",
        contentDisposition: 'attachment; ',
        encoding: "base64",
      })
    } else {
      logger.warn('Terms of service pdf not found at :- ', termsOfServicePath);
    }

    let html = readFileSync(filePath, "utf8");

    html = html.replace("#URL#", url);

    const mailOptions = {
      to: email,
      subject: "Builder Prompt Website URL",
      html,
      attachments,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    await sendMail(mailOptions);

    logger.info("Web URL email sent successfully to %s with %d attachments", email, attachments.length);

  } catch (error) {
    console.log("error",error?.response?.body);
    
    logger.error(
      "An error occurred while send web url email service %s",
      error.message
    );
    throw error;
  }
};
