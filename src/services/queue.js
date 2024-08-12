// src/services/queue.js
class QueueService {
    constructor() {
        this.userQueue = [];
        this.suggestionQueue = [];
        this.audioQueue = [];
    }

    addToUserQueue(trackId) {
        if (this.userQueue.length < 100) {
            this.userQueue.push(trackId);
            console.log("Added trackId", trackId, "to user queue");
            return true;
        }
        return false;
    }

    addToSuggestionQueue(trackId) {
        if (this.suggestionQueue.length < 5) {
            this.suggestionQueue.push(trackId);
            console.log("Added trackId", trackId, "to suggestion queue");
            return true;
        }
        return false;
    }

    popNextTrack() {
        return this.userQueue.length ? this.userQueue.shift() : this.suggestionQueue.shift();
    }

    addToAudioQueue(audioFilePath) {
        this.audioQueue.push(audioFilePath);
        console.log("Added audio file to audio queue");
    }

    popNextAudioFile() {
        return this.audioQueue.shift();
    }
}

export default new QueueService();
