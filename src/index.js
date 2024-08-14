import express, { json } from "express";
import songRoutes from "./routes/routes.js";
import SongController from "./controllers/songController.js";
import SpotifyService from "./services/spotify.js";
import fs from "fs";

const app = express();
app.use(json());

app.use("/", songRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  fs.readdirSync("./audio").forEach((file) => {
    fs.unlinkSync(`./audio/${file}`);
  });
  await SpotifyService.authenticate();
  await SongController.getNextSong();
  SongController.player();
});
