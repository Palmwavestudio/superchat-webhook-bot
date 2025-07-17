const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const userMessage = req.body.message;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: userMessage }]
    })
  });

  const data = await gptResponse.json();
  let reply;

if (
  data &&
  data.choices &&
  data.choices.length > 0 &&
  data.choices[0].message &&
  data.choices[0].message.content
) {
  reply = data.choices[0].message.content;
} else {
  console.error("❌ OpenAI Antwort unbrauchbar:", JSON.stringify(data));
  reply = "Sorry, da ist was schiefgelaufen.";
}

  res.send({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
