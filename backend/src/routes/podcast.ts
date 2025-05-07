// import { Router } from "express";
// import { handleGeneratePodcast } from "../controllers/geminiController";

// const router = Router();
// //@ts-ignore
// router.post("/", handleGeneratePodcast);

// export default router;

import express from 'express';
import { generatePodcastScript } from '../services/geminiService';
import { synthesizeVoice } from '../services/voiceService';

const router = express.Router();

//@ts-ignore
router.post('/generate', async (req, res) => {
    const { topic } = req.body;

    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    try {
        const script = await generatePodcastScript(topic);
        const audioPath = await synthesizeVoice(script);
        res.json({ script, audioUrl: `/audio/${audioPath}` });
        // res.json({ script });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate podcast' });
    }
});

export default router;