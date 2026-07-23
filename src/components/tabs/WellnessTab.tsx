import { useState } from 'react';
import { Play, Coffee, Activity, Moon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WellnessTab() {
  const [activeActivity, setActiveActivity] = useState<string | null>(null);

  const activities = [
    {
      id: 'breathe',
      title: 'Mindful Breathing',
      desc: 'Latihan pernapasan meredakan cemas.',
      icon: <Coffee className="text-orange-500" size={24} />,
      bg: 'bg-orange-50',
      border: 'border-orange-100'
    },
    {
      id: 'stretch',
      title: 'Stretching Ringan',
      desc: 'Peregangan leher buat yang kelamaan nugas.',
      icon: <Activity className="text-blue-500" size={24} />,
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      id: 'sleep',
      title: 'Sleep Hygiene',
      desc: 'Persiapan agar tidur malam lebih nyenyak.',
      icon: <Moon className="text-indigo-500" size={24} />,
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Waktunya Recharge 🔋</h2>
        <p className="text-slate-500 mt-2">Pilih aktivitas ringan ini buat balikin energi kamu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activities.map((act) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={act.id} 
            className={`p-6 rounded-3xl border ${act.bg} ${act.border} flex flex-col justify-between`}
          >
            <div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                {act.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{act.title}</h3>
              <p className="text-slate-600 mt-2 text-sm">{act.desc}</p>
            </div>
            
            <button 
              onClick={() => setActiveActivity(act.id)}
              className="mt-6 bg-white text-slate-800 font-semibold py-3 px-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors w-full"
            >
              <Play size={16} /> Mulai
            </button>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Overlay Animation */}
      <AnimatePresence>
        {activeActivity === 'breathe' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-orange-50 flex flex-col items-center justify-center"
          >
            <button 
              onClick={() => setActiveActivity(null)}
              className="absolute top-8 right-8 p-3 bg-white rounded-full shadow-sm text-slate-500 hover:text-slate-800"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold text-orange-600 mb-12">Tarik Napas Dalam...</h2>
            
            <motion.div
              animate={{
                scale: [1, 2, 2, 1, 1],
                opacity: [0.5, 1, 1, 0.5, 0.5]
              }}
              transition={{
                duration: 8,
                ease: "easeInOut",
                times: [0, 0.4, 0.5, 0.9, 1],
                repeat: Infinity,
              }}
              className="w-48 h-48 bg-gradient-to-tr from-orange-300 to-yellow-300 rounded-full shadow-2xl flex items-center justify-center text-white font-bold text-xl"
            >
              <motion.span
                animate={{ opacity: [1, 0, 0, 1, 1] }}
                transition={{ duration: 8, times: [0, 0.4, 0.5, 0.9, 1], repeat: Infinity }}
              >
                Inhale
              </motion.span>
              <motion.span
                className="absolute"
                animate={{ opacity: [0, 1, 1, 0, 0] }}
                transition={{ duration: 8, times: [0, 0.4, 0.5, 0.9, 1], repeat: Infinity }}
              >
                Exhale
              </motion.span>
            </motion.div>
            <p className="mt-12 text-slate-500 font-medium text-lg text-center px-4">
              Ikuti irama lingkaran ini.<br/>Tarik napas saat membesar, hembuskan saat mengecil.
            </p>
          </motion.div>
        )}

        {/* Other activities placeholder modal */}
        {(activeActivity === 'stretch' || activeActivity === 'sleep') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full relative"
            >
              <button 
                onClick={() => setActiveActivity(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Play size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Segera Hadir!</h3>
              <p className="text-slate-500 text-center">Modul video dan animasi interaktif untuk sesi ini sedang dalam tahap pengembangan (Hackathon mode!).</p>
              <button 
                onClick={() => setActiveActivity(null)}
                className="mt-8 w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Kembali
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
