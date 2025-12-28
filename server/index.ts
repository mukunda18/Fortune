import next from "next"
import dotenv from "dotenv"
import { expressApp, server } from "./server"
import { createRoom } from "./gameRooms"

dotenv.config()
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 3000

app.prepare().then(() => {
    expressApp.post("/api/createRoom", (req, res) => {
        console.log("[Server] POST /api/createRoom requested");
        const roomId = createRoom();
        res.json({ roomId })
    });
    expressApp.get("/api/health", (_, res) => {
        res.json({ status: "ok" })
    })

    expressApp.all("*", (req, res) => {
        return handle(req, res)
    })

    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
})
