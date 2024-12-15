import express from 'express';
import https from 'https';
import fs from 'node:fs';
import path from 'node:path';
import userRouter from './routes/user-rotes.js'
import roleRouter from './routes/role-routes.js';
import { fileURLToPath } from 'node:url';
import { connectDb } from './config/sequelize-config.js';
import productRouter from './routes/product-routes.js';
import dotenv from 'dotenv';
import messageRoutes from './routes/message-routes.js';

const PORT = 3443;
const __dirname = fileURLToPath(new URL('.', import.meta.url));

dotenv.config();

const run = () => {
    const app = express();
    const options = {
        key: fs.readFileSync(path.join(__dirname, "..", "cert", "key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "..", "cert", "cert.pem"))
    };
    https.createServer(options, app).listen(PORT, () => console.log(`The server has started https://127.0.0.1:${PORT}`));

    app.use(express.json());
    app.use('/users', userRouter);
    app.use('/roles', roleRouter);
    app.use('/product', productRouter);
    app.use('/messages', messageRoutes);
};

connectDb()
    .then(run)
    .catch(err => console.error('Failed to connect to database:', err));
