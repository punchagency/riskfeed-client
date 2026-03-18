# Messages WebSocket API

## Connection

Connect to the WebSocket server with JWT authentication:

```javascript
const socket = io('http://localhost:7000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

## Events

### Client → Server

#### `message:send`
Send a new message in a conversation.

**Payload:**
```json
{
  "conversationId": "conversation-id",
  "text": "Message text",
  "attachments": ["https://s3.url/file1.jpg", "https://s3.url/file2.pdf"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Message text",
    "attachments": ["https://s3.url/file1.jpg"],
    "author": "user-id",
    "readBy": ["user-id"],
    "createdAt": "2024-03-17T12:00:00.000Z"
  },
  "message": "Message sent successfully"
}
```

---

#### `message:read`
Mark all messages in a conversation as read.

**Payload:**
```json
{
  "conversationId": "conversation-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Marked as read"
}
```

---

#### `typing:start`
Notify other participants that user is typing.

**Payload:**
```json
{
  "conversationId": "conversation-id"
}
```

**Response:**
```json
{
  "success": true
}
```

---

#### `typing:stop`
Notify other participants that user stopped typing.

**Payload:**
```json
{
  "conversationId": "conversation-id"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### Server → Client

#### `message:new`
Emitted when a new message is sent in a conversation.

**Payload:**
```json
{
  "conversationId": "conversation-id",
  "message": {
    "text": "Message text",
    "attachments": [],
    "author": "user-id",
    "readBy": ["user-id"],
    "createdAt": "2024-03-17T12:00:00.000Z"
  }
}
```

---

#### `message:read`
Emitted when a user reads messages in a conversation.

**Payload:**
```json
{
  "conversationId": "conversation-id",
  "userId": "user-id"
}
```

---

#### `typing:start`
Emitted when a user starts typing.

**Payload:**
```json
{
  "conversationId": "conversation-id",
  "userId": "user-id",
  "userName": "John Doe"
}
```

---

#### `typing:stop`
Emitted when a user stops typing.

**Payload:**
```json
{
  "conversationId": "conversation-id",
  "userId": "user-id"
}
```

---

#### `user:online`
Emitted when a user connects to WebSocket.

**Payload:**
```json
{
  "userId": "user-id",
  "isOnline": true
}
```

---

#### `user:offline`
Emitted when a user disconnects from WebSocket.

**Payload:**
```json
{
  "userId": "user-id",
  "isOnline": false,
  "lastSeen": "2024-03-17T12:00:00.000Z"
}
```

---

## HTTP Endpoints

### POST `/api/v1/messages/conversations`
Create a new conversation.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Body:**
```json
{
  "projectIds": ["project-id-1", "project-id-2"],
  "contractorIds": ["contractor-id-1"]
}
```

---

### GET `/api/v1/messages/conversations`
List all conversations with pagination and search.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `search` (optional): Search by project title or participant name
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 30): Items per page

---

### GET `/api/v1/messages/conversations/:id`
Get a specific conversation by ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

---

### POST `/api/v1/messages/upload-attachments`
Upload message attachments (images, documents, videos, audio).

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Body:**
- `messageAttachments`: Files (max 5 files, 50MB each)

**Response:**
```json
{
  "success": true,
  "data": {
    "attachments": [
      "https://s3.url/file1.jpg",
      "https://s3.url/file2.pdf"
    ]
  },
  "message": "Files uploaded successfully"
}
```

---

## Features

- ✅ Real-time messaging via WebSocket
- ✅ Read receipts per message
- ✅ Typing indicators
- ✅ Online/offline status tracking
- ✅ Last seen timestamp
- ✅ File attachments (images, documents, videos, audio)
- ✅ Conversation search by project or participant
- ✅ Unread message count
- ✅ Multi-project conversations
- ✅ Role-based conversation creation (homeowners can create with multiple contractors, contractors can only create with project homeowner)
