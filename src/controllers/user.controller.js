import logger from "../utils/logger.utils.js";
import User from "../models/user.model.js";

export const verifyUser = async (req, res) => {
  try {
    const { token } = req.body;

    const existingUser = await User.findOne({ token });

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist." });
    }

    return res.status(200).json({
      success: true,
      message: "user authenticated",
    });
  } catch (error) {
    logger.error(
      "An error occurred while save user controller : %s",
      error.message,
      {
        stack: error.stack,
      }
    );

    return res.status(error?.statusCode ?? 500).json({
      success: false,
      message:
        error?.message ??
        `An error occurred while save user : ${error.message}`,
    });
  }
};

export const getMyDetails = async (req, res) => {
  try {
    const { loggedInUser } = req;

    const existingUser = await User.findById(loggedInUser._id);

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist." });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "User details fetched successfully.",
        data: existingUser,
      });
  } catch (error) {
    logger.error(
      "An error occurred while fetching my details controller : %s",
      error.message,
      {
        stack: error.stack,
      }
    );

    return res.status(error?.statusCode ?? 500).json({
      success: false,
      message:
        error?.message ??
        `An error occurred while fetching my details controller: ${error.message}`,
    });
  }
};
