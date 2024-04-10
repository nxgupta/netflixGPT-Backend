const { default: axios } = require("axios");

const chatWithGpt = async (req, res, next) => {
  try {
    let { gptQuery } = req.body;
    let prompt = `Act as a movie search assistant and provide up to 5 unique movie names related to: ${gptQuery}. List the names as comma-separated values. For example: 'Krrish, Apne, Mohabbatein, Gadar.', returned value should strictly follow the pattern told in example`;
    let response = await ChatWithGpt(prompt);
    res.status(200).json({
      success: true,
      result: response.data.choices[0].message.content,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Something went wrong, Please try again later",
    });
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ChatWithGpt = async (prompt, retryCount = 3) => {
  const maxRetries = retryCount;
  const retryDelay = 1000; // 1 second delay between retries

  while (retryCount > 0) {
    try {
      let response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GPT_API}`,
          },
        }
      );

      // If successful, return the response
      return response;
    } catch (error) {
      // If it's a 429 error (rate limit exceeded) and we have retries left, retry
      if (error.response && error.response.status === 429 && retryCount > 0) {
        console.log(
          `Rate limit exceeded. Retrying in ${retryDelay / 1000} seconds...`
        );
        await delay(retryDelay);
        retryCount--;
      } else {
        // For other errors or when retries are exhausted, throw the error
        throw error;
      }
    }
  }

  // If retries are exhausted, throw an error or handle it as needed
  throw new Error("Exhausted all retry attempts.");
};

module.exports = { chatWithGpt };
