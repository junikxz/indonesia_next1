import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return NextResponse.json({
        response: "Halo! Saya adalah MindHealth bot. Saat ini saya menggunakan mode dummy karena API key belum diatur. Coba ceritakan apa yang kamu rasakan hari ini?"
      });
    }

    const systemPrompt = "Kamu adalah MindHealth, sahabat AI yang empatik, ramah, dan suportif khusus untuk membantu kesehatan mental (mental wellness) anak muda (Gen Z). Gunakan gaya bahasa yang santai, gaul tapi sopan (pakai aku-kamu, kadang ada kata seperti 'banget', 'sih', 'ya'). Berikan tanggapan yang menenangkan, validasi perasaan mereka, dan berikan saran praktis seperti olahraga ringan, mindfulness, atau saran untuk istirahat. Jika mereka menyebutkan keinginan menyakiti diri sendiri atau masalah sangat berat, sarankan mereka dengan lembut untuk mencari bantuan profesional (psikolog).";

    // Build the prompt for Gemini
    // We map the conversation history to a string block since generateContent takes simple contents array
    let conversationContext = messages.map(m => `${m.role === 'user' ? 'User' : 'MindHealth'}: ${m.content}`).join('\n');
    
    const prompt = `${systemPrompt}\n\nPercakapan sejauh ini:\n${conversationContext}\n\nMindHealth:`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const aiResponse = response.text || "Maaf, aku lagi kurang fokus nih. Boleh ulangi lagi?";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: 'Gagal memproses pesan.' },
      { status: 500 }
    );
  }
}
