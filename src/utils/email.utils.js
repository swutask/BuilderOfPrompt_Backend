import nodemailer from "nodemailer";
import logger from "./logger.utils.js";
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = async ({
  from = `"${process.env.COMPANY_NAME}" <${process.env.SENDER_EMAIL}>`,
  to,
  subject,
  text,
  html,
  attachments
}) => {
  try {
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);

    return info?.messageId;
  } catch (error) {
    logger.error("Error sending email %s", error.message);
    throw error;
  }
};

export default sendMail;
