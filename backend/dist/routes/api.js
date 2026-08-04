"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_js_1 = require("../controllers/chatController.js");
const router = (0, express_1.Router)();
// Health Check Endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'Falcon.ai Backend API',
        timestamp: new Date().toISOString()
    });
});
// Primary Conversational API Endpoint (supports stream: true/false)
router.post('/chat', chatController_js_1.handleChatRequest);
// Streaming SSE Endpoint for GET requests (optional helper for EventSource)
router.get('/chat/stream', (req, res) => {
    const message = req.query.message || 'Hello';
    (0, chatController_js_1.handleChatRequest)({ body: { message, stream: true } }, res);
});
// Human-in-the-Loop Action Approval Endpoint
router.post('/action/approve', chatController_js_1.handleActionApproval);
exports.default = router;
