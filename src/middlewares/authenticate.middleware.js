import User from "../models/user.model.js";

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header("token");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access token required." });
    }

    const existingUser = await User.findOne({ token });

    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token." });
    }

    req.loggedInUser = existingUser;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while validating the token.",
      });
  }
};

export default authenticateToken;
