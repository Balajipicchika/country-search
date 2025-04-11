import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyD7daeKS1ZHzQQ-wTe1eTT3nPf3B1U51ns");

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    res.send({ response: text });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).send({ error: error.toString() });
  }
});

app.listen(5000, () => {
  console.log("🚀 Gemini backend running at http://localhost:5000");
});
