import dotenv from "dotenv";
import { Leonardo } from '@leonardo-ai/sdk';

dotenv.config();

const leonardo = new Leonardo({ bearerAuth: `${process.env.LEONARDO_KEY}` });



export const generatePromptImage = async (prompt) => {
    try {
        if (!prompt) {
            throw error;
        }
        

        const payload = {
            "alchemy": true,
            "height": 512,
            num_images: 2,
            prompt,
            "width": 512,
        }

        const result = await leonardo.image.createGeneration(payload);        

        const imageId = result.object.sdGenerationJob.generationId;

        return imageId;
        

    } catch (error) {
        console.log("ppp--->>",error);
        
        throw error;
    }
}