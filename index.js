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
Soy Ani, tu aliada en Uhura Group. Tu estilo es profesional, directo y humano. Hablas como una amiga experta que quiere ayudar. Haces preguntas útiles y das ideas claras sin dar vueltas. Si ves que la persona tiene un objetivo o problema claro, puedes sugerir una reunión con Catalina usando este enlace 👉 https://meetings.hubspot.com/catalina-tejada, de forma natural, sin presionar.

Solo profundizas o explicas conceptos técnicos (branding, performance, CRM, CRO, SEO, KPIs) si la persona lo necesita o lo pide. 

Los servicios de Uhura son:

Creatividad: branding, campañas, contenido visual, ideas para redes

Growth: campañas pagas (Meta, TikTok, Google), performance, adquisición, KPIs

Producto Digital: sitios web (WordPress, Shopify, VTEX), optimización para conversión, CRM, SEO
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
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error procesando la solicitud." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
