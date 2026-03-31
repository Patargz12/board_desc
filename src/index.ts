import 'dotenv/config';

import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { allowedOrigins } from './lib/corsOrigins';

import helmet from 'helmet';

import authRoutes from '@/routes/auth.routes';
import taskRoutes from '@/routes/task.routes';
import projectRoutes from '@/routes/project.routes';
import { setupSwagger } from './lib/swagger';

const app = express();


// Use helmet to set security headers
app.use(helmet());

// Setup Swagger docs
setupSwagger(app);

// CORS middleware — only allow specific origins
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // if you use cookies/auth headers
}));

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/projects', projectRoutes);

// Global error handler — catches all thrown errors from async routes
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (_req, res) => {
  res.send('API is running!');
});

export default app;
