'use client';

import { useState } from 'react';
import { LayoutDashboard, MessageCircleHeart, BookHeart, Activity, Stethoscope } from 'lucide-react';
import DashboardTab from '@/components/tabs/DashboardTab';
import ChatTab from '@/components/tabs/ChatTab';
import JournalTab from '@/components/tabs/JournalTab';
import WellnessTab from '@/components/tabs/WellnessTab';
import ProfessionalTab from '@/components/tabs/ProfessionalTab';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={24} /> },
    { id: 'chat', label: 'AI Chat', icon: <MessageCircleHeart size={24} /> },
    { id: 'journal', label: 'Journal', icon: <BookHeart size={24} /> },
    { id: 'wellness', label: 'Wellness', icon: <Activity size={24} /> },
    { id: 'professional', label: 'Professional', icon: <Stethoscope size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-12">
          <div className="bg-emerald-500 p-2 rounded-xl">
            <HeartLogo />
          </div>
          <span className="text-2xl font-extrabold text-slate-800 tracking-tight">MindHealth</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${
                activeTab === tab.id 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <div className={`${activeTab === tab.id ? 'scale-110' : ''} transition-transform`}>
                {tab.icon}
              </div>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto mb-20 md:mb-0">
        <div className="max-w-4xl mx-auto">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-6">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <HeartLogo size={16} />
            </div>
            <span className="text-xl font-extrabold text-slate-800">MindHealth</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <DashboardTab />}
              {activeTab === 'chat' && <ChatTab />}
              {activeTab === 'journal' && <JournalTab />}
              {activeTab === 'wellness' && <WellnessTab />}
              {activeTab === 'professional' && <ProfessionalTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-2 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center p-2 rounded-xl min-w-[4rem] ${
              activeTab === tab.id ? 'text-emerald-500' : 'text-slate-400'
            }`}
          >
            <div className={`${activeTab === tab.id ? 'scale-110' : ''} transition-transform mb-1`}>
              {tab.icon}
            </div>
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}

function HeartLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
}
