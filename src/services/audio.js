// src/services/audio.js
import { downloadTrack } from '../utils/freyrUtils';

class AudioService {
    async downloadSong(trackUrl) {
        return await downloadTrack(trackUrl);
    }

    // Implement Icecast streaming setup and management here
}

export default new AudioService();
