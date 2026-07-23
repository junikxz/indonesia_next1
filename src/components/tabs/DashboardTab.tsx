import { useState, useEffect } from 'react';
import { Smile, Meh, Frown, Activity, Heart, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, isAfter } from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardTab() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSavingMood, setIsSavingMood] = useState(false);
  const [weeklyAnalysis, setWeeklyAnalysis] = useState<string | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
  
  const today = format(new Date(), 'EEEE, d MMMM yyyy', { locale: id });

  const moods = [
    { id: 'great', icon: <Smile size={32} />, label: 'Luar Biasa', color: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 border-emerald-200' },
    { id: 'good', icon: <Smile size={32} />, label: 'Baik', color: 'bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-200' },
    { id: 'okay', icon: <Meh size={32} />, label: 'Biasa Aja', color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 border-yellow-200' },
    { id: 'bad', icon: <Frown size={32} />, label: 'Buruk', color: 'bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200' },
    { id: 'awful', icon: <Frown size={32} />, label: 'Sangat Buruk', color: 'bg-red-100 text-red-600 hover:bg-red-200 border-red-200' },
  ];

  useEffect(() => {
    fetchWeeklyMoods();
  }, []);

  const fetchWeeklyMoods = async () => {
    setIsLoadingAnalysis(true);
    try {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      
      const { data, error } = await supabase
        .from('history')
        .select('description, created_at')
        .gte('created_at', sevenDaysAgo)
        .like('description', '😊 Mood:%');
        
      if (error) throw error;

      if (!data || data.length === 0) {
        setWeeklyAnalysis("Belum ada data mood minggu ini. Yuk, check-in setiap hari!");
      } else {
        // Simple heuristic analysis for hackathon
        const moodCounts: any = { 'Luar Biasa': 0, 'Baik': 0, 'Biasa Aja': 0, 'Buruk': 0, 'Sangat Buruk': 0 };
        data.forEach(item => {
          const moodLabel = item.description.replace('😊 Mood: ', '').trim();
          if (moodCounts[moodLabel] !== undefined) {
            moodCounts[moodLabel]++;
          }
        });
        
        let dominantMood = '';
        let max = -1;
        Object.entries(moodCounts).forEach(([mood, count]: any) => {
          if (count > max) { max = count; dominantMood = mood; }
        });

        if (dominantMood === 'Luar Biasa' || dominantMood === 'Baik') {
          setWeeklyAnalysis(`Bagus sekali! Minggu ini kamu paling sering merasa ${dominantMood} (${max} kali). Pertahankan energi positifmu!`);
        } else if (dominantMood === 'Biasa Aja') {
          setWeeklyAnalysis(`Minggu ini terasa datar karena kamu sering merasa ${dominantMood} (${max} kali). Coba cari aktivitas baru yang menyenangkan!`);
        } else {
          setWeeklyAnalysis(`Sepertinya minggu ini cukup berat, kamu sering merasa ${dominantMood} (${max} kali). Jangan lupa istirahat yang cukup dan luangkan waktu untuk relaksasi.`);
        }
      }
    } catch (err) {
      console.error(err);
      setWeeklyAnalysis("Gagal memuat analisis mood mingguan.");
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleMoodSelect = async (moodId: string, moodLabel: string) => {
    setSelectedMood(moodId);
    setIsSavingMood(true);
    
    try {
      const { error } = await supabase
        .from('history')
        .insert([{ description: `😊 Mood: ${moodLabel}` }]);
        
      if (error) throw error;
      
      // Refresh analysis
      fetchWeeklyMoods();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan mood ke database.');
    } finally {
      setIsSavingMood(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Bestie! ✨</h1>
          <p className="text-emerald-50 flex items-center gap-2">
            <Calendar size={16} /> {today}
          </p>
        </div>
        <div className="absolute -right-4 -bottom-10 opacity-20">
          <Heart size={160} />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Gimana perasaanmu hari ini?</h2>
        <div className="flex flex-wrap gap-4 justify-between sm:justify-start">
          {moods.map((mood) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id, mood.label)}
              disabled={isSavingMood}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all w-24 ${
                selectedMood === mood.id ? mood.color + ' ring-4 ring-opacity-50 ring-offset-2 ring-emerald-400' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
              } ${isSavingMood ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {mood.icon}
              <span className="text-xs font-semibold text-center">{mood.label}</span>
            </motion.button>
          ))}
        </div>
        
        <AnimatePresence>
          {selectedMood && (
            <motion.div 
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              className="mt-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 flex items-start gap-3"
            >
              <Activity className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Bagus banget udah mau check-in!</p>
                <p className="text-sm mt-1">Mood kamu sudah disimpan. Apapun perasaanmu valid kok, jangan ragu ke tab Chat kalau mau cerita.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-500" /> Analisis Mood 7 Hari Terakhir
            </h3>
            {isLoadingAnalysis ? (
              <p className="text-slate-500 text-sm mt-4 animate-pulse">Menghitung data mingguanmu...</p>
            ) : (
              <p className="text-slate-600 text-sm mt-4 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {weeklyAnalysis}
              </p>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl p-6 shadow-sm text-white">
          <h3 className="font-bold mb-2 flex items-center gap-2">Quote of the Day</h3>
          <blockquote className="mt-4 text-lg font-medium italic opacity-90">
            "It’s okay not to be okay. Take your time, heal at your own pace."
          </blockquote>
        </div>
      </div>
    </div>
  );
}
