import express from 'express';
import queueRoutes from './routes/queueRoutes';

const app = express();

// TODO: Add security middlewares (auth, rate limiting, input validation)
app.use(express.json());

app.use('/api', queueRoutes);

export default app;
