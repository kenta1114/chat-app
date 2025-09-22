import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Parse JSON bodies
app.use(express.json())

// Proxy endpoint for OpenAI: forwards requests to the OpenAI API using a server-side key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY

app.post('/api/openai', async (req, res) => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key missing on server')
    return res.status(500).json({ error: 'Server misconfiguration: OpenAI API key missing' })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    })

    const text = await response.text()

    // Try to parse JSON; if it fails, forward as text with proper status
    try {
      const data = JSON.parse(text)
      return res.status(response.status).json(data)
    } catch (err) {
      console.warn('OpenAI proxy returned non-JSON response')
      return res.status(response.status).send(text)
    }
  } catch (err) {
    console.error('OpenAI proxy request failed:', err)
    return res.status(502).json({ error: 'OpenAI proxy request failed' })
  }
})

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
