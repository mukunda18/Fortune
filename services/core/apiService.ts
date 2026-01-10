import { BaseService } from "../baseService";

export class ApiService extends BaseService {
    protected name = "ApiService";
    private baseUrl = "/api";

    async createRoom(): Promise<string> {
        try {
            this.log("Creating room...");
            const response = await fetch(`${this.baseUrl}/createRoom`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            this.log("Room created:", data.roomId);
            return data.roomId;
        } catch (error) {
            this.error("Failed to create room:", error);
            throw error;
        }
    }

    async getCookie(socketId: string | null): Promise<void> {
        if (!socketId) {
            this.warn("No socket ID provided for getCookie");
            return;
        }

        try {
            this.log("Requesting SID cookie...");
            await fetch(`${this.baseUrl}/getcookie`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: socketId }),
            });
            this.log("SID cookie received");
        } catch (error) {
            this.error("Failed to get cookie:", error);
            throw error;
        }
    }

    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            return response.ok;
        } catch (error) {
            this.error("Health check failed:", error);
            return false;
        }
    }
}

export const apiService = new ApiService();
