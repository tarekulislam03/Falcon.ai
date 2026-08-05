"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleActionApproval = exports.handleChatRequest = void 0;
const aiBridge_js_1 = require("../services/aiBridge.js");
const handleChatRequest = async (req, res) => {
    const { message, history, userId, stream } = req.body;
    if (!message || message.trim() === '') {
        res.status(400).json({ error: 'Message cannot be empty.' });
        return;
    }
    // Handle real-time streaming response (SSE)
    if (stream) {
        await aiBridge_js_1.aiBridge.streamResponse({ message, history, userId }, res);
        return;
    }
    // Handle standard non-streaming JSON response
    try {
        const reply = await aiBridge_js_1.aiBridge.generateResponse({ message, history, userId });
        res.status(200).json({
            success: true,
            reply,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
};
exports.handleChatRequest = handleChatRequest;
const handleActionApproval = async (req, res) => {
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
exports.handleActionApproval = handleActionApproval;
