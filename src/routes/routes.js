// src/routes/routes.js
import { Router } from "express";
import ClientService from "../services/client.js";

const router = Router();

router.get("/", (req, res), ClientService.serveWebpage);
router.get("/stream", (req, res), ClientService.addClientToStream);
router.get("/song", (req, res), ClientService.getCurrentSongMetadata);
router.get("/history", (req, res), ClientService.getSongHistory);
router.post("/submit", ClientService.submitSong);

export default router;
