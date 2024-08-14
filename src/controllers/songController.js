import SpotifyService from "../services/spotify.js";
import QueueService from "../services/queue.js";
import OpenAIService from "../services/openai.js";
import DBService from "../services/db.js";
import ClientService from "../services/client.js";

import fs from "fs";
import Throttle from "throttle";
import ffprobe from "ffprobe";
import ffprobeStatic from "ffprobe-static";
import { exec } from "child_process";
import { promisify } from "util";

class SongController {

  currentSongMetadata = null;

  async player() {
    let { path, metadata } = QueueService.popNextAudioFile() || {};

    while (true) {
      if (path) {
        if (QueueService.isAudioQueueEmpty()) {
          console.log("Queue is empty, getting more songs");
          this.getNextSong();
        }
        break;
      }
      // Wait for a second before checking the queue again
      await new Promise((resolve) => setTimeout(resolve, 1000));
      ({ path, metadata } = QueueService.popNextAudioFile() || {});
    }

    this.currentSongMetadata = metadata;
    console.log("Playing audio file", path);

    // Throttle the write stream to match the bitrate of the audio file
    const ffprobeResult = await ffprobe(path, {
      path: ffprobeStatic.path,
    });
    const bitrate = ffprobeResult.streams[0].bit_rate;
    const readable = fs.createReadStream(path);
    const throttle = new Throttle(bitrate / 8);

    throttle
      .on("data", (data) => {
        ClientService.clients.forEach((client) => client.write(data));
      })
      .on("end", () => {
        readable.close();
        fs.unlinkSync(path);
        this.player();
      });

    readable.pipe(throttle);
  }

  async submitSong(req, res) {
    const query = req.body.query;
    const track = await SpotifyService.searchTrack(query);
    if (track) {
      const success = SpotifyService.addToUserQueue(track.id);
      res.json({ success });
    } else {
      res.status(404).json({ success: false });
    }
  }

  async populateSuggestionQueue() {
    // Get recommendations based on last five played
    const lastFiveSongs = await DBService.getLastPlayedSongs(5);
    const lastFiveTrackIds = lastFiveSongs.map((track) => track.trackId);
    let suggestions = await SpotifyService.getRecommendations(lastFiveTrackIds);

    // Do not suggest songs that have been played in the last two hours
    const tooRecentlyPlayed = await DBService.getRecentlyPlayedSongs(2);
    const tooRecentlyTrackIds = tooRecentlyPlayed.map((track) => track.trackId);
    suggestions = suggestions.filter(
      (track) => !tooRecentlyTrackIds.includes(track)
    );

    // Limit to 5 suggestions
    suggestions = suggestions.slice(0, 5);
    suggestions.forEach((track) => QueueService.addToSuggestionQueue(track));
  }

  async combineAudioFiles(first, second) {
    const concatenatedAudioPath = `./audio/${new Date().getTime()}.mp3`;
    const ffmpeg = promisify(exec);
    await ffmpeg(
      `ffmpeg -i "${first}" -i "${second}" -filter_complex '[0:0][1:0]concat=n=2:v=0:a=1[out]' -map '[out]' -y "${concatenatedAudioPath}"`
    );
    fs.unlinkSync(first);
    fs.unlinkSync(second);
    return concatenatedAudioPath;
  }

  async getNextSong() {
    let nextTrackId = QueueService.popNextTrack();
    if (!nextTrackId) {
      await this.populateSuggestionQueue();
      nextTrackId = QueueService.popNextTrack();
    }

    try {
      // Fetch metadata from the database or Spotify API
      let trackMetadata = await DBService.getSongMetadata(nextTrackId);
      if (!trackMetadata) {
        let spotifyTrackData = await SpotifyService.getTrackData(nextTrackId);
        trackMetadata = await DBService.saveSongMetadata(spotifyTrackData);
      }

      // Download the track and generate an intro speech. Skip song if either fails
      const announcementText = await OpenAIService.generateSongIntro(
        trackMetadata,
        QueueService.getNextSongMetadata() || this.currentSongMetadata
      );
      const announcementAudioPath = await OpenAIService.textToSpeech(
        announcementText
      );
      const audioFilePath = await this.downloadTrack(trackMetadata.url);

      if (!audioFilePath || !announcementAudioPath) {
        this.getNextSong();
        return;
      }

      const concatenatedAudioPath = await this.combineAudioFiles(
        announcementAudioPath,
        audioFilePath
      );

      QueueService.addToAudioQueue({
        path: concatenatedAudioPath,
        metadata: trackMetadata,
      });
    } catch (error) {
      console.error("Error during song playback:", error);
    }
  }

  async downloadTrack(url) {
    const command = `spotdl download ${url} --output="./audio/"`;
    const execAsync = promisify(exec);
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error("Error downloading track:", stderr);
      return;
    }
    let fileName =
      stdout.match(/"(.*?)"/)?.[1] ||
      stdout.match(/Skipping (.*?) \(file already exists\)/)?.[1]
    fileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');

    console.log(`Downloaded track: ${fileName}.mp3`);
    return `./audio/${fileName}.mp3`;
  }
}

export default new SongController();
