import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectionDb.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import url from 'url';
import router from './routes/route.js';

dotenv.config();

const app = express();

// Get the directory name of the current module
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Split FRONTEND_URLs environment variable into an array of origins
const allowedOrigins = process.env.FRONTEND_URLs.split(',');

// CORS middleware configuration
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api', router);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
