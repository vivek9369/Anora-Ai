import axios from "axios";

export const generateFromHuggingFaceModel = async ({
    imageUrl,
     prompt,
    } : {
        imageUrl: string;
         prompt: string;
        }) => {
            try {
               const response = await axios.post("/api/generate", {imageUrl, prompt});

               return response.data.image;
            } catch (error) {
                console.error("Image generation failed:", error);
                throw error;
            }
        };