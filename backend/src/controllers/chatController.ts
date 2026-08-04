import { Request, Response } from 'express';
import { aiBridge, ChatRequestPayload } from '../services/aiBridge.js';

export const handleChatRequest = async (req: Request, res: Response): Promise<void> => {
  const { message, history, userId, stream } = req.body as ChatRequestPayload;

  if (!message || message.trim() === '') {
    res.status(400).json({ error: 'Message cannot be empty.' });
    return;
  }

  // Handle real-time streaming response (SSE)
  if (stream) {
    await aiBridge.streamResponse({ message, history, userId }, res);
    return;
  }

  // Handle standard non-streaming JSON response
  try {
    const reply = await aiBridge.generateResponse({ message, history, userId });
    res.status(200).json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};

export const handleActionApproval = async (req: Request, res: Response): Promise<void> => {
  const { actionId, approved, userFeedback } = req.body;

  if (!actionId || approved === undefined) {
    res.status(400).json({ error: 'actionId and approved status are required.' });
    return;
  }

  // TODO: Dispatch approval back to AI engine/tool execution engine
  res.status(200).json({
    success: true,
    actionId,
    status: approved ? 'approved' : 'rejected',
    message: `Action ${approved ? 'approved' : 'rejected'} successfully.`
  });
};
