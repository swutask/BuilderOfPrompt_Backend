import BuilderOption from "../models/builderOptions.model.js";
import logger from "../utils/logger.utils.js";

export const getBuilderOptions = async (req, res) => {
  try {
    const { loggedInUser } = req;

    const builderOptions = await BuilderOption.filteredWithUserId(
      loggedInUser?._id
    );

    return res.status(200).json({
      success: true,
      message: "Builder options fetched successfully.",
      data: builderOptions,
    });
  } catch (error) {
    logger.error(
      "An error occurred while getting builder options controller : %s",
      error.message,
      {
        stack: error.stack,
      }
    );

    return res.status(error?.statusCode ?? 500).json({
      success: false,
      message:
        error?.message ??
        `An error occurred while getting builder options: ${error.message}`,
    });
  }
};

export const addBuilderOptions = async (req, res) => {
  try {
    const { loggedInUser } = req;
    const builderOptionsBody = req.body;

    for (const [modeName, values] of Object.entries(builderOptionsBody)) {
      const builderOption = await BuilderOption.findOne({
        "modes.name": modeName,
      });

      const mode = builderOption.modes.find((m) => m.name === modeName);

      if (!mode) continue;

      const valuesArray = values.replace(/^,+|,+$/g, "").split(",");

      for (const value of valuesArray) {
        const exists = mode.values.some(
          (v) =>
            v.value === value.trim() &&
            (v.type === "DEFAULT" ||
              (v.type === "USER" &&
                v?.userId?.toString() === loggedInUser._id?.toString()))
        );

        if (!exists) {
          mode.values.push({
            value: value.trim(),
            type: "USER",
            userId: loggedInUser._id,
          });
        }
      }

      await builderOption.save();
    }

    return res.status(200).json({
      success: true,
      message: "Builder options added successfully.",
    });
  } catch (error) {
    logger.error(
      "An error occurred while adding builder options controller : %s",
      error.message,
      {
        stack: error.stack,
      }
    );

    return res.status(error?.statusCode ?? 500).json({
      success: false,
      message:
        error?.message ??
        `An error occurred while adding builder options: ${error.message}`,
    });
  }
};

export const getUserOptions = async (req, res) => {
  try {
    const { loggedInUser } = req;

    const builderOptions = await BuilderOption.onlyUserValues(
      loggedInUser?._id
    );

    return res.status(200).json({
      success: true,
      message: "Builder options fetched successfully.",
      data: builderOptions,
    });
  } catch (error) {
    logger.error(
      "An error occurred while getting builder options controller : %s",
      error.message,
      {
        stack: error.stack,
      }
    );

    return res.status(error?.statusCode ?? 500).json({
      success: false,
      message:
        error?.message ??
        `An error occurred while getting builder options: ${error.message}`,
    });
  }
};

export const deleteUserSetting = async (req, res) => {
  try {

    const { loggedInUser } = req;

    const userId = loggedInUser._id;

    const deleted = await BuilderOption.deleteUserValues(userId);

    return res.status(200).json({
      success: true,
      message: 'Values deleted successfully'
    })
  } catch (error) {
    return res.json({
      success: false,
      message:
        error?.message ??
        `An error occurred while deleting builder options: ${error.message}`,
    })
  }
};
