import sgMail from "@sendgrid/mail";
import logger from "./logger.utils.js";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async ({ to, subject, text, html, attachments }) => {
  try {
    const msg = {
      to,
      from: process.env.SENDER_EMAIL,
      subject,
      text,
      html,
      attachments,  // Optional
    };

    const response = await sgMail.send(msg);
    return response[0]?.statusCode;

  } catch (error) {

    logger.error("Error sending email %s", error?.message);
    throw error;
  }
};

export default sendMail;







// import nodemailer from "nodemailer";
// import logger from "./logger.utils.js";
// import dotenv from "dotenv";
// dotenv.config();

// let transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: process.env.MAIL_PORT,
//   secure: true,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASSWORD,
//   },
// });

// const sendMail = async ({
//   from = `"${process.env.COMPANY_NAME}" <${process.env.SENDER_EMAIL}>`,
//   to,
//   subject,
//   text,
//   html,
//   attachments
// }) => {
//   try {
//     const mailOptions = {
//       from,
//       to,
//       subject,
//       text,
//       html,
//       attachments
//     };

//     const info = await transporter.sendMail(mailOptions);

//     return info?.messageId;
//   } catch (error) {
//     logger.error("Error sending email %s", error.message);
//     throw error;
//   }
// };

// export default sendMail;
