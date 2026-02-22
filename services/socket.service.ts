import { API_CONFIG } from "@/config/api.config";
import { storage } from "@/utils/storage";
import { io, Socket } from "socket.io-client";

/**
 * Socket Service for managing WebSocket connections
 */
class SocketService {
  private socket: Socket | null = null;
  private namespace = "/livestream";

  /**
   * Initialize socket connection
   */
  async connect(): Promise<Socket | null> {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = await storage.getAccessToken();
    const baseUrl = API_CONFIG.BASE_URL.replace(/\/v1\/?$/, "");

    this.socket = io(`${baseUrl}${this.namespace}`, {
      auth: token
        ? {
            token,
          }
        : {},
      transports: ["websocket"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      if (__DEV__) {
        console.log("🔌 Socket Connected:", this.socket?.id);
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket Connection Error:", error);
    });

    this.socket.on("disconnect", (reason) => {
      if (__DEV__) {
        console.log("🔌 Socket Disconnected:", reason);
      }
    });

    return this.socket;
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Emit event
   */
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️ Cannot emit ${event}: Socket not connected`);
    }
  }

  /**
   * Listen to event
   */
  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Stop listening to event
   */
  off(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = new SocketService();
