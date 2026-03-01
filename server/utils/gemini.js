import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Call Gemini 3.1 with a system prompt and user prompt.
 * Returns parsed JSON from the model response.
 */
export async function callGemini(systemPrompt, userPrompt) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-pro-preview',
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
    },
  });

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I will follow these instructions and return structured JSON output.' }],
      },
    ],
  });

  const result = await chat.sendMessage(userPrompt);
  const responseText = result.response.text();

  try {
    return JSON.parse(responseText);
  } catch {
    // If JSON parsing fails, try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse Gemini response as JSON');
  }
}
