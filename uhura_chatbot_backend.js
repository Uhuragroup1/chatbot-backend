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
Tu misión es guiar a los usuarios sobre cómo la tecnología y la IA pueden hacer crecer su negocio.

REGLAS DE MEMORIA Y LÓGICA (MUY IMPORTANTE):
1. NO SALUDES EN CADA MENSAJE: Si ves que ya hay mensajes previos en la conversación, NO digas "Hola", "¡Mucho gusto!" ni "Soy Ani". Ve directo a responder la duda. Solo se saluda una vez al inicio.
2. COHERENCIA: Mantén el hilo de lo que se viene hablando. Si el usuario dice "Cuéntame más", se refiere al último servicio que mencionaste.
3. TONO: Cálido, experto, directo y humano. 

CONTEXTO DE UHURA GROUP:
- Somos "Performance Experts". No somos solo una agencia, somos socios estratégicos.
- Servicios: IA y Transformación Digital, Lead Experience Management (Conversión +25%), eCommerce y Digital Shelf, Performance Marketing.
- Enfoque: Usamos DATA para convertir "más y mejor".

INTERACCIÓN:
- Si el usuario tiene un desafío complejo, sugiere reunión con Luisa: https://meetings.hubspot.com/catalina-tejada.
- Haz preguntas cortas para entender su necesidad.
- Respuestas breves (máximo 2 párrafos).
`;

app.post("/chat", async (req, res) => {
  // Verificamos qué mensajes están llegando
  const messages = Array.isArray(req.body.messages)
    ? req.body.messages.filter(m => m && m.content && typeof m.content === "string")
    : [];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", 
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages // Aquí es donde se envía la "memoria"
      ],
      temperature: 0.3, // BAJAMOS esto a 0.3 para que sea más lógico y menos repetitivo
      presence_penalty: 0.6, // Esto penaliza a la IA si intenta repetir las mismas frases (como los saludos)
      max_tokens: 500,
      timeout: 15000
    });

    console.log("Historial recibido:", messages.length, "mensajes"); // Para debug en tu consola

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "Ups, tuve un hipo tecnológico 😅 ¿Me repites eso?" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor de Ani corriendo en puerto ${PORT}`);
});