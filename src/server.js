import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { initUser } from './services/auth.service.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 200,
}));

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

initUser().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});