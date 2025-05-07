import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Create a model instance
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generatePodcastScript(topic: string): Promise<string> {
    try {
        const prompt = `Write a 2-minute podcast script on the topic: ${topic}`;

        // Use generateContentStream if you're streaming or generateContent normally
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error: any) {
        console.error("Gemini error:", error);
        console.log("gemini error" + error.message)
        throw new Error("Failed to generate podcast script");

    }
}


