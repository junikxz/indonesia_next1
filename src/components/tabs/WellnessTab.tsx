import { useState, useEffect } from 'react';
import { Play, Coffee, Activity, Moon, X, Stars } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WellnessTab() {
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [stretchStep, setStretchStep] = useState(0);

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

  const stretchInstructions = [
    "Siap-siap...",
    "Tarik napas panjang, luruskan punggung.",
    "Putar leher ke kanan perlahan...",
    "Tahan... 3", "Tahan... 2", "Tahan... 1",
    "Kembali ke tengah.",
    "Putar leher ke kiri perlahan...",
    "Tahan... 3", "Tahan... 2", "Tahan... 1",
    "Kembali ke tengah.",
    "Tarik bahu ke atas dekat telinga...",
    "Lepaskan sambil buang napas perlahan.",
    "Selesai! Kamu hebat."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeActivity === 'stretch') {
      setStretchStep(0);
      interval = setInterval(() => {
        setStretchStep((prev) => {
          if (prev >= stretchInstructions.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeActivity]);

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

        {activeActivity === 'stretch' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-blue-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <button 
              onClick={() => setActiveActivity(null)}
              className="absolute top-8 right-8 p-3 bg-white rounded-full shadow-sm text-slate-500 hover:text-slate-800"
            >
              <X size={24} />
            </button>
            <div className="w-24 h-24 bg-blue-200 text-blue-600 rounded-full flex items-center justify-center mb-8 mx-auto">
              <Activity size={48} />
            </div>
            
            <AnimatePresence mode="wait">
              <motion.h2
                key={stretchStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-4xl md:text-5xl font-bold text-blue-600"
              >
                {stretchInstructions[stretchStep]}
              </motion.h2>
            </AnimatePresence>

            {stretchStep === stretchInstructions.length - 1 && (
              <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => setActiveActivity(null)}
                className="mt-12 bg-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-600 transition-colors"
              >
                Tutup
              </motion.button>
            )}
          </motion.div>
        )}

        {activeActivity === 'sleep' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white"
          >
            <button 
              onClick={() => setActiveActivity(null)}
              className="absolute top-8 right-8 p-3 bg-slate-800 rounded-full shadow-sm text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 left-20 opacity-20"
            >
              <Stars size={120} />
            </motion.div>
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-20 right-20 opacity-20"
            >
              <Stars size={80} />
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 2 }}
              className="z-10"
            >
              <Moon size={64} className="text-indigo-300 mx-auto mb-8" />
              <h2 className="text-4xl font-light tracking-wide mb-6">Matikan Layarmu.</h2>
              <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                Sudah waktunya istirahat. Kurangi cahaya dari layarmu, bernapas perlahan, dan biarkan dirimu terlelap.<br/><br/>
                Kamu sudah bekerja keras hari ini.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
