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
    console.log('Retrieving metadata for trackId', trackId);
    const db = await connect();
    const track = await db.collection('tracks').findOne({ trackId });
    return track;
  }

  async saveSongMetadata(metadata) {
    console.log('Saving metadata for trackId', metadata.trackId);
    const db = await connect();
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
    await db
      .collection('tracks')
      .updateOne({ trackId: metadata.id }, { $set: song }, { upsert: true }, { expireAfterSeconds: 604800 });

    return song;
  }

  async markSongAsPlayed(trackId) {
    console.log('Marking song as played:', trackId);
    const db = await connect();
    await db.collection('tracks').updateOne(
      { trackId },
      {
        $set: { lastPlayed: new Date() },
        $inc: { playedCount: 1 }
      }
    );
  }

  async getRecentlyPlayedSongs(hours) {
    const db = await connect();
    const cutoff = new Date(Date.now() - hours * 3600 * 1000);
    const songs = await db
      .collection('tracks')
      .find({ lastPlayed: { $gte: cutoff } })
      .toArray();
    console.log(
      'Songs played in the last',
      hours,
      'hours:',
      songs.map(track => track.title + ' ' + track.artist)
    );
    return songs;
  }

  async getLastPlayedSongs(limit) {
    const db = await connect();
    const songs = await db.collection('tracks').find().sort({ lastPlayed: -1 }).limit(limit).toArray();
    console.log(
      'Last played',
      limit,
      'songs:',
      songs.map(track => track.title + ' ' + track.artist)
    );
    return songs;
  }
}

export default new DatabaseService();
