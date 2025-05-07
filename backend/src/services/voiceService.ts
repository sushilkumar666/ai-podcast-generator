import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export async function synthesizeVoice(text: string): Promise<string> {
    try {
        const url = 'https://api.deepgram.com/v1/speak?model=aura-asteria-en';
        const filename = `audio-${Date.now()}.mp3`;
        const filePath = path.resolve(__dirname, '../../public/audio', filename);

        // Split into 500-char chunks (or sentences for cleaner cuts)
        const chunks = text.match(/.{1,500}(\.|\?|!|$)/g) || [];

        const audioBuffers = [];

        for (const chunk of chunks) {
            const response = await axios.post(
                url,
                { text: chunk },
                {
                    headers: {
                        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'arraybuffer',
                }
            );

            audioBuffers.push(Buffer.from(response.data));
        }

        // Merge all buffers and write to file
        const finalAudio = Buffer.concat(audioBuffers);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, finalAudio);

        return filename;
    } catch (error: any) {
        console.error("synthesize voice error", error.message);
        return "synthesize-error";
    }
}
