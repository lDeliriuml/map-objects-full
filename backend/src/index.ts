import express from 'express';
import cors from 'cors';
import objectsRouter from './routes/map-objects.routes.js';
import eventsRouter from './routes/map-events.routes.js';
import { AppError, ValidationError } from './errors.js';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'https://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/objects', objectsRouter);
app.use('/events', eventsRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message, details: error.details });
  }
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

export default app;


