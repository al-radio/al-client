import SpotifyService from '../services/spotify.js';
import QueueService from '../services/queue.js';
import OpenAIService from '../services/openai.js';
import DBService from '../services/db.js';
import ClientService from '../services/client.js';
import ProxyService from '../services/proxy.js';

import { EndableError } from '../errors.js';

import fs from 'fs';
import Throttle from 'throttle';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import { exec } from 'child_process';
import { promisify } from 'util';

class SongController {
  _writeDataToClients(data) {
    ClientService.clients.forEach(client => client.write(data));
  }

  async _getBitrateFromAudioFile(path) {
    const ffprobeResult = await ffprobe(path, {
      path: ffprobeStatic.path
    });
    return ffprobeResult.streams[0].bit_rate;
  }

  async _streamToClients(path) {
    const bitrate = await this._getBitrateFromAudioFile(path);
    const readable = fs.createReadStream(path);
    const throttle = new Throttle(bitrate / 8);

    throttle
      .on('data', data => {
        this._writeDataToClients(data);
      })
      .on('end', () => {
        readable.close();
        fs.unlinkSync(path);
        this.player();
      });

    readable.pipe(throttle);
  }

  async player() {
    let { path, metadata } = QueueService.popNextAudioFile() || {};

    do {
      if (path) {
        // Found a song, get more if needed
        if (QueueService.isAudioQueueEmpty()) {
          this.getNextSong();
        }
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      ({ path, metadata } = QueueService.popNextAudioFile() || {});
    } while (!path);

    QueueService.currentSongMetadata = metadata;
    DBService.markSongAsPlayed(metadata.trackId);
    await this._streamToClients(path);
  }

  async combineAudioFiles(first, second) {
    const concatenatedAudioPath = `./audio/combined-${new Date().getTime()}.mp3`;
    const ffmpeg = promisify(exec);
    await ffmpeg(
      `ffmpeg -i "${first}" -i "${second}" -filter_complex '[0:0][1:0]concat=n=2:v=0:a=1[out]' -map '[out]' -y "${concatenatedAudioPath}"`
    );
    fs.unlinkSync(first);
    fs.unlinkSync(second);
    return concatenatedAudioPath;
  }

  async getTrackData(trackId) {
    // Fetch metadata from the database or Spotify API
    return (await DBService.getSongMetadata(trackId)) || (await SpotifyService.getTrackData(trackId));
  }

  async gatherSongFiles(trackMetadata) {
    // Download the track and generate an intro speech. Skip song if either fails
    const audioFilePath = await this.downloadTrack(trackMetadata.url);
    const announcementText = await OpenAIService.generateSongIntro(
      trackMetadata,
      QueueService.getNextSongMetadata() || QueueService.currentSongMetadata
    );
    const announcementAudioPath = await OpenAIService.textToSpeech(announcementText);
    if (!audioFilePath || !announcementAudioPath) {
      throw new Error('Failed to download track or generate intro speech. Skipping song.');
    }

    return await this.combineAudioFiles(announcementAudioPath, audioFilePath);
  }

  async getNextSong() {
    let nextTrackId = QueueService.popNextTrack();
    if (!nextTrackId) {
      await SpotifyService.populateSuggestionQueue();
      nextTrackId = QueueService.popNextTrack();
    }

    try {
      let trackMetadata = await this.getTrackData(nextTrackId);
      const concatenatedAudioPath = await this.gatherSongFiles(trackMetadata);
      QueueService.addToAudioQueue({
        path: concatenatedAudioPath,
        metadata: trackMetadata
      });
    } catch (error) {
      console.error('Error getting next song:', error);
      if (error instanceof EndableError) {
        console.error('Ending song playback');
        return;
      }
      this.getNextSong();
    }
  }

  async downloadTrack(url, raiseError = false) {
    console.log('Downloading track from:', url);
    await ProxyService.setProxy();
    const command = `spotdl download ${url} --output="./audio/{track-id}"`;
    const execAsync = promisify(exec);

    // exec async with a timeout of 45 seconds
    try {
      await execAsync(command, { timeout: 45000 });
    } catch (error) {
      console.error('Download request timed out:', error);
    }

    const fileName = url.split('/track/')[1].split('?')[0];

    // check if the file was downloaded, if not switch proxies
    if (!fs.existsSync(`./audio/${fileName}.mp3`)) {
      ProxyService.markActiveProxyBad();
      if (raiseError) {
        throw new Error('Failed to download track twice. Skipping song.');
      }
      console.error('Failed to download track:', fileName, 'Retrying');
      return this.downloadTrack(url, true);
    }

    console.log('Downloaded track:', fileName);
    return `./audio/${fileName}.mp3`;
  }
}

export default new SongController();
