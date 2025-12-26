import next from "next"
import dotenv from "dotenv"

import { expressApp, server, io } from "./server"

dotenv.config()
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 3000

app.prepare().then(() => {

    expressApp.get("/api/health", (_req, res) => {
        res.json({ status: "ok" })
    })

    expressApp.all("*", (req, res) => {
        return handle(req, res)
    })

    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
})
