/**
 * AI Doctor Chat Service
 * Handles communication with the AI backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const aiService = {
  /**
   * Send a chat message to the AI doctor
   * @param {string} message - User message
   * @param {string} conversationId - ID of the conversation
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} AI response
   */
  async sendMessage(message, conversationId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  /**
   * Get conversation history
   * @param {string} conversationId - ID of the conversation
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Conversation data with messages
   */
  async getConversation(conversationId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
      throw error;
    }
  },

  /**
   * Get all user conversations
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of conversations
   */
  async getConversations(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      throw error;
    }
  },

  /**
   * Create a new conversation
   * @param {string} title - Conversation title
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} New conversation data
   */
  async createConversation(title, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  },

  /**
   * Delete a conversation
   * @param {string} conversationId - ID of the conversation
   * @param {string} token - Authentication token
   * @returns {Promise<void>}
   */
  async deleteConversation(conversationId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      throw error;
    }
  },

  /**
   * Send a guest message (without authentication)
   * For limited AI responses in guest mode
   * @param {string} message - User message
   * @returns {Promise<Object>} AI response
   */
  async sendGuestMessage(message) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send guest message:', error);
      throw error;
    }
  },
};
