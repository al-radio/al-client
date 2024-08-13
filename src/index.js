import express, { json } from "express";
import songRoutes from "./routes/routes.js";
import { playNextSong } from "./services/audio.js";
import SpotifyService from "./services/spotify.js";

const app = express();
app.use(json());

app.use("/api/songs", songRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // Start the audio playback process
  await SpotifyService.authenticate();
  await playNextSong();
});
