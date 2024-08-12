// src/index.js
import express, { json } from 'express';
import songRoutes from './routes/routes.js';

const app = express();
app.use(json());

app.use('/api/songs', songRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
