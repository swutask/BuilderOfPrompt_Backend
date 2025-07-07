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

    const privacyPolicyPath = path.resolve("./public/pdfs/Junk_Journal_Studio_Refund_Policy_Legal.pdf");

    const termsOfServicePath = path.resolve("./public/pdfs/Junk_Journal_Studio_Terms_of_Service_Legal.pdf");

    const attachments = [];

    if (fs.existSync(privacyPolicyPath)) {
      attachments.push({
        filename: 'Privacy-Policy.pdf',
        path: privacyPolicyPath,
        contentType: "application/pdf",
        contentDisposition: "attachment",
        encoding: "base64",
        cid: "privacy-policy"
      })
    } else {
      logger.warn('Privacy policy pdf not found at :-', privacyPolicyPath);
    }

    if (fs.existSync(termsOfServicePath)) {
      attachments.push({
        filename: 'Terms-of-Service.pdf',
        path: termsOfServicePath,
        contentType: "application/pdf",
        contentDisposition: "attachment",
        encoding: "base64",
        cid: "terms-of-service"
      })
    } else {
      logger.warn('Terms of service pdf not found at :- ', termsOfServicePath);
    }

    let html = fs.readFileSync(filePath, "utf8");

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
    logger.error(
      "An error occurred while send web url email service %s",
      error.message
    );
    throw error;
  }
};
