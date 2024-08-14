// src/routes/routes.js
import { Router } from "express";
import SongController from "../controllers/songController.js";
import ClientService from "../services/client.js";
const router = Router();

router.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});
router.get("/stream", (req, res) => {
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      Connection: "keep-alive",
    });
  
    ClientService.addClient(res);
  });
router.post("/submit", SongController.submitSong);


export default router;
