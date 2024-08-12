// src/services/databaseService.js
import { MongoClient } from 'mongodb';

class DatabaseService {
    // constructor() {
    //     this.client = new MongoClient(process.env.MONGO_URI);
    //     this.collection = this.client.db('radioStation').collection('songMetadata');
    //     console.log("Connected to database");
    // }

    async getSongMetadata(trackId) {
        console.log("Retrieving metadata for trackId", trackId);
        return await this.collection.findOne({ trackId });
    }

    async saveSongMetadata(metadata) {
        console.log("Saving metadata for trackId", metadata.trackId);
        await this.collection.insertOne(metadata);
    }

    async getRecentlyPlayedSongs(hours) {
        console.log("Retrieving songs played in the last", hours, "hours");
        const cutoff = new Date(Date.now() - hours * 3600 * 1000);
        return await this.collection.find({ lastPlayed: { $gte: cutoff } }).toArray();
    }

    async getLastPlayedSongs(limit) {
        console.log("Retrieving last", limit, "played songs");
        return await this.collection.find().sort({ lastPlayed: -1 }).limit(limit).toArray();
    }
}

export default new DatabaseService();
