// src/services/audio.js
import QueueService from "./queue.js";
import SpotifyService from "./spotify.js";
import DBService from "./db.js";
import OpenAIService from "./openai.js";
import SongController from "../controllers/songController.js";
import { exec } from "child_process";
import { promisify } from "util";

async function playNextSong() {
  // Pop the next track ID from the queue
  const nextTrackId = QueueService.popNextTrack();
  console.log("Playing next song:", nextTrackId);

  if (!nextTrackId) {
    console.warn("No songs left in the queue.");
    SongController.populateSuggestionQueue();
    return;
  }

  try {
    // Fetch metadata from the database or Spotify API
    let trackMetadata = await DBService.getSongMetadata(nextTrackId);
    if (!trackMetadata) {
      let spotifyTrackData = await SpotifyService.getTrackData(nextTrackId);
      trackMetadata = await DBService.saveSongMetadata(spotifyTrackData);
    }

    // Create an announcer message using OpenAI
    // const announcementText = await OpenAIService.generateSongIntro(trackMetadata);
    // const announcementAudioPath = await OpenAIService.textToSpeech(announcementText);
    // QueueService.addToAudioQueue(announcementAudioPath);

    // // Download the song using freyr
    // const audioFilePath = await downloadTrack(`spotify:track:${nextTrackId}`);
    // QueueService.addToAudioQueue(audioFilePath);

    // Stream the announcement and the song
    streamAudioFiles();
  } catch (error) {
    console.error("Error during song playback:", error);
  }

  // Continue playing the next song after the current one finishes
  // setTimeout(playNextSong, 0);
}

async function downloadTrack(url) {
  console.log(`Downloading track: ${url}`);
  const command = `freyr get ${url} --directory ./audio --single-bar --no-tree --no-stats`;
  const execAsync = promisify(exec);

  const { stdout } = await execAsync(command);
  const lines = stdout.split("\n");
  const collatingIndex = lines.findIndex((line) =>
    line.includes("Collating...")
  );
  const fileName =
    lines[collatingIndex + 1].split("[")[1].split("]")[0] + ".m4a";

  console.log(`Downloaded track: ${fileName}`);
  return `./audio/${fileName}`;
}

function streamAudioFiles() {
  const audioFile = QueueService.popNextAudioFile();
  if (!audioFile) return;
  console.info(`Streaming audio file: ${audioFile}`);

  streamAudioFiles();
}

export { playNextSong };
