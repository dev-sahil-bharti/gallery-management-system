import React, { useState } from 'react';
import { Database, Trash2, ShieldAlert, FileText, CheckCircle, RefreshCw, BarChart2, HardDrive } from 'lucide-react';

export const DataManagement = () => {
  const [cacheSize, setCacheSize] = useState('24.8 MB');
  const [sessionsCount, setSessionsCount] = useState(3);
  const [isClearing, setIsClearing] = useState(false);

  // Local storage sessions mock log
  const sessionLog = [
    { name: "Sophia & Liam Wedding Proofs", date: "May 30, 2026", filesCount: 95, size: "2.8 MB" },
    { name: "Emma Graduation Portraits", date: "May 28, 2026", filesCount: 45, size: "1.2 MB" },
    { name: "Product Catalog Fall 2026", date: "May 25, 2026", filesCount: 120, size: "3.4 MB" }
  ];

  const handleClearCache = () => {
    setIsClearing(true);
    setTimeout(() => {
      setCacheSize('0.0 MB');
      setSessionsCount(0);
      setIsClearing(false);
      alert('Local browser caches, image previews, and IndexedDB schemas cleared successfully!');
    }, 1500);
  };

  const handleBackupSettings = () => {
    const backupData = {
      appName: "StudioGallery",
      backupDate: new Date().toISOString(),
      watermarkDefault: "PROOF ONLY - DO NOT COPY",
      watermarkOpacityDefault: 15,
      compressionQualityDefault: 70,
      maxImageSizeDefault: 1024
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `studiogallery_settings_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Photographer settings backed up successfully! File downloaded.');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Upper Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Storage Card */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Local Cache Size</span>
            <span className="text-2xl font-black text-white block">{cacheSize}</span>
            <span className="text-[10px] text-slate-500 block">Of 512 MB IndexedDB limit</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <HardDrive size={22} />
          </div>
        </div>

        {/* Sessions Card */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Sessions</span>
            <span className="text-2xl font-black text-white block">{sessionsCount} Sessions</span>
            <span className="text-[10px] text-indigo-400 font-semibold block">Stored locally</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <FileText size={22} />
          </div>
        </div>

        {/* Database Integrity Card */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Database Health</span>
            <span className="text-2xl font-black text-emerald-400 block">Optimal</span>
            <span className="text-[10px] text-slate-500 block">All indexes operating normally</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle size={22} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Table of session logs */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-extrabold text-base text-white flex items-center gap-2">
              <BarChart2 className="text-indigo-400" size={18} />
              Photographer Workspace Logs
            </h4>
            <span className="text-xs bg-slate-950 text-indigo-400 border border-slate-900 px-3 py-1 rounded-lg font-semibold">
              Total Space: 7.4 MB
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="pb-4">Gallery Name</th>
                  <th className="pb-4">Build Date</th>
                  <th className="pb-4 text-center">Proofs Size</th>
                  <th className="pb-4 text-right">Disk Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50 text-slate-300">
                {sessionsCount > 0 ? (
                  sessionLog.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-4 font-bold text-white">{log.name}</td>
                      <td className="py-4 text-slate-500">{log.date}</td>
                      <td className="py-4 text-center font-bold">{log.filesCount} Images</td>
                      <td className="py-4 text-right font-mono font-bold text-slate-400">{log.size}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-600 font-semibold">
                      Workspace is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance Box */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-900">
            <Database className="text-indigo-400" size={18} />
            <h4 className="font-bold text-base text-white">System Maintenance</h4>
          </div>

          <div className="space-y-4">
            
            {/* Backup Settings */}
            <div className="bg-slate-950/80 border border-slate-900 p-4.5 rounded-2xl space-y-3">
              <h5 className="font-bold text-xs text-white">Backup Configuration</h5>
              <p className="text-[11px] text-slate-400 leading-normal">
                Export photographer profiles, default text watermarks, and resolution parameters to a JSON backup.
              </p>
              <button
                onClick={handleBackupSettings}
                className="w-full text-xs font-bold text-indigo-400 hover:text-white hover:bg-indigo-600 bg-indigo-500/10 border border-indigo-500/15 py-3 rounded-xl transition-all cursor-pointer text-center"
              >
                Download Config Backup
              </button>
            </div>

            {/* Wipe Caches */}
            <div className="bg-slate-950/80 border border-slate-900 p-4.5 rounded-2xl border-rose-500/10 space-y-3">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert size={14} />
                <h5 className="font-bold text-xs text-rose-400">Destructive Actions</h5>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Clearing temporary preview URLs deletes client-side JPEG thumbnails to save computer memory.
              </p>
              <button
                onClick={handleClearCache}
                disabled={isClearing}
                className="w-full text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600 bg-rose-500/10 border border-rose-500/15 py-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2"
              >
                {isClearing ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    Clearing Storage...
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    Wipe Temporary Previews
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default DataManagement;
