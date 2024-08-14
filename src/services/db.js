// src/services/databaseService.js
import { MongoClient } from "mongodb";

class DatabaseService {
  // constructor() {
  //     this.client = new MongoClient(process.env.MONGO_URI);
  //     this.collection = this.client.db('radioStation').collection('songMetadata');
  //     console.log("Connected to database");
  // }

  // until mongo is implemented, use an in-memory array
  // format: { trackId, title, artist, lastPlayed, url, artUrl, introSpeech }
  tracks = [];

  async getSongMetadata(trackId) {
    console.log("Retrieving metadata for trackId", trackId);
    // return await this.collection.findOne({ trackId });
    return this.tracks.find((track) => track.trackId === trackId);
  }

  async saveSongMetadata(metadata) {
    console.log("Saving metadata for trackId", metadata.id);
    const obj = {
      trackId: metadata.id,
      title: metadata.name,
      artist: metadata.artists[0].name,
      album: metadata.album.name,
      genres: metadata.genres,
      releaseDate: metadata.album.release_date,
      lastPlayed: new Date(),
      url: metadata.external_urls.spotify,
      artUrl: metadata.album.images[0].url,
      introSpeech: "",
    };
    // await this.collection.insertOne(metadata);
    this.tracks.push(obj);
    return obj;
  }

  async getRecentlyPlayedSongs(hours) {
    console.log("Retrieving songs played in the last", hours, "hours");
    const cutoff = new Date(Date.now() - hours * 3600 * 1000);
    // return await this.collection.find({ lastPlayed: { $gte: cutoff } }).toArray();
    return this.tracks.filter((track) => track.lastPlayed >= cutoff);
  }

  async getLastPlayedSongs(limit) {
    console.log("Retrieving last", limit, "played songs");
    // return await this.collection.find().sort({ lastPlayed: -1 }).limit(limit).toArray();
    return this.tracks
      .sort((a, b) => b.lastPlayed - a.lastPlayed)
      .slice(0, limit);
  }
}

export default new DatabaseService();
