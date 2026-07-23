import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '@/lib/supabaseClient';

// Inisialisasi Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

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
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      console.warn("GEMINI_API_KEY is not set. Returning mock data.");
      // MOCK DATA for testing purpose
      const mockResponse = [
        `Tumbler Kopi Custom untuk ${recipient} buat hadiah ${occasion}`,
        `Buku Self-Improvement yang cocok dibaca saat ${occasion}`,
        `Voucher Belanja senilai Rp 100.000 untuk ${recipient}`,
        `Lampu Tidur Estetik untuk mempercantik kamar`
      ];

      // Simpan mock data ke database Supabase untuk ngetes
      const { error: dbError } = await supabase
        .from('history') // Pastikan nama tabelnya adalah 'history'
        .insert([
          { description: `(MOCK) Ide Kado untuk ${recipient} dalam rangka ${occasion}:\n${mockResponse.join('\n')}` }
        ]);
        
      if (dbError) {
        console.error("Supabase Insert Error:", dbError);
      }

      return NextResponse.json({
        ideas: mockResponse
      });
    }

    // Pemanggilan Gemini AI sesungguhnya jika API key tersedia
    const prompt = `Kamu adalah seorang ahli pemberi saran hadiah. Berikan 4 ide hadiah yang kreatif, unik, dan bermanfaat berdasarkan siapa penerimanya dan apa acaranya. Format jawaban hanya berupa list ide tanpa nomor, dipisah dengan baris baru.\n\nTolong berikan ide kado untuk: ${recipient} dalam rangka ${occasion}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const aiResponse = response.text || "";
    const ideas = aiResponse.split('\n').filter(idea => idea.trim() !== '');

    // Simpan ke database Supabase
    const { error: dbError } = await supabase
      .from('history') // Pastikan nama tabelnya adalah 'history'
      .insert([
        { description: `Ide Kado untuk ${recipient} dalam rangka ${occasion}:\n${aiResponse}` }
      ]);
      
    if (dbError) {
      console.error("Supabase Insert Error:", dbError);
    }

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    );
  }
}
