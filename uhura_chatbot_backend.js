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
Eres Ani, la experta asesora digital de Uhura Group. 
Tu misión es ayudar a empresas a crecer con IA y Estrategia Digital.

REGLAS DE ORO:
1. NO SALUDES MÁS DE UNA VEZ: Si ya estás hablando, no digas "Hola".
2. SERVICIOS: Uhura Group ofrece IA, Transformación Digital, Performance Marketing y mejora de conversión (+25%).
3. RESPUESTAS: Máximo 2 párrafos. Sé directa y muy humana.
4. CITA: Si quieren cotizar o algo serio, diles que agenden aquí: https://meetings.hubspot.com/catalina-tejada
`;

app.post("/chat", async (req, res) => {
  try {
    // LIMPIEZA DE MENSAJES: Esto evita el error que estás viendo
    let rawMessages = Array.isArray(req.body.messages) ? req.body.messages : [];
    
    const formattedMessages = rawMessages.map((m, index) => ({
      role: m.role || (index % 2 === 0 ? "user" : "assistant"), // Si falta el rol, lo asignamos
      content: String(m.content || m.message || "") // Aseguramos que sea texto
    })).filter(m => m.content.length > 0);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cambiado a 4o-mini: es 10 veces más rápido y estable
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...formattedMessages
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("DETALLE DEL ERROR:", error);
    res.status(500).json({ 
      reply: "Ani tuvo un pequeño hipo técnico. 😅 ¿Podrías intentar enviarme tu pregunta de nuevo?",
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Ani operativa en puerto ${PORT}`);
});