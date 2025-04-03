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
          // Using a more accurate model for sentiment analysis
          model: "finiteautomata/bertweet-base-sentiment-analysis",
          inputs: chunk,
        });
        return output[0];
      })
    );

    // Calculate weighted scores for each sentiment
    let scoreMap = {
      POS: 0,
      NEG: 0,
      NEU: 0,
    };

    sentiments.forEach((sentiment) => {
      const { label, score } = sentiment;
      scoreMap[label] += score;
    });

    // Normalize scores by number of chunks
    Object.keys(scoreMap).forEach((key) => {
      scoreMap[key] = scoreMap[key] / sentiments.length;
    });

    // Determine final sentiment based on highest weighted score
    let finalSentiment;
    if (scoreMap.POS > scoreMap.NEG && scoreMap.POS > scoreMap.NEU) {
      finalSentiment = "POSITIVE";
    } else if (scoreMap.NEG > scoreMap.POS && scoreMap.NEG > scoreMap.NEU) {
      finalSentiment = "NEGATIVE";
    } else {
      finalSentiment = "NEUTRAL";
    }

    // Add confidence score
    const confidence = Math.max(scoreMap.POS, scoreMap.NEG, scoreMap.NEU);

    // Only return strong sentiments if confidence is high enough
    if (confidence < 0.6) {
      finalSentiment = "NEUTRAL";
    }

    return [
      {
        label: finalSentiment,
        confidence: confidence,
      },
    ];
  } catch (error) {
    console.error("Error during sentiment analysis:", error);
    throw new Error("Sentiment analysis failed");
  }
};
