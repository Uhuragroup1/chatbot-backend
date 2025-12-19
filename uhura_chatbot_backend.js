const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Eres Ani, asesora experta de Uhura Group. 
TU NEGOCIO: Somos Performance Experts. Ayudamos a empresas con IA, Transformación Digital y Marketing de Resultados. 
REGLA DE ORO: No saludes si ya hay mensajes previos. Sé breve (máximo 2 párrafos) y muy humana. 
CITA: Si el cliente quiere avanzar, envía este link: https://meetings.hubspot.com/catalina-tejada`;

app.post("/chat", async (req, res) => {
  try {
    // 1. Recibimos los mensajes y los limpiamos de cualquier formato extraño de la web
    let rawMessages = Array.isArray(req.body.messages) ? req.body.messages : [];
    
    // 2. Forzamos el formato correcto que OpenAI exige
    const cleanMessages = rawMessages
      .map(m => ({
        role: m.role === "assistant" ? "assistant" : "user", 
        content: String(m.content || m.message || m.text || "")
      }))
      .filter(m => m.content.trim() !== "");

    // 3. Llamada a la IA
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Es más rápido y evita errores de conexión
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...cleanMessages],
      temperature: 0.3,
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error("ERROR REAL:", error);
    // Esto te dirá en el chat exacto qué falló (luego lo quitamos)
    res.status(500).json({ 
      reply: `Hubo un error: ${error.message}. Revisa que tu API KEY tenga saldo y el modelo sea correcto.` 
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Ani lista"));