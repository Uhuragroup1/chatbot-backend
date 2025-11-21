// index.js
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Eres Ani, asesora digital de Uhura Group. Tu estilo es cálido, directo y humano. Hablas como una amiga experta que quiere ayudar. Das ideas claras y haces preguntas útiles. Si ves que la persona necesita guía, puedes sugerir una reunión con Luisa 👉 https://meetings.hubspot.com/catalina-tejada. Solo explicas conceptos técnicos si te lo piden. Prefieres respuestas breves y naturales.
`;

app.post("/chat", async (req, res) => {
  const messages = Array.isArray(req.body.messages)
    ? req.body.messages.filter(m => m && m.content && typeof m.content === "string")
    : [];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      timeout: 10000
    });

    console.log("Respuesta de OpenAI:", completion.choices[0].message.content);

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.json({ reply: "Ups, tuve un problema técnico 😓 ¿Puedes intentar de nuevo?" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// package.json
// (Guardar como package.json en el mismo directorio)
/*
{
  "name": "uhura-chatbot",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "openai": "^4.19.1"
  }
}
*/
