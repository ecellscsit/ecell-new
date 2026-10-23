import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';
import routes from './routes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
