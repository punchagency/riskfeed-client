import { io, Socket } from "socket.io-client";

const SOCKET_URL: string = import.meta.env.VITE_API_URL || "";

interface StreamData {
  content: string;
  sessionId?: string;
}

interface CompleteData {
  response: string;
  sessionId: string;
}

interface ErrorData {
  error: string;
}

interface ServerToClientEvents {
  "ai:stream": (data: StreamData) => void;
  "ai:complete": (data: CompleteData) => void;
  "ai:error": (data: ErrorData) => void;
}

interface ClientToServerEvents {
  "ai:chat": (data: { message: string; sessionId?: string; token?: string, timezone: string }) => void;
}

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private reconnectInterval: number | null = null;
  private shouldStayConnected: boolean = false;

  connect(): void {
    this.shouldStayConnected = true;
    this.ensureConnection();
  }

  private ensureConnection(): void {
    if (this.socket?.connected) return;

    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }

    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    });

    this.socket.on("disconnect", () => {
      console.log("⚠️ Disconnected from WebSocket");
      this.startReconnectMonitor();
    });

    this.socket.on("connect_error", () => {
      this.startReconnectMonitor();
    });
  }

  private startReconnectMonitor(): void {
    if (!this.shouldStayConnected || this.reconnectInterval) return;

    this.reconnectInterval = setInterval(() => {
      if (!this.socket?.connected && this.shouldStayConnected) {
        console.log("🔄 Attempting to reconnect...");
        this.ensureConnection();
      }
    }, 3000);
  }

  sendMessage(message: string, sessionId?: string, token?: string, timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): void {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("ai:chat", { message, sessionId, token, timezone });
  }

  onStream(callback: (data: StreamData) => void): void {
    if (this.socket) {
      this.socket.off("ai:stream");
      this.socket.on("ai:stream", callback);
    }
  }

  onComplete(callback: (data: CompleteData) => void): void {
    if (this.socket) {
      this.socket.off("ai:complete");
      this.socket.on("ai:complete", callback);
    }
  }

  onError(callback: (data: ErrorData) => void): void {
    if (this.socket) {
      this.socket.off("ai:error");
      this.socket.on("ai:error", callback);
    }
  }

  disconnect(): void {
    this.shouldStayConnected = false;
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("🔌 Disconnected socket manually");
    }
  }
}

export default new SocketService();
