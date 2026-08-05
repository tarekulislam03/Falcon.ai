"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_js_1 = __importDefault(require("./routes/api.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Enable CORS for Frontend communication
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Body Parser Middleware
app.use(express_1.default.json());
// Register API Routes
app.use('/api', api_js_1.default);
// Start Server
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 Falcon.ai Backend API running on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`💬 Chat Endpoint: http://localhost:${PORT}/api/chat`);
    console.log(`=================================`);
});
