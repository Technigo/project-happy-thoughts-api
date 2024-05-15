import express from "express"
import cors from "cors"
import chatRoutes from "./chat.js"
import listEndpoints from "express-list-endpoints"

const app = express()
const PORT = process.env.SERVER_PORT || 3000

app.use(cors())

app.get("/", (req, res) => {
  const endpoints = listEndpoints(app)
  res.json(endpoints)
})

app.use("/", chatRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
