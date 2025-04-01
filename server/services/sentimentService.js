import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create Hugging Face Inference Client with your API key
const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

// Sentiment analysis function
export const analyzeSentiment = async (text) => {
  try {
    const output = await client.textClassification({
      model: "finiteautomata/bertweet-base-sentiment-analysis", // Use BERTweet model
      inputs: text, // Text input to analyze
      provider: "hf-inference",
    });

    return output; // Return the sentiment analysis result
  } catch (error) {
    console.error("Error during sentiment analysis:", error);
    throw new Error("Sentiment analysis failed");
  }
};
