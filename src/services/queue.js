import { EventEmitter } from 'events';

class QueueService extends EventEmitter {
  constructor() {
    super();
    // Format: ["trackId1", "trackId2", ...]
    this.userQueue = [];
    // Format: ["trackId1", "trackId2", ...]
    this.suggestionQueue = [];
    // Format: [{path: "path/to/audio/file", metadata: {}}]
    this.audioQueue = [];
    this.numSongsToPreload = 2;
  }

  async addToUserQueue(trackId) {
    this.userQueue.push(trackId);
    this.suggestionQueue = [];
    console.log('Added trackId', trackId, 'to user queue');
  }

  addToSuggestionQueue(trackId) {
    if (this.suggestionQueue.length < 5) {
      this.suggestionQueue.push(trackId);
      console.log('Added trackId', trackId, 'to suggestion queue');
      return true;
    }
    return false;
  }

  popNextTrack() {
    return this.userQueue.length ? this.userQueue.shift() : this.suggestionQueue.shift();
  }

  addToAudioQueue(audioFile) {
    console.log('Added audio file', audioFile.metadata?.title, ' - ', audioFile.metadata?.artist, 'to audio queue');
    this.audioQueue.push(audioFile);
    this.emit('songQueued');
  }

  popNextAudioFile() {
    const file = this.audioQueue.shift();
    if (this.doesAudioQueueNeedFilling()) {
      this.emit('audioQueueNeedsFilling');
    }
    return file;
  }

  doesAudioQueueNeedFilling() {
    return this.audioQueue.length < this.numSongsToPreload;
  }

  isAudioQueueEmpty() {
    return this.audioQueue.length === 0;
  }

  getNextSongMetadata() {
    return this.audioQueue[this.audioQueue.length - 1]?.metadata;
  }

  isUserQueueFull() {
    return this.userQueue.length >= 100;
  }

  userQueueHasTrack(trackId) {
    return this.userQueue.includes(trackId);
  }

  audioQueueHasTrack(trackId) {
    return this.audioQueue.some(audioFile => audioFile.metadata.trackId === trackId);
  }
}

export default new QueueService();
