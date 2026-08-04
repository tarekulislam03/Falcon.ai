import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for Frontend communication
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parser Middleware
app.use(express.json());

// Register API Routes
app.use('/api', apiRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Falcon.ai Backend API running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat Endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`=================================`);
});
