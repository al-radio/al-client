import { MongoClient } from 'mongodb';

class DatabaseService {
  constructor() {
    this.MongoURI = process.env.MONGO_URI;
    this.dbName = 'musicDB';
  }

  async connect() {
    const client = new MongoClient(this.MongoURI);
    await client.connect();
    this.db = client.db(this.dbName);
  }

  async getDb() {
    if (!this.db) {
      await this.connect();
    }
    return this.db;
  }

  async getSongMetadata(trackId) {
    console.log('Retrieving metadata for trackId', trackId);
    const db = await this.getDb();
    const track = await db.collection('tracks').findOne({ trackId });
    return track;
  }

  async saveSongMetadata(metadata) {
    console.log('Saving metadata for trackId', metadata.trackId);
    const song = {
      trackId: metadata.trackId,
      title: metadata.title,
      artist: metadata.artist,
      album: metadata.album,
      genres: metadata.genres,
      releaseDate: metadata.releaseDate,
      url: metadata.url,
      artUrl: metadata.artUrl
    };

    // expire after 1 week
    const db = await this.getDb();
    await db
      .collection('tracks')
      .updateOne({ trackId: metadata.id }, { $set: song }, { upsert: true }, { expireAfterSeconds: 604800 });

    return song;
  }

  async markSongAsPlayed(trackId) {
    console.log('Marking song as played:', trackId);
    const db = await this.getDb();
    await db.collection('tracks').updateOne(
      { trackId },
      {
        $set: { lastPlayed: new Date() },
        $inc: { playedCount: 1 }
      }
    );
  }

  async getRecentlyPlayedSongs(hours) {
    const cutoff = new Date(Date.now() - hours * 3600 * 1000);
    const db = await this.getDb();
    const songs = await db
      .collection('tracks')
      .find({ lastPlayed: { $gte: cutoff } })
      .toArray();
    return songs;
  }

  async getLastPlayedSongs(limit) {
    const db = await this.getDb();
    const songs = await db.collection('tracks').find().sort({ lastPlayed: -1 }).limit(limit).toArray();
    return songs;
  }
}

export default new DatabaseService();
