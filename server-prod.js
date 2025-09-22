import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Serve the built files
// Dist is generated at the repository root (../dist) by the root-level build
app.use(express.static(path.join(__dirname, '..', 'dist')))

// Fallback to index.html for SPA navigation (Express v5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serving production build on 0.0.0.0:${PORT}`)
})
