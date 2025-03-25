import axios from "axios";

// Analyze the sentiment of the provided text
export const analyzeSentiment = async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res
      .status(400)
      .json({ message: "Text is required for sentiment analysis" });
  }

  try {
    // Use the AI sentiment analysis API
    const response = await axios.post("AI_SENTIMENT_API_URL", { text });

    // Assuming the response contains a sentiment value
    const sentiment = response.data.sentiment; // Adjust this based on the actual API response

    res.json({ sentiment });
  } catch (err) {
    res.status(500).json({
      message: "Error with sentiment analysis API",
      error: err.message,
    });
  }
};
