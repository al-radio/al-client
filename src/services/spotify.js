import DBService from './db.js';
import axios from 'axios';
import QueueService from './queue.js';

class SpotifyService {
  constructor() {
    this.baseUrl = 'https://api.spotify.com/v1';
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
  }

  async authenticate() {
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
          grant_type: 'client_credentials'
        },
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
        }
      });
      this.token = response.data.access_token;
      console.log('Authenticated with Spotify API');
    } catch (error) {
      throw new Error('Failed to authenticate with Spotify API:', error);
    }
  }

  extractMetadata(track) {
    return {
      trackId: track.id,
      title: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      genres: track.genres,
      releaseDate: track.album.release_date,
      url: track.external_urls.spotify,
      artUrl: track.album.images[0].url
    };
  }

  async getArtistGenres(artistId) {
    try {
      const artistResponse = await axios.get(`${this.baseUrl}/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
      return artistResponse.data.genres;
    } catch (error) {
      throw new Error('Failed to get artist genres:', error);
    }
  }

  async searchTrack(query) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        params: {
          q: query,
          type: 'track',
          limit: 1
        }
      });
      // add genres to track metadata
      const artistId = response.data.tracks.items[0].artists[0].id;
      response.data.tracks.items[0].genres = await this.getArtistGenres(artistId);

      const metadata = this.extractMetadata(response.data.tracks.items[0]);
      return await DBService.saveSongMetadata(metadata);
    } catch (error) {
      if (error.response?.status === 401) {
        await this.authenticate();
        return this.searchTrack(query);
      }
      throw new Error('Failed to search for track:', error);
    }
  }

  async getRecommendations(trackIds) {
    try {
      const response = await axios.get(`${this.baseUrl}/recommendations`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        params: {
          seed_tracks: trackIds.join(','),
          limit: 15
        }
      });
      const recommendations = response.data.tracks.map(track => track.id);
      return recommendations;
    } catch (error) {
      if (error.response?.status === 401) {
        await this.authenticate();
        return this.getRecommendations(trackIds);
      }
      throw new Error('Failed to get recommendations:', error);
    }
  }

  async getTrackData(trackId) {
    console.log('Getting track data from spotify for:', trackId);
    try {
      const response = await axios.get(`${this.baseUrl}/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      // add genres to track metadata
      const artistId = response.data.artists[0].id;
      response.data.genres = await this.getArtistGenres(artistId);

      const metadata = this.extractMetadata(response.data);
      return await DBService.saveSongMetadata(metadata);
    } catch (error) {
      if (error.response?.status === 401) {
        await this.authenticate();
        return this.getTrackData(trackId);
      }
      throw new Error('Failed to get track data:', error);
    }
  }

  async populateSuggestionQueue(numberOfSuggestions = 5) {
    // Get recommendations based on last five played
    const lastFiveSongs = await DBService.getLastPlayedSongs(5);
    const lastFiveTrackIds = lastFiveSongs.map(track => track.trackId);
    let suggestions = await this.getRecommendations(lastFiveTrackIds);

    // Do not suggest songs that have been played in the last two hours
    const tooRecentlyPlayed = await DBService.getRecentlyPlayedSongs(2);
    const tooRecentlyTrackIds = tooRecentlyPlayed.map(track => track.trackId);
    suggestions = suggestions.filter(track => !tooRecentlyTrackIds.includes(track));

    // Limit to 5 suggestions
    suggestions = suggestions.slice(0, numberOfSuggestions);
    suggestions.forEach(track => QueueService.addToSuggestionQueue(track));
  }
}

export default new SpotifyService();
