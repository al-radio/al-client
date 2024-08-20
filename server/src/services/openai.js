import axios from "axios";
import fs from "fs";

class OpenAiService {
  constructor() {
    this._baseUrl = "https://api.openai.com/v1";
    this._apiKey = process.env.OPENAI_API_KEY;
    this._chatHistory = [];
    this._systemPrompt = `
    Your name is Al. You are a radio host at Al Radio, a Toronto-based radio station.
    Your task is to introduce the current song in a variety of ways.
    You can be funny, serious, or anything in between.

    When crafting the introduction, maybe incorporate
    elements such as puns related to the song or artist, fun facts,
    or even a fabricated personal anecdote, but these are not required.
    If you do include one, make sure it's odd. It should be considered
    weird that a radio announcer would say something like that. Like
    self-deprecating humor, or a really really bad pun.

    If there's a previous song, provide a transition between the two. Either,
    a quick one, or a more detailed one contrasting them or connecting them.

    Vary your responses to avoid repeating phrases or tones,
    and make each introduction unique. You do not have to be consistent with tone.

    Important: Ensure each introduction is only a few sentences long. So all the
    jokes, anecdotes, and facts should be concise.

    Important: Be conversational. You're talking to a listener, not reading a script.
    This includes using slang, contractions, making mistakes, and being casual.

    Example of a short, funny fabricated anecdote: "I remember the first time I heard this song.
    I was eating cereal. Fascinating."

    Example of a short, interesting fact: "Did you know that the artist of this song
    was born at a very young age? Incredible."

    Example of a short joke: "The album name is 'yes. yes. yes. yes. yes' by Hunny. What is this,
    the yes convention? I'm here all week."
    `;
  }

  _getTodaysDateAndTimeEST() {
    const date = new Date();
    date.setHours(date.getHours() - 4);
    return date.toLocaleString("en-US", { timeZone: "America/New_York" });
  }

  _generateUserPrompt(thisSongMetadata, previousSongMetadata) {
    const currentSongPrompt = `
    Current song:
    - Title: ${thisSongMetadata.title}
    - Artist: ${thisSongMetadata.artist}
    - Album: ${thisSongMetadata.album}
    - Genres: ${thisSongMetadata.genres.join(", ")}
    - Release date: ${thisSongMetadata.releaseDate}`;

    const previousSongPrompt = previousSongMetadata.title
      ? `
    Previous song:
    - Title: ${previousSongMetadata.title}
    - Artist: ${previousSongMetadata.artist}
    - Album: ${previousSongMetadata.album}
    - Genres: ${previousSongMetadata.genres.join(", ")}
    - Release date: ${previousSongMetadata.releaseDate}`
      : "";

    return `${currentSongPrompt}\n\n${previousSongPrompt}`;
  }

  async generateSongIntro(thisSongMetadata, previousSongMetadata) {
    if (!thisSongMetadata.title) {
      throw new Error("Missing song metadata");
    }

    try {
      const userPrompt = this._generateUserPrompt(
        thisSongMetadata,
        previousSongMetadata,
      );
      const response = await axios.post(
        `${this._baseUrl}/chat/completions`,
        {
          messages: [
            { role: "system", content: this._systemPrompt },
            ...this._chatHistory,
            { role: "user", content: userPrompt },
          ],
          model: "gpt-4o-mini",
          n: 1,
          max_tokens: 200,
          frequency_penalty: 0.6,
          presence_penalty: 0.6,
        },
        {
          headers: {
            Authorization: `Bearer ${this._apiKey}`,
          },
        },
      );
      const songIntro = response.data.choices[0].message.content;
      this._addToChatHistory(userPrompt, songIntro);
      return songIntro;
    } catch (error) {
      throw new Error("Failed to generate song intro:", error);
    }
  }

  _addToChatHistory(userPrompt, songIntro) {
    this._chatHistory.push({ role: "user", content: userPrompt });
    this._chatHistory.push({ role: "assistant", content: songIntro });
    if (this._chatHistory.length % 2 > 5) {
      this._chatHistory.shift();
    }
  }

  async textToSpeech(text) {
    console.log("Converting text to speech:", text);
    try {
      const response = await axios.post(
        `${this._baseUrl}/audio/speech`,
        {
          input: text,
          model: "tts-1",
          voice: "fable",
        },
        {
          headers: {
            Authorization: `Bearer ${this._apiKey}`,
          },
          responseType: "arraybuffer",
        },
      );
      const audioPath = `./audio/${Date.now()}.mp3`;
      fs.writeFileSync(audioPath, response.data);
      return audioPath;
    } catch (error) {
      throw new Error("Failed to convert text to speech:", error);
    }
  }
}

export default new OpenAiService();
