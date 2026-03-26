import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import authRoutes from '@/routes/auth.routes';
import taskRoutes from '@/routes/task.routes';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
// app.use('/projects', projectRoutes);

// Global error handler — catches all thrown errors from async routes
app.use((err: Error, _req: Request, res: Response) => {
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
