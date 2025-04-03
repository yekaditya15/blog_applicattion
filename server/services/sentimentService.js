import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export const analyzeSentiment = async (text) => {
  try {
    // Split long text into chunks of 500 characters
    const chunks = text.match(/.{1,500}/g) || [text];

    // Analyze sentiment for each chunk
    const sentiments = await Promise.all(
      chunks.map(async (chunk) => {
        const output = await client.textClassification({
          // Using a more robust model for longer texts
          model: "nlptown/bert-base-multilingual-uncased-sentiment",
          inputs: chunk,
          provider: "hf-inference",
        });
        return output[0];
      })
    );

    // Aggregate results
    const averageScore =
      sentiments.reduce((acc, curr) => {
        // Convert 1-5 star rating to sentiment
        const score = parseInt(curr.label[0]);
        return acc + score;
      }, 0) / sentiments.length;

    // Convert average score to sentiment label
    let finalSentiment;
    if (averageScore >= 4) {
      finalSentiment = "POSITIVE";
    } else if (averageScore <= 2) {
      finalSentiment = "NEGATIVE";
    } else {
      finalSentiment = "NEUTRAL";
    }

    return [{ label: finalSentiment }];
  } catch (error) {
    console.error("Error during sentiment analysis:", error);
    throw new Error("Sentiment analysis failed");
  }
};
