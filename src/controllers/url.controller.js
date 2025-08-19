import User from "../models/user.model.js";
import logger from '../utils/logger.utils.js';

export const getLink = async (req, res) => {
    try {
        const { email } = req.params;

        console.log("email",  email);
        

        const user = await User.findOne({email});
        console.log("kk", user);
        

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            })
        };

        const token = user?.token;
        

        const link = `https://app.buildersofprompt.com/home?token=${token}`;

        return res.status(200).json({
            success: true,
            message: 'Link fetched successfully',
            link 
        });

    } catch (error) {
        logger.error(
            "An error occurred while getting link : %s",
            error.message,
            {
                stack: error.stack,
            }
        );

        return res.status(error?.statusCode ?? 500).json({
            success: false,
            message:
                error?.message ??
                `An error occurred while getting link : ${error.message}`,
        });
    }
}