import { useState } from 'react';
import { Phone, MessageSquare, Star, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfessionalTab() {
  const [selectedPsikolog, setSelectedPsikolog] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);

  const psychologists = [
    {
      name: 'Dr. Sarah Prameswari',
      spec: 'Kecemasan & Depresi',
      rating: 4.9,
      exp: '8 Tahun',
      image: 'https://i.pravatar.cc/150?img=47',
      price: 'Rp 150.000 / sesi',
      availability: 'Tersedia Hari Ini, 14:00'
    },
    {
      name: 'Budi Santoso, M.Psi',
      spec: 'Manajemen Stres & Karir',
      rating: 4.8,
      exp: '5 Tahun',
      image: 'https://i.pravatar.cc/150?img=11',
      price: 'Rp 120.000 / sesi',
      availability: 'Besok, 09:00'
    },
    {
      name: 'Nadia Larasati, M.Psi',
      spec: 'Hubungan & Keluarga',
      rating: 5.0,
      exp: '10 Tahun',
      image: 'https://i.pravatar.cc/150?img=5',
      price: 'Rp 200.000 / sesi',
      availability: 'Tersedia Hari Ini, 19:00'
    }
  ];

  const handleBooking = () => {
    setIsBooking(true);
    setTimeout(() => {
      setSelectedPsikolog(null);
      setIsBooking(false);
      alert('Berhasil membuat jadwal konsultasi! Tautan chat akan dikirim via Email/WhatsApp.');
    }, 1500);
  };

  return (
    <div className="space-y-6 relative">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Butuh Bantuan Profesional?</h2>
        <p className="text-blue-50">Jangan ragu untuk mencari bantuan ahli. Ceritakan masalahmu pada psikolog tersertifikasi kami.</p>
        
        <button 
          onClick={() => alert('Menghubungi hotline darurat (119 ext 8)...')}
          className="mt-6 bg-white text-blue-600 font-bold py-3 px-6 rounded-xl shadow-md hover:bg-blue-50 transition-colors flex items-center gap-2"
        >
          <Phone size={20} /> Konsultasi Darurat (Gratis)
        </button>
      </div>

      <h3 className="font-bold text-slate-800 text-xl ml-2">Pilih Psikolog</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {psychologists.map((psi, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <img src={psi.image} alt={psi.name} className="w-24 h-24 rounded-full mb-4 border-4 border-slate-50 object-cover" />
            <h4 className="font-bold text-slate-800 text-lg">{psi.name}</h4>
            <p className="text-emerald-500 font-medium text-sm mt-1">{psi.spec}</p>
            
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-yellow-400" /> {psi.rating}</span>
              <span>•</span>
              <span>Exp: {psi.exp}</span>
            </div>

            <button 
              onClick={() => setSelectedPsikolog(psi)}
              className="mt-6 w-full bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors flex justify-center items-center gap-2"
            >
              <MessageSquare size={18} /> Chat Sekarang
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedPsikolog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative"
            >
              <button 
                onClick={() => !isBooking && setSelectedPsikolog(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800"
                disabled={isBooking}
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6">
                <img src={selectedPsikolog.image} alt={selectedPsikolog.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-emerald-50" />
                <h3 className="text-xl font-bold text-slate-800">{selectedPsikolog.name}</h3>
                <p className="text-slate-500">{selectedPsikolog.spec}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Jadwal Terdekat</span>
                  <span className="font-semibold text-slate-800">{selectedPsikolog.availability}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-slate-500">Biaya Konsultasi</span>
                  <span className="font-semibold text-emerald-600">{selectedPsikolog.price}</span>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                disabled={isBooking}
                className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 disabled:opacity-70 transition-colors flex justify-center items-center gap-2"
              >
                {isBooking ? 'Memproses...' : (
                  <><CheckCircle2 size={20} /> Konfirmasi Jadwal</>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
