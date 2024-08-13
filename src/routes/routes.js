// src/routes/routes.js
import { Router } from "express";
import SongController from "../controllers/songController.js";
const router = Router();

router.post("/submit", SongController.submitSong);

export default router;
