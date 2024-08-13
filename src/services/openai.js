// src/services/openai.js
import axios from "axios";
import fs from "fs";

class OpenAiService {
  constructor() {
    this.baseUrl = "https://api.openai.com/v1";
    this.apiKey = process.env.OPENAI_API_KEY;
    this.projectId = process.env.OPENAI_PROJECT_ID;
    this.organizationId = process.env.OPENAI_ORGANIZATION_ID;
  }

  async generateSongIntro(metadata) {
    const prompt = `You are a radio host at Al Radio, a Toronto-based radio station. You are about to play the song "${metadata.title}" by "${metadata.artist}". The song was released in ${metadata.releaseDate} on the album "${metadata.album}". The song's genre is ${metadata.genres}. Write an introduction for this song that captures the essence of the song and the artist's style. Be whimsical yet poignant, and make sure to engage the audience's imagination. Respond only with the text of the introduction and no extra scene-setting / emojis. Keep it to a few sentences.`;
    console.log("Prompt:", prompt);
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          messages: [{ role: "user", content: prompt }],
          model: "gpt-4o-mini",
          n: 1,
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error during song intro generation:", error.response.data);
      return "I am sorry, I cannot generate an introduction for this song.";
    }
  }

  async textToSpeech(text) {
    console.log("Converting text to speech:", text);
    try {
      const response = await axios.post(
        `${this.baseUrl}/audio/speech`,
        {
          input: text,
          model: "tts-1",
          voice: "onyx",
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
          responseType: "arraybuffer",
        }
      );
      // Save the audio file to disk
      const audioPath = `./audio/announcement.mp3`;
      fs.writeFileSync(audioPath, response.data);
      console.log("Audio file saved:", audioPath);
      return audioPath;
    } catch (error) {
      console.error("Error during text to speech conversion:", error);
      return;
    }
  }
}

export default new OpenAiService();
