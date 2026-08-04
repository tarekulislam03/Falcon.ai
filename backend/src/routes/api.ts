import { Router } from 'express';
import { handleChatRequest, handleActionApproval } from '../controllers/chatController.js';

const router = Router();

// Health Check Endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Falcon.ai Backend API',
    timestamp: new Date().toISOString()
  });
});

// Primary Conversational API Endpoint (supports stream: true/false)
router.post('/chat', handleChatRequest);

// Streaming SSE Endpoint for GET requests (optional helper for EventSource)
router.get('/chat/stream', (req, res) => {
  const message = (req.query.message as string) || 'Hello';
  handleChatRequest(
    { body: { message, stream: true } } as any,
    res
  );
});

// Human-in-the-Loop Action Approval Endpoint
router.post('/action/approve', handleActionApproval);

export default router;
