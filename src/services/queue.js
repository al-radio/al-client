class QueueService {
  constructor() {
    // Format: ["trackId1", "trackId2", ...]
    this.userQueue = [];
    // Format: ["trackId1", "trackId2", ...]
    this.suggestionQueue = [];
    // Format: [{path: "path/to/audio/file", metadata: {}}]
    this.audioQueue = [];
    this.numSongsToPreload = 2;
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

  addToAudioQueue(audioFile) {
    console.log('Added audio file', audioFile.metadata?.title, ' - ', audioFile.metadata?.artist, 'to audio queue');
    this.audioQueue.push(audioFile);
  }

  popNextAudioFile() {
    return this.audioQueue.shift();
  }

  doesAudioQueueNeedFilling() {
    return this.audioQueue.length < this.numSongsToPreload;
  }

  getNextSongMetadata() {
    return this.audioQueue[this.audioQueue.length - 1]?.metadata;
  }
}

export default new QueueService();
