import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export const generateSummary = async (text) => {
  try {
    const response = await client.summarization({
      model: "facebook/bart-large-cnn",
      inputs: text,
      parameters: {
        max_length: 130,
        min_length: 30,
        do_sample: false,
      },
    });

    return response.summary_text;
  } catch (error) {
    console.error("Summarization error:", error);
    throw new Error("Failed to generate summary");
  }
};
