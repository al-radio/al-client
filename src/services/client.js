import SpotifyService from './spotify.js';
import QueueService from './queue.js';
import DBService from './db.js';
import SongController from '../controllers/songController.js';

import path from 'path';
import { EventEmitter } from 'events';
class ClientService extends EventEmitter {
  // eslint-disable-next-line constructor-super
  constructor() {
    super();
    this.clients = new Set();
  }

  _clientifyMetadata(metadata) {
    return {
      trackId: metadata.trackId,
      title: metadata.title,
      artist: metadata.artist,
      album: metadata.album,
      url: metadata.url,
      artUrl: metadata.artUrl
    };
  }

  _hasActiveClients() {
    return this.clients.size > 0;
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
    this.emit('clientConnected', res);
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
    trackId = track.trackId;
    console.log('Got user suggested track:', track.title, track.artist);

    if (!track.trackId) {
      res.status(404).json({ success: false, message: 'Song not found' });
      return;
    }

    if (QueueService.isUserQueueFull()) {
      res.status(400).json({ message: 'User queue is full.' });
      console.log('User queue is full');
      return false;
    }

    if (QueueService.userQueueHasTrack(trackId) || QueueService.audioQueueHasTrack(trackId)) {
      res.status(400).json({ message: 'Song is already in the queue.' });
      console.log('Song is already in the queue');
      return false;
    }
    // check that it hasnt been played recently
    if (await DBService.hasSongBeenPlayedRecently(trackId)) {
      res.status(400).json({ message: 'Song has been played too recently.' });
      console.log('Song has been played recently');
      return false;
    }

    await QueueService.addToUserQueue(trackId);
    res.json({ success: true });
  }

  async getCurrentSongMetadata(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendMetadata = metadata => {
      res.write(`data: ${JSON.stringify(metadata)}\n\n`);
    };
    sendMetadata(this._clientifyMetadata(SongController.currentSongMetadata));

    SongController.on('currentSongMetadataUpdated', metadata => {
      sendMetadata(this._clientifyMetadata(metadata));
    });

    req.on('close', () => {
      SongController.off('currentSongMetadataUpdated', sendMetadata);
      res.end();
    });
  }

  async getSongHistory(req, res) {
    const songHistory = await DBService.getLastPlayedSongs(10);

    // Do not send the current song in the history
    const currentTrackId = SongController.currentSongMetadata?.trackId;
    if (songHistory.length && songHistory[0].trackId === currentTrackId) {
      songHistory.shift();
    }
    const clientifiedHistory = songHistory.map(song => this._clientifyMetadata(song));
    res.json(clientifiedHistory);
  }
}

export default new ClientService();
