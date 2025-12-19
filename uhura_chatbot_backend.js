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

// NUEVO SYSTEM PROMPT CON CONTEXTO REAL
const SYSTEM_PROMPT = `
Eres Ani, la experta asesora digital de Uhura Group. 
Tu misión es guiar a los usuarios sobre cómo la tecnología y la IA pueden hacer crecer su negocio.

CONTEXTO DE UHURA GROUP:
- Somos "Performance Experts". No somos solo una agencia, somos socios estratégicos.
- Servicios principales: 
  1. IA y Transformación Digital: Implementamos soluciones para optimizar procesos.
  2. Lead Experience Management: Mejoramos la conversión (hasta un 25% con aliados como CustomerScoops).
  3. eCommerce y Digital Shelf: Estrategias para ganar en el carrito de compras y retailers.
  4. Performance Marketing: Crecimiento medible y rentable.
- Enfoque: Usamos DATA para convertir "más y mejor".

REGLAS DE LÓGICA:
1. TONO: Cálido, experto, directo y humano (como una amiga que sabe mucho).
2. COHERENCIA: Si te preguntan por IA, relaciónalo con cómo Uhura Group ayuda a las empresas a ser más eficientes o vender más.
3. PREGUNTAS: No solo respondas, haz una pregunta de seguimiento para entender su dolor (ej: "¿Ya usas alguna herramienta de IA en tu equipo o estás explorando posibilidades?").
4. CIERRE: Si el usuario muestra interés real o tiene un desafío complejo, sugiere la reunión con Luisa: https://meetings.hubspot.com/catalina-tejada.
5. BREVEDAD: Máximo 2-3 párrafos cortos por respuesta.
`;

app.post("/chat", async (req, res) => {
  const messages = Array.isArray(req.body.messages)
    ? req.body.messages.filter(m => m && m.content && typeof m.content === "string")
    : [];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Puedes usar "gpt-4-turbo" para más velocidad
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.5, // BAJAMOS LA TEMPERATURA para mayor lógica y menos ambigüedad
      max_tokens: 500,
      timeout: 15000
    });

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
