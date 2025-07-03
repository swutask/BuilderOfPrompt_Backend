import Mood from "../models/mood.model.js";

export const getAllMoodOptions = async (req, res) => {
    try {
        const response = await Mood.getAllValues()

        if (!response) {
            return res.json({ success: false, message: 'No mood options found' });
        }

        return res.json(({ success: true, data: response, message: 'Mood options fetched successfully' }));
    } catch (error) {
        return res.json({ success: false, message: "Some error occcured" });
    }
};