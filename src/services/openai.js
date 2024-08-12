// src/services/openai.js
import axios from 'axios';

class OpenAiService {
    constructor() {
        this.baseUrl = 'https://api.openai.com/v1';
        this.apiKey = process.env.OPENAI_API_KEY;
    }

    async generateSongIntro(metadata) {
        const prompt = `Act as a radio announcer and introduce the song "${metadata.title}" by "${metadata.artist}".`;
        const response = await axios.post(`${this.baseUrl}/chat/completions`, {
            model: 'gpt-4',
            prompt: prompt,
            max_tokens: 100
        }, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        });
        console.log("Generated song intro: ", response.data.choices[0].text);
        return response.data.choices[0].text.trim();
    }

    async textToSpeech(text) {
        // Implement TTS API call here
        return 'path/to/audio/file.mp3';
    }
}

export default new OpenAiService();
