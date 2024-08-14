// src/services/spotify.js
import axios from "axios";

class SpotifyService {
  constructor() {
    this.baseUrl = "https://api.spotify.com/v1";
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
  }

  async authenticate() {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      null,
      {
        params: {
          grant_type: "client_credentials",
        },
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString("base64")}`,
        },
      }
    );
    this.token = response.data.access_token;
    console.log("Authenticated with Spotify API");
  }

  async searchTrack(query) {
    const response = await axios.get(`${this.baseUrl}/search`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      params: {
        q: query,
        type: "track",
        limit: 1,
      },
    });
    return response.data.tracks.items[0];
  }

  async getRecommendations(trackIds) {
    const response = await axios.get(`${this.baseUrl}/recommendations`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      params: {
        seed_tracks: trackIds.join(","),
        limit: 15,
      },
    });
    const recommendations = response.data.tracks.map((track) => track.id);
    return recommendations;
  }

  async getTrackData(trackId) {
    const response = await axios.get(`${this.baseUrl}/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    // get artist genres
    const artistId = response.data.artists[0].id;
    const artistResponse = await axios.get(
      `${this.baseUrl}/artists/${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    response.data.genres = artistResponse.data.genres;
    return response.data;
  }
}

export default new SpotifyService();
