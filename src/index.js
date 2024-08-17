import express from 'express';
import songRoutes from './routes/routes.js';
import SongController from './controllers/songController.js';
import SpotifyService from './services/spotify.js';
import ProxyService from './services/proxy.js';
import QueueService from './services/queue.js';
import path from 'path';

const app = express();
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());
app.use('/', songRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);

  // Circumvent youtube ip blocking
  if (process.env.USE_PROXIES) {
    console.log('Using proxies');
    await ProxyService.refreshProxyList();
  }

  // Choose initial songs
  if (process.env.INITIAL_SONGS) {
    const initialTrackIds = process.env.INITIAL_SONGS.split(',');
    for (const trackId of initialTrackIds) {
      QueueService.addToSuggestionQueue(trackId);
    }
  } else {
    console.error('No initial songs provided. Gathering suggested tracks from Spotify instead.');
  }

  await SpotifyService.authenticate();
  await SongController.getNextSong();
  SongController.player();
});
