// src/routes/routes.js
import { Router } from 'express';
import ClientService from '../services/client.js';
const router = Router();

router.get('/', (req, res) => ClientService.serveWebpage(req, res));
router.get('/stream', (req, res) => ClientService.addClientToStream(req, res));
router.get('/song', (req, res) => ClientService.getCurrentSongMetadata(req, res));
router.get('/history', (req, res) => ClientService.getSongHistory(req, res));

router.post('/submit', (req, res) => ClientService.submitSong(req, res));

export default router;
