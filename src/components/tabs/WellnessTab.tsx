import { Play, Coffee, Activity, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WellnessTab() {
  const activities = [
    {
      title: 'Mindful Breathing',
      desc: 'Latihan pernapasan 5 menit untuk meredakan cemas.',
      icon: <Coffee className="text-orange-500" size={24} />,
      bg: 'bg-orange-50',
      border: 'border-orange-100'
    },
    {
      title: 'Stretching Ringan',
      desc: 'Peregangan otot leher dan pundak buat kamu yang kelamaan nugas.',
      icon: <Activity className="text-blue-500" size={24} />,
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      title: 'Sleep Hygiene',
      desc: 'Panduan bersiap tidur agar lebih nyenyak malam ini.',
      icon: <Moon className="text-indigo-500" size={24} />,
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Waktunya Recharge 🔋</h2>
        <p className="text-slate-500 mt-2">Pilih aktivitas ringan ini buat balikin energi kamu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activities.map((act, i) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={i} 
            className={`p-6 rounded-3xl border ${act.bg} ${act.border} flex flex-col justify-between`}
          >
            <div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                {act.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{act.title}</h3>
              <p className="text-slate-600 mt-2 text-sm">{act.desc}</p>
            </div>
            
            <button className="mt-6 bg-white text-slate-800 font-semibold py-3 px-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors w-full">
              <Play size={16} /> Mulai
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
