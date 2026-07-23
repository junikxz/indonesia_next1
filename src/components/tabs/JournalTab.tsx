import { useState, useEffect } from 'react';
import { PenLine, Save, Mic, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/lib/supabaseClient';
import { useSpeechToText } from '@/hooks/useSpeechToText';

export default function JournalTab() {
  const [journal, setJournal] = useState('');
  const [entries, setEntries] = useState<{ id: string, created_at: string, description: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryData, setSummaryData] = useState<string | null>(null);
  const { isListening, transcript, toggleListening, setTranscript } = useSpeechToText();

  useEffect(() => {
    if (transcript) {
      setJournal((prev) => {
        const base = prev.replace(new RegExp(transcript.slice(0, -10) + '.*$'), ''); 
        return transcript;
      });
    }
  }, [transcript]);

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
    setTranscript('');
    
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

  const handleSummarize = async () => {
    if (entries.length === 0) return;
    setIsSummarizing(true);
    try {
      const response = await fetch('/api/journal/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: entries.slice(0, 5).map(e => ({
            date: format(new Date(e.created_at), 'd MMMM yyyy', { locale: id }),
            content: e.description.replace('📝 Jurnal:\n', '')
          }))
        })
      });
      const data = await response.json();
      setSummaryData(data.summary || data.error);
    } catch (err) {
      setSummaryData('Gagal menganalisis jurnal.');
    } finally {
      setIsSummarizing(false);
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
        
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Mic size={18} /> {isListening ? 'Mendengarkan...' : 'Gunakan Suara'}
          </button>
          
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
        <div className="flex items-center justify-between ml-2">
          <h3 className="font-bold text-slate-800 text-lg">Jurnal Sebelumnya</h3>
          {entries.length > 0 && (
            <button 
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-1.5 px-3 rounded-lg font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <Sparkles size={14} /> {isSummarizing ? 'Menganalisis...' : 'Analisis AI'}
            </button>
          )}
        </div>

        <AnimatePresence>
          {summaryData && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 text-indigo-900 shadow-sm"
            >
              <h4 className="font-bold mb-2 flex items-center gap-2"><Sparkles size={16} /> Insight Kondisi Mentalmu</h4>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{summaryData}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
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
