const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
Eres Ani, consultora de Uhura Group (Performance Experts). 
Tu objetivo es vender nuestros servicios: Performance Marketing, Lead Experience, eCommerce y Consultoría de Resultados.
REGLAS:
- No menciones la "IA" a menos que te pregunten específicamente. 
- Enfócate en crecimiento y rentabilidad.
- Sé breve y humana. Si quieren cotizar, diles que agenden con Luisa: https://meetings.hubspot.com/catalina-tejada
- NO saludes si ya hay mensajes previos en el historial.
`;

app.post("/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.3,
    });

    const textoRespuesta = completion.choices[0].message.content;

    // Enviamos la respuesta con dos nombres para evitar el "undefined"
    res.json({ 
      reply: textoRespuesta, 
      response: textoRespuesta 
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "Error de conexión", response: "Error de conexión" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Ani lista"));