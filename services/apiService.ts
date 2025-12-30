/**
 * Client-side API service for communication with the server.
 * Handles all HTTP requests to the backend API.
 */

export class ApiService {
  private baseUrl = "/api";

  async createRoom(): Promise<string> {
    try {
      console.log("[ApiService] Creating room...");
      const response = await fetch(`${this.baseUrl}/createRoom`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("[ApiService] Room created:", data.roomId);
      return data.roomId;
    } catch (error) {
      console.error("[ApiService] Failed to create room:", error);
      throw error;
    }
  }

  async getCookie(socketId: string | null): Promise<void> {
    if (!socketId) {
      console.warn("[ApiService] No socket ID provided for getCookie");
      return;
    }

    try {
      console.log("[ApiService] Requesting SID cookie...");
      await fetch(`${this.baseUrl}/getcookie`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: socketId }),
      });
      console.log("[ApiService] SID cookie received");
    } catch (error) {
      console.error("[ApiService] Failed to get cookie:", error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error("[ApiService] Health check failed:", error);
      return false;
    }
  }
}

export const apiService = new ApiService();
