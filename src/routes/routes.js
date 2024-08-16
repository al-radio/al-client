// src/routes/routes.js
import { Router } from "express";
import SongController from "../controllers/songController.js";
import ClientService from "../services/client.js";
import path from "path";
const router = Router();

router.get("/", (req, res) => ClientService.serveWebpage(req, res));
router.get("/stream", (req, res) => ClientService.addClientToStream(req, res));
router.get("/current", (req, res) => ClientService.getCurrentSongMetadata(req, res));
router.get("/history", (req, res) => ClientService.getSongHistory(req, res));

router.post("/submit", (req, res) => ClientService.submitSong(req, res));

export default router;
