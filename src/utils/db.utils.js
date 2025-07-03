import logger from "./logger.utils.js";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Connected to mongodb");
  } catch (error) {
    logger.error("Mongo connection error : %s", error.message, {
      stack: error.satck,
    });
  }
};

export default connectDB;
