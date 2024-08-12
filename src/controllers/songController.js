// src/controllers/songController.js
import SpotifyService from '../services/spotify.js';
import QueueService from '../services/queue.js';
import DBService from '../services/db.js';

class SongController {
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
        const lastFiveTrackIds = lastFiveSongs.map(track => track.trackId);
        const suggestions = await SpotifyService.getRecommendations(lastFiveTrackIds);

        // Do not suggest songs that have been played in the last two hours
        const tooRecentlyPlayed = await DBService.getRecentlyPlayedSongs(2);
        const tooRecentlyTrackIds = tooRecentlyPlayed.map(track => track.trackId);
        suggestions = suggestions.filter(track => !tooRecentlyTrackIds.includes(track.id));

        // Limit to 5 suggestions
        suggestions = suggestions.slice(0, 5);
        suggestions.forEach(track => QueueService.addToSuggestionQueue(track.id));
    }
}

export default new SongController();
