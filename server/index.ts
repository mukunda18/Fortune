import next from "next"
import dotenv from "dotenv"
import { expressApp, server } from "./server"
import { roomService, sessionTokenService } from "./services";


dotenv.config()
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 3000;

app.prepare().then(() => {
    // Create room endpoint
    expressApp.post("/api/createRoom", (_, res) => {
        console.log("[Server] POST /api/createRoom requested");
        try {
            const roomId = roomService.createRoom();
            res.json({ roomId });
        } catch (error) {
            console.error("[Server] Error creating room:", error);
            res.status(500).json({ error: "Failed to create room" });
        }
    });

    // Get SID cookie endpoint
    expressApp.post("/api/getcookie", (req, res) => {
        console.log("[Server] POST /api/getcookie requested");
        try {
            const socketID = req.body.id;
            const SID = sessionTokenService.generateOrGetSID(socketID);
            res.cookie("SID", SID, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7,
            });
            res.end();
        } catch (error) {
            console.error("[Server] Error getting cookie:", error);
            res.status(500).end();
        }
    });

    // Health check endpoint
    expressApp.get("/api/health", (_, res) => {
        res.json({ status: "ok" })
    });

    // Next.js handler for all other routes
    expressApp.all("*", (req, res) => {
        return handle(req, res)
    })

    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
})
