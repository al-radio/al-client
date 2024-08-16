import SpotifyService from "./spotify.js";
import QueueService from "./queue.js";
import DBService from "./db.js";

import path from "path";
class ClientService {
  constructor() {
    this.clients = [];
  }

  serveWebpage(req, res) {
    res.sendFile("index.html", { root: path.join(process.cwd(), "public") });
  }

  addClientToStream(req, res) {
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      Connection: "keep-alive",
    });

    this.clients.push(res);
    res.on("close", () => {
      this.clients = this.clients.filter((client) => client !== res);
    });
  }

  async submitSong(req, res) {
    const query = req.body.query;
    if (!query) {
      return res
        .status(400)
        .json({ message: "Invalid Request. Expected 1 parameter 'query'." });
    }

    let trackId;
    if (query.includes("spotify.com/track/")) {
      trackId = query.split("/").pop();
    } else if (/^[a-zA-Z0-9]{22}$/.test(query)) {
      trackId = query;
    }
    const track = trackId
      ? await SpotifyService.getTrackData(trackId)
      : await SpotifyService.searchTrack(query);

    console.log("Got user suggested track:", track.title);

    if (track) {
      // TODO: Check if the song has been played recently or if it is already in the user queue.
      const success = QueueService.addToUserQueue(track.id);
      res.json({ success });
    } else {
      res.status(404).json({ success: false });
    }
  }

  async getCurrentSongMetadata(req, res) {
    const metadata = QueueService.currentSongMetadata;
    res.json(metadata);
  }

  async getSongHistory(req, res) {
    const songHistory = await DBService.getLastPlayedSongs(10);
    res.json(songHistory);
  }
}

export default new ClientService();
