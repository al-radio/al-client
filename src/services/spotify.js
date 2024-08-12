// src/services/spotify.js
import axios from 'axios';

class SpotifyService {
    constructor() {
        this.baseUrl = 'https://api.spotify.com/v1';
        this.token = process.env.SPOTIFY_ACCESS_TOKEN;
    }

    async searchTrack(query) {
        const response = await axios.get(`${this.baseUrl}/search`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            params: {
                q: query,
                type: 'track',
                limit: 1
            }
        });
        console.log("Retrieved track: ", response.data.tracks.items[0]);
        return response.data.tracks.items[0];
    }

    async getRecommendations(trackIds) {
        const response = await axios.get(`${this.baseUrl}/recommendations`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            params: {
                seed_tracks: trackIds.join(','),
                limit: 15
            }
        });
        console.log("Retrieved recommendations: ", response.data.tracks);
        return response.data.tracks;
    }
}

export default new SpotifyService();
