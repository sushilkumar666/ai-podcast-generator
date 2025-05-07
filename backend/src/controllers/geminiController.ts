import { Request, Response } from "express";
import { generatePodcastScript } from "../services/geminiService";

export async function handleGeneratePodcast(req: Request, res: Response) {
    const { topic } = req.body;

    if (!topic || topic.trim() === "") {
        return res.status(400).json({ error: "Podcast topic is required." });
    }

    try {
        const script = await generatePodcastScript(topic);
        return res.status(200).json({ script });
    } catch (error: any) {
        console.error("Gemini error:", error.message);
        return res.status(500).json({ error: "Failed to generate script." });
    }
}
