/**
 * PDF API functions for interacting with the AI workflow via webhook
 *
 * Environment Variables Required:
 * - NEXT_PUBLIC_N8N_WEBHOOK_URL: The n8n webhook URL for AI chat functionality
 */
const pdfAPI = {
  /**
   * Send a message to the AI workflow webhook and get a response
   * @param {string} message - The user's message/question
   * @param {string} selectedMonth - The selected month for context
   * @returns {Promise<Object>} - AI response from the workflow
   */
  async askQuestion(message, selectedMonth) {
    try {
      const formattedInput = `for ${selectedMonth} ${message}`;
      const requestBody = {
        sessionId: `session_${Date.now()}`,
        action: "sendMessage",
        chatInput: formattedInput,
      };

      console.log("Sending request to webhook:", requestBody);

      const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Webhook response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Webhook response data:", data);
      return data;
    } catch (error) {
      console.error("Error calling AI workflow webhook:", error);

      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Network error: Unable to connect to AI service. Please check your internet connection and try again."
        );
      } else {
        throw new Error(`Failed to get AI response: ${error.message}`);
      }
    }
  },
};

export default pdfAPI;