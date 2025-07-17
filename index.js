import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import axios from 'axios'

dotenv.config()

const app = express()
app.use(bodyParser.json())

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}))

app.post('/webhook', async (req, res) => {
  const message = req.body.message?.text
  const conversationId = req.body.conversation?.id

  if (!message || !conversationId) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  try {
    // GPT-Antwort generieren
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    })

    const reply = completion.data.choices[0].message.content

    // GPT-Antwort an Superchat senden
    await axios.post(
      `https://api.superchat.com/conversations/${conversationId}/reply`,
      { text: reply },
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPERCHAT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Fehler:', error)
    res.status(500).json({ error: 'Interner Serverfehler' })
  }
})

const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`)
})
