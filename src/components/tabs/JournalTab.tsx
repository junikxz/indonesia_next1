import { useState, useEffect } from 'react';
import { PenLine, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/lib/supabaseClient';

export default function JournalTab() {
  const [journal, setJournal] = useState('');
  const [entries, setEntries] = useState<{ id: string, created_at: string, description: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data dari database saat pertama kali load
  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Filter hanya yang depannya ada 📝 Jurnal (jika digabung dengan data AI), 
      // atau tampilkan semua jika mau
      const journalEntries = data?.filter(item => item.description.startsWith('📝 Jurnal:')) || [];
      setEntries(journalEntries as any);
    } catch (err) {
      console.error('Error fetching journals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!journal.trim()) return;
    setIsSaving(true);
    
    const newContent = `📝 Jurnal:\n${journal}`;
    
    try {
      const { data, error } = await supabase
        .from('history')
        .insert([{ description: newContent }])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setEntries([data[0] as any, ...entries]);
      } else {
        // Fallback optimis jika insert berhasil tapi select gagal
        setEntries([{ id: Date.now().toString(), created_at: new Date().toISOString(), description: newContent }, ...entries]);
      }
      setJournal('');
    } catch (err) {
      console.error('Error saving journal:', err);
      alert('Gagal menyimpan jurnal ke database.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <PenLine className="text-emerald-500" />
          <h2 className="text-xl font-bold text-slate-800">Tulis Jurnal Hari Ini</h2>
        </div>
        
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          placeholder="Ceritain kejadian menarik, hal yang bikin sedih, atau apapun yang ada di pikiranmu..."
          className="w-full min-h-[150px] p-4 text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-y"
        />
        
        <div className="flex justify-end mt-4">
          <button 
            onClick={handleSave}
            disabled={isSaving || !journal.trim()}
            className="bg-emerald-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Simpan Jurnal'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-lg ml-2">Jurnal Sebelumnya</h3>
        
        {isLoading ? (
          <p className="text-slate-500 ml-2 animate-pulse">Memuat jurnal dari database...</p>
        ) : entries.length === 0 ? (
          <p className="text-slate-500 ml-2">Belum ada jurnal yang ditulis. Yuk mulai nulis!</p>
        ) : (
          entries.map((entry, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={entry.id || i} 
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <p className="text-sm font-semibold text-emerald-500 mb-2">
                {format(new Date(entry.created_at), 'EEEE, d MMMM yyyy - HH:mm', { locale: id })}
              </p>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {entry.description.replace('📝 Jurnal:\n', '')}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
