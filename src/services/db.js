import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017'; // Local MongoDB URL
const dbName = 'musicDB';

async function connect() {
  const client = new MongoClient(url);
  await client.connect();
  return client.db(dbName);
}

class DatabaseService {
  async getSongMetadata(trackId) {
    const db = await connect();
    const track = await db.collection('tracks').findOne({ trackId });
    return track;
  }

  async saveSongMetadata(metadata) {
    const db = await connect();
    const song = {
      trackId: metadata.id,
      title: metadata.name,
      artist: metadata.artists[0].name,
      album: metadata.album.name,
      genres: metadata.genres,
      releaseDate: metadata.album.release_date,
      lastPlayed: new Date(),
      url: metadata.external_urls.spotify,
      artUrl: metadata.album.images[0].url
    };

    // expire after 1 week
    await db.collection('tracks').updateOne(
      { trackId: metadata.id },
      { $set: song },
      { upsert: true },
      { expireAfterSeconds: 604800 }
    );

    return song;
  }

  async getRecentlyPlayedSongs(hours) {
    const db = await connect();
    const cutoff = new Date(Date.now() - hours * 3600 * 1000);
    const songs = await db.collection('tracks').find({ lastPlayed: { $gte: cutoff } }).toArray();
    console.log("Recent tracks from DB:", songs)
    return songs;
  }

  async getLastPlayedSongs(limit) {
    const db = await connect();
    const songs = await db.collection('tracks').find().sort({ lastPlayed: -1 }).limit(limit).toArray();
    console.log("Last played", limit, "songs:", songs);
    return songs;
  }
}

export default new DatabaseService();
