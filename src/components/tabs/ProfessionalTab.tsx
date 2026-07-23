import { Phone, MessageSquare, Star } from 'lucide-react';

export default function ProfessionalTab() {
  const psychologists = [
    {
      name: 'Dr. Sarah Prameswari',
      spec: 'Kecemasan & Depresi',
      rating: 4.9,
      exp: '8 Tahun',
      image: 'https://i.pravatar.cc/150?img=47'
    },
    {
      name: 'Budi Santoso, M.Psi',
      spec: 'Manajemen Stres & Karir',
      rating: 4.8,
      exp: '5 Tahun',
      image: 'https://i.pravatar.cc/150?img=11'
    },
    {
      name: 'Nadia Larasati, M.Psi',
      spec: 'Hubungan & Keluarga',
      rating: 5.0,
      exp: '10 Tahun',
      image: 'https://i.pravatar.cc/150?img=5'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Butuh Bantuan Profesional?</h2>
        <p className="text-blue-50">Jangan ragu untuk mencari bantuan ahli. Ceritakan masalahmu pada psikolog tersertifikasi kami.</p>
        
        <button className="mt-6 bg-white text-blue-600 font-bold py-3 px-6 rounded-xl shadow-md hover:bg-blue-50 transition-colors flex items-center gap-2">
          <Phone size={20} /> Konsultasi Darurat (Gratis)
        </button>
      </div>

      <h3 className="font-bold text-slate-800 text-xl ml-2">Pilih Psikolog</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {psychologists.map((psi, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <img src={psi.image} alt={psi.name} className="w-24 h-24 rounded-full mb-4 border-4 border-slate-50 object-cover" />
            <h4 className="font-bold text-slate-800 text-lg">{psi.name}</h4>
            <p className="text-emerald-500 font-medium text-sm mt-1">{psi.spec}</p>
            
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-yellow-400" /> {psi.rating}</span>
              <span>•</span>
              <span>Exp: {psi.exp}</span>
            </div>

            <button className="mt-6 w-full bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors flex justify-center items-center gap-2">
              <MessageSquare size={18} /> Chat Sekarang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
