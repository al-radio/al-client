import SpotifyService from './spotify.js';
import QueueService from './queue.js';
import DBService from './db.js';
import SongController from '../controllers/songController.js';

import path from 'path';
class ClientService {
  constructor() {
    this.clients = new Set();
  }

  _clientifyMetadata(metadata) {
    return {
      title: metadata.title,
      artist: metadata.artist,
      album: metadata.album,
      url: metadata.url,
      artUrl: metadata.artUrl
    };
  }

  serveWebpage(req, res) {
    res.sendFile('index.html', { root: path.join(process.cwd(), 'public') });
  }

  addClientToStream(req, res) {
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      Connection: 'keep-alive'
    });

    this.clients.add(res);
    console.log('New client connected to stream');
    res.on('close', () => {
      this.clients.delete(res);
      console.log('Client disconnected from stream');
    });
  }

  async submitSong(req, res) {
    const query = req.body.query;
    if (!query) {
      return res.status(400).json({ message: 'Invalid Request. Expected 1 parameter "query".' });
    }

    let trackId;
    if (query.includes('spotify.com/track/')) {
      trackId = query.split('/').pop();
    } else if (/^[a-zA-Z0-9]{22}$/.test(query)) {
      trackId = query;
    }
    const track = trackId ? await SpotifyService.getTrackData(trackId) : await SpotifyService.searchTrack(query);

    console.log('Got user suggested track:', track.title, track.artist);

    if (track) {
      // TODO: Check if the song has been played recently or if it is already in the user queue.
      const success = QueueService.addToUserQueue(track.trackId);
      res.json({ success });
    } else {
      res.status(404).json({ success: false });
    }
  }

  async getCurrentSongMetadata(req, res) {
    const metadata = SongController.currentSongMetadata;
    if (!metadata) {
      return res.status(500).json({ message: 'No song is currently playing' });
    }
    res.json(this._clientifyMetadata(metadata));
  }

  async getSongHistory(req, res) {
    const songHistory = await DBService.getLastPlayedSongs(10, SongController.currentSongMetadata?.trackId);
    const reducedHistory = songHistory.map(song => this._clientifyMetadata(song));
    // remove current song from history
    if (reducedHistory.length && reducedHistory[0] === SongController.currentSongMetadata) {
      reducedHistory.shift();
    }
    res.json(reducedHistory);
  }
}

export default new ClientService();
