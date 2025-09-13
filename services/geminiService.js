// services/geminiService.js - Gemini AI Chat Service
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyCrLbD4uEqyUIMQobVwOngjvJgVKXDI6Pg';

class GeminiChatService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.chatSession = null;
    this.initialized = false;
  }

  // Initialize the chat session with SAI-specific context
  async initializeChat() {
    if (this.initialized) return;

    const context = `
    You are SAI Assistant, an AI helper for the SAI-Vision app - Sports Authority of India's official talent discovery platform. 

    Your role:
    - Help users with questions about sports, training, and SAI programs
    - Provide information about the SAI-Vision app features
    - Give sports-related advice and motivation
    - Answer questions about SAI selection process, academy admissions, and sports careers
    - Be encouraging and supportive to aspiring athletes
    
    SAI-Vision App Features:
    - AI-powered performance analysis for 10+ sports
    - Video recording and technique analysis
    - Official submission to SAI for talent scouting
    - Score-based evaluation with 75+ threshold for SAI eligibility
    - Sports include: Athletics, Football, Cricket, Badminton, Basketball, Swimming, Hockey, Tennis, Boxing, Wrestling
    
    Always:
    - Be professional but friendly
    - Focus on sports and fitness topics
    - Encourage users to pursue their sports dreams
    - Mention SAI programs and opportunities when relevant
    - Keep responses concise and helpful
    - If asked about non-sports topics, politely redirect to sports/fitness
    
    Start conversations with enthusiasm about sports and SAI opportunities.
    `;

    try {
      this.chatSession = this.model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: context }]
          },
          {
            role: "model",
            parts: [{ text: "Hello! I'm SAI Assistant, your personal guide for the SAI-Vision platform! 🏆 I'm here to help you with everything related to sports, training, and your journey with the Sports Authority of India. Whether you have questions about our app features, need sports advice, or want to learn about SAI programs, I'm ready to assist! How can I help you achieve your sports dreams today?" }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing Gemini chat:', error);
      throw error;
    }
  }

  // Send a message and get response
  async sendMessage(message) {
    try {
      if (!this.initialized) {
        await this.initializeChat();
      }

      const result = await this.chatSession.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      
      // Fallback responses for common errors
      if (error.message?.includes('API key')) {
        return "I'm having trouble connecting right now. Please check your internet connection and try again.";
      } else if (error.message?.includes('quota')) {
        return "I'm experiencing high demand right now. Please try again in a few moments.";
      } else {
        return "I'm sorry, I'm having technical difficulties. Please try asking your question again.";
      }
    }
  }

  // Get predefined quick responses for common queries
  getQuickResponses() {
    return [
      {
        id: 1,
        text: "How does SAI-Vision work?",
        icon: "help-circle"
      },
      {
        id: 2,
        text: "What sports can I test?",
        icon: "fitness"
      },
      {
        id: 3,
        text: "SAI selection criteria?",
        icon: "trophy"
      },
      {
        id: 4,
        text: "Training tips for beginners",
        icon: "school"
      },
      {
        id: 5,
        text: "SAI academy programs",
        icon: "home"
      },
      {
        id: 6,
        text: "How to improve my score?",
        icon: "trending-up"
      }
    ];
  }

  // Reset chat session
  async resetChat() {
    this.chatSession = null;
    this.initialized = false;
    await this.initializeChat();
  }
}

export default new GeminiChatService();