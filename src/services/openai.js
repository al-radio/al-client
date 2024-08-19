import axios from 'axios';
import fs from 'fs';

class OpenAiService {
  constructor() {
    this._baseUrl = 'https://api.openai.com/v1';
    this._apiKey = process.env.OPENAI_API_KEY;
    this._pastSongIntros = [];
  }

  async generateSongIntro(thisSongMetadata, previousSongMetadata) {
    if (!thisSongMetadata.title) {
      throw new Error('Missing song metadata');
    }

    console.log('Generating song intro for', thisSongMetadata?.title);
    console.log('Previous song metadata:', previousSongMetadata?.title);
    let prompt = `You are a radio host at Al Radio, a Toronto-based radio station.
     You are about to play the song "${thisSongMetadata.title}" by "${thisSongMetadata.artist}".
      The song was released in ${thisSongMetadata.releaseDate} on the album "${thisSongMetadata.album}".
       The song's genre is ${thisSongMetadata.genres}. Write an introduction for this song as someone who had an energetic emotional bond to music.
       Respond only with the text of the introduction and no extra scene-setting / emojis. Keep it to a few sentences.`;

    if (previousSongMetadata.title) {
      prompt += `\n\nYou had previously played "${previousSongMetadata.title}" by "${previousSongMetadata.artist}"
        of the album "${previousSongMetadata.album} with genres ${previousSongMetadata.genres}. Provide a smooth
        transition between the previous song and the upcoming one, noting any similarities or contrasts in style, genre, or mood.\n\n
        Ensure your response varies from your previous messages, including method of introduction, transition, and tone.`;
    }

    try {
      const response = await axios.post(
        `${this._baseUrl}/chat/completions`,
        {
          messages: [...this._pastSongIntros, { role: 'user', content: prompt }],
          model: 'gpt-4o-mini',
          n: 1,
          max_tokens: 200,
          frequency_penalty: 1.0
        },
        {
          headers: {
            Authorization: `Bearer ${this._apiKey}`
          }
        }
      );
      const songIntro = response.data.choices[0].message.content;
      this._addIntroToPastIntros(songIntro);
      return songIntro;
    } catch (error) {
      throw new Error('Failed to generate song intro:', error);
    }
  }

  _addIntroToPastIntros(intro) {
    const newIntro = { role: 'assistant', content: intro };
    this._pastSongIntros.push(newIntro);
    if (this._pastSongIntros.length > 10) {
      this._pastSongIntros.shift();
    }
  }

  async textToSpeech(text) {
    console.log('Converting text to speech:', text);
    try {
      const response = await axios.post(
        `${this._baseUrl}/audio/speech`,
        {
          input: text,
          model: 'tts-1',
          voice: 'fable'
        },
        {
          headers: {
            Authorization: `Bearer ${this._apiKey}`
          },
          responseType: 'arraybuffer'
        }
      );
      const audioPath = `./audio/${Date.now()}.mp3`;
      fs.writeFileSync(audioPath, response.data);
      return audioPath;
    } catch (error) {
      throw new Error('Failed to convert text to speech:', error);
    }
  }
}

export default new OpenAiService();
