import { GoogleGenAI, Type } from "@google/genai";
import { QuizGenerationParams, Question, InputType } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (params: QuizGenerationParams): Promise<Question[]> => {
  const { type, content, count, category, fileBase64, fileMimeType } = params;

  let promptText = "";

  if (type === InputType.TOPIC) {
    promptText = `Generate ${count} multiple choice questions (MCQs) about the topic: "${content}". Category: ${category}.`;
  } else if (type === InputType.TEXT) {
    promptText = `Generate ${count} multiple choice questions (MCQs) based strictly on the following text: "${content}". Category: ${category}.`;
  } else if (type === InputType.FILE) {
    promptText = `Analyze the provided file content and generate ${count} multiple choice questions (MCQs). Category: ${category}.`;
  }

  const parts: any[] = [{ text: promptText }];

  if (type === InputType.FILE && fileBase64 && fileMimeType) {
    parts.push({
      inlineData: {
        mimeType: fileMimeType,
        data: fileBase64,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: "You are a professional quiz generator. Create valid, challenging, and accurate MCQs. Return ONLY JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A unique identifier (e.g., 'q1')" },
              questionText: { type: Type.STRING, description: "The question stem" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Exactly 4 options"
              },
              correctAnswer: { type: Type.STRING, description: "The correct option text (must match one of the options exactly)" },
              explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" }
            },
            required: ["id", "questionText", "options", "correctAnswer"]
          }
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text) as Question[];
      return result;
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate quiz. Please try again.");
  }
};