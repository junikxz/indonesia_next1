import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

export async function POST(req: Request) {
  try {
    const { entries } = await req.json();

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: 'Journal entries are required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return NextResponse.json({
        summary: "Sepertinya belakangan ini kamu cukup sibuk, tapi kamu punya daya tahan (resilience) yang bagus. Terus pertahankan semangatmu dan jangan lupa istirahat ya!"
      });
    }

    const journalText = entries.map((e: any) => `- ${e.date}: ${e.content}`).join('\n');
    
    const prompt = `Berikut adalah beberapa catatan jurnal harian dari seorang anak muda belakangan ini:\n\n${journalText}\n\nTolong buatkan ringkasan singkat (maksimal 3 paragraf pendek) mengenai kondisi mental dan emosional mereka. Gunakan bahasa yang santai, empatik, dan suportif ala Gen-Z. Berikan 1-2 saran positif di akhir.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ summary: response.text || "Gagal membuat ringkasan." });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: 'Gagal memproses ringkasan.' },
      { status: 500 }
    );
  }
}
