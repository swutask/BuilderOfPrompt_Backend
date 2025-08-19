import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./utils/db.utils.js";
import logger from "./utils/logger.utils.js";
import https from "https";
import fs from "fs";
import path from "path";
import { sendWebUrlEmail } from "./services/email.services.js";

dotenv.config();

const PORT = process.env.PORT ?? 3000;

const sslOptions = {
  key: fs.readFileSync(
    path.resolve("./ssl_certificates/builder-of-prompt.pem")
  ),
  cert: fs.readFileSync("./ssl_certificates/builder-of-prompt.crt"),
  ca: fs.readFileSync("./ssl_certificates/builder-of-prompt.ca-bundle"),
};

const httpsServer = https.createServer(sslOptions, app);

(async () => {
  try {
    await connectDB();

    httpsServer.listen(PORT, (req, res) => {
      logger.info(`Server is running on port ${PORT}`);
    });

    // await sendWebUrlEmail({
    //   email: "spencer@thedemoapp.com",
    //   token: "token",
    // });
    // console.log("send..");
  } catch (error) {
    logger.error("Error establishing connection: %s", error.message, {
      stack: error.stack,
    });
  }
})();
