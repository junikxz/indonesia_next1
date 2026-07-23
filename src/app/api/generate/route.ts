import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inisialisasi OpenAI client (dibutuhkan API key di env)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key', 
});

export async function POST(req: Request) {
  try {
    const { recipient, occasion } = await req.json();

    if (!recipient || !occasion) {
      return NextResponse.json(
        { error: 'Recipient and occasion are required' },
        { status: 400 }
      );
    }

    // Jika API Key tidak diset (karena ini latihan), kita berikan response dummy
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
      console.warn("OPENAI_API_KEY is not set. Returning mock data.");
      // MOCK DATA for testing purpose
      return NextResponse.json({
        ideas: [
          `Tumbler Kopi Custom untuk ${recipient} buat hadiah ${occasion}`,
          `Buku Self-Improvement yang cocok dibaca saat ${occasion}`,
          `Voucher Belanja senilai Rp 100.000 untuk ${recipient}`,
          `Lampu Tidur Estetik untuk mempercantik kamar`
        ]
      });
    }

    // Pemanggilan AI sesungguhnya jika API key tersedia
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Kamu adalah seorang ahli pemberi saran hadiah. Berikan 4 ide hadiah yang kreatif, unik, dan bermanfaat berdasarkan siapa penerimanya dan apa acaranya. Format jawaban hanya berupa list ide tanpa nomor, dipisah dengan baris baru."
        },
        {
          role: "user",
          content: `Tolong berikan ide kado untuk: ${recipient} dalam rangka ${occasion}`
        }
      ],
      model: "gpt-3.5-turbo",
    });

    const aiResponse = completion.choices[0].message.content || "";
    const ideas = aiResponse.split('\n').filter(idea => idea.trim() !== '');

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    );
  }
}
