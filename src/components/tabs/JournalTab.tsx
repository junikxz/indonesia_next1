import { useState } from 'react';
import { PenLine, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function JournalTab() {
  const [journal, setJournal] = useState('');
  const [entries, setEntries] = useState([
    {
      date: new Date(Date.now() - 86400000).toISOString(),
      content: 'Hari ini cukup melelahkan, banyak tugas kuliah yang numpuk. Tapi aku senang bisa menyelesaikannya satu per satu.'
    }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!journal.trim()) return;
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setEntries([{ date: new Date().toISOString(), content: journal }, ...entries]);
      setJournal('');
      setIsSaving(false);
    }, 800);
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
          className="w-full min-h-[150px] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-y"
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
        {entries.map((entry, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
          >
            <p className="text-sm font-semibold text-emerald-500 mb-2">
              {format(new Date(entry.date), 'EEEE, d MMMM yyyy - HH:mm', { locale: id })}
            </p>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
