# Falcon.ai Team API Integration Contract

This document defines the exact contract between the **Frontend UI**, **Backend API**, and **AI Engine**.

---

## 1. For the Frontend Developer (`/frontend`)

The backend runs on **`http://localhost:4000`** by default.

### A. Non-Streaming Chat Endpoint
Use this for simple JSON requests/responses.

- **URL**: `POST http://localhost:4000/api/chat`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "message": "Summarize my unread emails and write a draft",
    "history": [
      { "role": "user", "content": "Hi Falcon" },
      { "role": "assistant", "content": "Hello! How can I help you?" }
    ],
    "userId": "user-123",
    "stream": false
  }
  ```
- **Response Body**:
  ```json
  {
    "success": true,
    "reply": "[Falcon.ai Assistant]: I am ready to process your request.",
    "timestamp": "2026-08-05T01:00:00.000Z"
  }
  ```

---

### B. Real-Time Streaming (SSE)
Use this to render live typing/streaming words on the UI as the AI responds.

- **Option 1: POST payload with `stream: true`**
  Set `stream: true` in your fetch request and read from `response.body` stream.

- **Option 2: EventSource (GET)**
  ```javascript
  const eventSource = new EventSource('http://localhost:4000/api/chat/stream?message=Hello');

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.chunk) {
      console.log("Streamed word:", data.chunk);
      // Append word to UI state
    }
    if (data.status === 'completed') {
      eventSource.close();
    }
  };
  ```

---

### C. Human-in-the-Loop Action Approval Endpoint
When Falcon.ai wants to perform an action (e.g. run bash command, write file, send email), render a popup asking for user permission.

- **URL**: `POST http://localhost:4000/api/action/approve`
- **Request Body**:
  ```json
  {
    "actionId": "act_8923",
    "approved": true,
    "userFeedback": "Approved with root privilege"
  }
  ```

---

## 2. For the AI Developer (`/ai`)

As the AI developer, you can provide your logic to the backend in one of two ways:

### Method 1: Export a Function/Class (If using Node/TypeScript for AI)
Modify `backend/src/services/aiBridge.ts`:
```typescript
import { yourAIFunction } from '../../ai/index';

// Inside generateResponse:
return await yourAIFunction(payload.message, payload.history);
```

### Method 2: Expose a Python HTTP Endpoint (If using Python/FastAPI in `/ai`)
Expose an endpoint on `http://localhost:8000/generate` in Python. `aiBridge.ts` will forward requests directly:
```typescript
const res = await fetch('http://localhost:8000/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

---

## 3. Quickstart to Run Backend

```bash
cd backend
npm install
npm run dev
```
