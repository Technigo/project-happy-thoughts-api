import express from "express"
import cors from "cors"
import chatRoutes from "./backend/chat.js"

const app = express()
const PORT = process.env.SERVER_PORT || 3000

app.use(cors())

app.use("/api", chatRoutes)

app.use("/", (req, res, next) => {
  const routes = app._router.stack
    .filter((r) => r.route && r.route.path)
    .map((r) => ({
      path: r.route.path,
      methods: Object.keys(r.route.methods),
      middleware: r.route.stack.map((s) => s.name),
    }))

  res.json(routes)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
}) 