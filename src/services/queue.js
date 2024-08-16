// src/services/queue.js
class QueueService {
  constructor() {
    // Format: ["trackId1", "trackId2", ...]
    this.userQueue = [];
    // Format: ["trackId1", "trackId2", ...]
    this.suggestionQueue = [];
    // Format: [{path: "path/to/audio/file", metadata: {}}]
    this.audioQueue = [];
    this.currentSongMetadata = null;
  }

  addToUserQueue(trackId) {
    if (this.userQueue.length < 100) {
      this.userQueue.push(trackId);
      console.log('Added trackId', trackId, 'to user queue');
      return true;
    }
    return false;
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

  addToAudioQueue(audioFilePath) {
    console.log('Added audio file', audioFilePath, 'to audio queue');
    this.audioQueue.push(audioFilePath);
  }

  popNextAudioFile() {
    return this.audioQueue.shift();
  }

  isAudioQueueEmpty() {
    return this.audioQueue.length === 0;
  }

  getNextSongMetadata() {
    return this.audioQueue[-1]?.metadata;
  }
}

export default new QueueService();
