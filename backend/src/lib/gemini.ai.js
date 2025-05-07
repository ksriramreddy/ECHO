import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const askGemini = async (prompt ,past) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash', 
    });

    const result = await model.generateContent(past.join() + prompt );
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to fetch response from Gemini');
  }
};
