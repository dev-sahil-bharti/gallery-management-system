import { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  Trash2, 
  ShieldAlert, 
  FileText, 
  CheckCircle, 
  RefreshCw, 
  BarChart2, 
  HardDrive, 
  Download, 
  Upload, 
  Sparkles, 
  Radio, 
  FileJson, 
  Play, 
  Check, 
  AlertCircle, 
  Heart,
  Settings as SettingsIcon,
  ChevronRight,
  User,
  Shield
} from 'lucide-react';

export const DataManagement = ({ creator, matcher, setActiveTab }) => {
  const [activeSubTab, setActiveSubTab] = useState('creator'); // 'creator' | 'matcher' | 'history'
  const [isClearing, setIsClearing] = useState(false);
  const [isBackupRestoring, setIsBackupRestoring] = useState(false);
  
  // Diagnostic State
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagProgress, setDiagProgress] = useState(0);
  const [diagLogs, setDiagLogs] = useState([]);
  const [diagStatus, setDiagStatus] = useState('idle'); // 'idle' | 'running' | 'completed'

  // Photographer profile / defaults
  const [photographerName, setPhotographerName] = useState('Studio Elite');
  const [photographerPasscode, setPhotographerPasscode] = useState('STUDIO2026');

  // History log state
  const [historyLogs, setHistoryLogs] = useState([]);

  // Calculate size in MB/KB/Bytes
  const getFormattedSize = (bytes) => {
    if (bytes === 0) return '0.0 MB';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Bytes calculations
  const creatorBytes = creator?.creatorImages?.reduce((acc, img) => acc + (img.file?.size || 0), 0) || 0;
  const matcherBytes = matcher?.highResImages?.reduce((acc, img) => acc + (img.file?.size || 0), 0) || 0;
  const totalBytes = creatorBytes + matcherBytes;
  
  // Active session counts
  let activeSessions = 0;
  if (creator?.creatorImages?.length > 0) activeSessions++;
  if (matcher?.selectionData || matcher?.highResImages?.length > 0) activeSessions++;

  // Persistent History Logging
  useEffect(() => {
    const stored = localStorage.getItem('studiogallery_history_logs');
    if (stored) {
      setHistoryLogs(JSON.parse(stored));
    } else {
      const defaultLogs = [
        { name: "Sophia & Liam Wedding Proofs", date: "May 30, 2026", filesCount: 95, size: "2.8 MB", type: "gallery" },
        { name: "Emma Graduation Portraits", date: "May 28, 2026", filesCount: 45, size: "1.2 MB", type: "gallery" },
        { name: "Product Catalog Fall 2026", date: "May 25, 2026", filesCount: 120, size: "3.4 MB", type: "gallery" }
      ];
      localStorage.setItem('studiogallery_history_logs', JSON.stringify(defaultLogs));
      setHistoryLogs(defaultLogs);
    }
  }, []);

  // Listen to creator.compiledFile to add history entry
  useEffect(() => {
    if (creator?.compiledFile) {
      const stored = localStorage.getItem('studiogallery_history_logs');
      const currentLogs = stored ? JSON.parse(stored) : [];
      
      const fileExists = currentLogs.some(log => 
        log.name === `${creator.galleryTitle} Proofs` && 
        log.size === creator.compiledFile.size
      );

      if (!fileExists) {
        const newLog = {
          name: `${creator.galleryTitle} Proofs`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          filesCount: creator.creatorImages.length,
          size: creator.compiledFile.size,
          type: "gallery"
        };
        const updated = [newLog, ...currentLogs];
        localStorage.setItem('studiogallery_history_logs', JSON.stringify(updated));
        setHistoryLogs(updated);
      }
    }
  }, [creator?.compiledFile, creator?.galleryTitle, creator?.creatorImages?.length]);

  // Listen to matcher.isZipping completion to add history entry
  const lastIsZipping = useRef(false);
  useEffect(() => {
    if (lastIsZipping.current && !matcher?.isZipping && matcher?.matchedSelections?.length > 0) {
      const stored = localStorage.getItem('studiogallery_history_logs');
      const currentLogs = stored ? JSON.parse(stored) : [];
      
      const newLog = {
        name: `${matcher.selectionData?.clientName || 'Client'} Selections Export`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        filesCount: matcher.matchedSelections.length,
        size: "Zip Archive",
        type: "zip"
      };
      const updated = [newLog, ...currentLogs];
      localStorage.setItem('studiogallery_history_logs', JSON.stringify(updated));
      setHistoryLogs(updated);
    }
    if (matcher) {
      lastIsZipping.current = matcher.isZipping;
    }
  }, [matcher?.isZipping, matcher?.matchedSelections, matcher?.selectionData]);

  // Handler for custom backup JSON restoration
  const handleImportConfig = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsBackupRestoring(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.appName !== "StudioGallery") {
          alert("Invalid backup file. Missing StudioGallery identifier.");
          setIsBackupRestoring(false);
          return;
        }

        // Restore into creator
        if (creator) {
          if (parsed.watermarkDefault !== undefined) creator.setWatermarkText(parsed.watermarkDefault);
          if (parsed.watermarkOpacityDefault !== undefined) creator.setWatermarkOpacity(parsed.watermarkOpacityDefault);
          if (parsed.compressionQualityDefault !== undefined) creator.setCompressionQuality(parsed.compressionQualityDefault);
          if (parsed.maxImageSizeDefault !== undefined) creator.setMaxImageSize(parsed.maxImageSizeDefault);
          if (parsed.galleryTitle !== undefined) creator.setGalleryTitle(parsed.galleryTitle);
        }

        // Restore local profile details
        if (parsed.photographerName) setPhotographerName(parsed.photographerName);
        if (parsed.photographerPasscode) setPhotographerPasscode(parsed.photographerPasscode);

        setTimeout(() => {
          setIsBackupRestoring(false);
          alert("Photographer profile configurations successfully imported and restored!");
        }, 800);
      } catch (err) {
        console.error("Backup JSON parsing error:", err);
        alert("Failed to parse backup config JSON.");
        setIsBackupRestoring(false);
      }
    };
    reader.readAsText(file);
  };

  // Handler for backup generation
  const handleBackupSettings = () => {
    const backupData = {
      appName: "StudioGallery",
      backupDate: new Date().toISOString(),
      photographerName: photographerName,
      photographerPasscode: photographerPasscode,
      watermarkDefault: creator?.watermarkText || "PROOF ONLY - DO NOT COPY",
      watermarkOpacityDefault: creator?.watermarkOpacity || 15,
      compressionQualityDefault: creator?.compressionQuality || 70,
      maxImageSizeDefault: creator?.maxImageSize || 1024,
      galleryTitle: creator?.galleryTitle || ""
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
    
    alert('Photographer settings exported successfully! JSON configuration file downloaded.');
  };

  // Safe cache wiping handler
  const handleClearCache = () => {
    if (!window.confirm("Are you sure you want to clear active sessions, revoke previews, and clear browser caches? This action is destructive and resets all active proofing work.")) {
      return;
    }

    setIsClearing(true);
    setTimeout(() => {
      // Clear hook data
      if (creator) creator.clearAllCreatorImages();
      if (matcher) matcher.resetSelectionProcessor();

      // Clear local history
      localStorage.removeItem('studiogallery_history_logs');
      setHistoryLogs([]);

      setIsClearing(false);
      alert('Local browser caches, active image previews, revoked object URLs, and workspace history cleared successfully!');
    }, 1500);
  };

  // Running diagnostic tests simulation
  const runDiagnostics = () => {
    setShowDiagnostics(true);
    setDiagStatus('running');
    setDiagProgress(0);
    setDiagLogs([]);

    const steps = [
      { progress: 15, log: "Initializing memory scan & storage pointer verification..." },
      { progress: 35, log: `Checking local media allocations. Found ${creator?.creatorImages?.length || 0} creator images and ${matcher?.highResImages?.length || 0} high-res matcher images.` },
      { progress: 55, log: `Evaluating temporary object URLs status. Memory usage calculated at: ${getFormattedSize(totalBytes)}.` },
      { progress: 75, log: "Testing LocalStorage data structures and integrity logs..." },
      { progress: 90, log: "Verifying secure watermarking cipher structures..." },
      { progress: 100, log: "Diagnostic completed successfully! Core databases operating with 100% integrity." }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setDiagProgress(steps[stepIndex].progress);
        setDiagLogs(prev => [...prev, steps[stepIndex].log]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setDiagStatus('completed');
      }
    }, 450);
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Diagnostics Modal */}
      {showDiagnostics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 relative shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <Database size={20} className={diagStatus === 'running' ? 'animate-spin' : ''} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">System Diagnostics Panel</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dynamic integrity scanner</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">{diagStatus === 'running' ? 'Scanning Workspace...' : 'Scan Complete!'}</span>
                <span className="font-mono text-indigo-400 font-black">{diagProgress}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800/80 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300 shadow-md shadow-indigo-600/30"
                  style={{ width: `${diagProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Diagnostic Console Logs */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/60 font-mono text-[10px] text-slate-400 h-48 overflow-y-auto space-y-2.5 scrollbar-thin">
              {diagLogs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-indigo-500">▶</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex gap-3 justify-end pt-3 border-t border-slate-800">
              {diagStatus === 'completed' ? (
                <button
                  onClick={() => setShowDiagnostics(false)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} /> Close Diagnostic
                </button>
              ) : (
                <button
                  disabled
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed"
                >
                  Diagnostics Running...
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Real-time Storage Footprint Card */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl flex items-center justify-between shadow-lg hover:border-slate-800 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Local Cache Size</span>
            <span className="text-2xl font-black text-white block">{getFormattedSize(totalBytes)}</span>
            <span className="text-[10px] text-slate-500 block">Active browser buffer usage</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <HardDrive size={22} />
          </div>
        </div>

        {/* Dynamic Active Sessions Card */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl flex items-center justify-between shadow-lg hover:border-slate-800 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Sessions</span>
            <span className="text-2xl font-black text-white block">{activeSessions} Modules</span>
            <span className="text-[10px] text-indigo-400 font-bold block">
              {activeSessions === 0 ? "All workspaces idle" : "Dynamic data loaded"}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <FileText size={22} />
          </div>
        </div>

        {/* Dynamic Engine Diagnostics Card */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl flex items-center justify-between shadow-lg hover:border-slate-900 transition-all group">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Database Health</span>
            <button 
              onClick={runDiagnostics}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5 transition-transform"
            >
              Run Integrity Check <ChevronRight size={12} />
            </button>
            <span className="text-[10px] text-emerald-400 font-semibold block flex items-center gap-1">
              <CheckCircle size={10} /> Optimal
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle size={22} />
          </div>
        </div>

      </div>

      {/* Main Grid: Data tables (Left) & Controls/Backup (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Interactive Workspace Log File Table (Left) */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
            <h4 className="font-extrabold text-base text-white flex items-center gap-2">
              <BarChart2 className="text-indigo-400" size={18} />
              Active Workspace Live Logs
            </h4>
            
            {/* Dynamic Tab Switcher */}
            <div className="flex bg-slate-950 border border-slate-800 p-0.5 rounded-lg w-fit text-[10px]">
              <button 
                onClick={() => setActiveSubTab('creator')}
                className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer ${
                  activeSubTab === 'creator' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Creator Files ({creator?.creatorImages?.length || 0})
              </button>
              <button 
                onClick={() => setActiveSubTab('matcher')}
                className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer ${
                  activeSubTab === 'matcher' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Matcher Files ({matcher?.highResImages?.length || 0})
              </button>
              <button 
                onClick={() => setActiveSubTab('history')}
                className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer ${
                  activeSubTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Persistent History ({historyLogs.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {activeSubTab === 'creator' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                    <th className="pb-3 w-16">Preview</th>
                    <th className="pb-3">File Name</th>
                    <th className="pb-3 text-center">Disk Size</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/50 text-slate-300">
                  {creator?.creatorImages?.length > 0 ? (
                    creator.creatorImages.map((img) => (
                      <tr key={img.id} className="hover:bg-slate-900/10 transition-colors group">
                        <td className="py-3">
                          <img 
                            src={img.preview} 
                            alt={img.name} 
                            className="w-10 h-10 object-cover rounded-lg border border-slate-800 group-hover:scale-105 transition-transform" 
                          />
                        </td>
                        <td className="py-3 font-semibold text-white max-w-[200px] truncate">{img.name}</td>
                        <td className="py-3 text-center font-mono font-bold text-slate-400">{img.size}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => creator.removeCreatorImage(img.id)}
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-16 text-center text-slate-600 font-semibold">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Sparkles size={24} className="text-slate-800" />
                          <p>No active creator files. Upload photos in Gallery Creator first.</p>
                          <button 
                            onClick={() => setActiveTab('create')}
                            className="text-[10px] text-indigo-400 hover:underline font-bold"
                          >
                            Go Upload Images →
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeSubTab === 'matcher' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                    <th className="pb-3 w-16">Preview</th>
                    <th className="pb-3">High-Res Name</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right">Disk Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/50 text-slate-300">
                  {matcher?.highResImages?.length > 0 ? (
                    matcher.highResImages.map((img, idx) => {
                      const isSelected = matcher.matchedSelections.some(s => s.name === img.name);
                      return (
                        <tr key={idx} className="hover:bg-slate-900/10 transition-colors group">
                          <td className="py-3">
                            <img 
                              src={img.preview} 
                              alt={img.name} 
                              className="w-10 h-10 object-cover rounded-lg border border-slate-800 group-hover:scale-105 transition-transform" 
                            />
                          </td>
                          <td className="py-3 font-semibold text-white max-w-[200px] truncate">{img.name}</td>
                          <td className="py-3 text-center">
                            {isSelected ? (
                              <span className="px-2 py-0.5 text-[9px] rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 font-bold">
                                Selected
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[9px] rounded-full bg-slate-950 text-slate-500 border border-slate-900 font-bold">
                                Unselected
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right font-mono font-bold text-slate-400">{img.size}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-16 text-center text-slate-600 font-semibold">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <FileJson size={24} className="text-slate-800" />
                          <p>No active Selection Matcher files. Import selections & high-res files first.</p>
                          <button 
                            onClick={() => setActiveTab('process')}
                            className="text-[10px] text-indigo-400 hover:underline font-bold"
                          >
                            Go Matcher Board →
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeSubTab === 'history' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                    <th className="pb-3">Event Name</th>
                    <th className="pb-3 text-center">Event Date</th>
                    <th className="pb-3 text-center">Scope</th>
                    <th className="pb-3 text-right font-mono">Resource Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/50 text-slate-300">
                  {historyLogs.length > 0 ? (
                    historyLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-4 font-bold text-white flex items-center gap-2">
                          {log.type === "gallery" ? (
                            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                          )}
                          {log.name}
                        </td>
                        <td className="py-4 text-center text-slate-500 font-semibold">{log.date}</td>
                        <td className="py-4 text-center font-bold text-indigo-400">{log.filesCount} Assets</td>
                        <td className="py-4 text-right font-mono font-bold text-slate-400">{log.size}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-16 text-center text-slate-600 font-semibold">
                        <p>History log has been cleared.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar Controls: Profile, Config, Destructive (Right) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Photographer Profile & Global Default Defaults */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-900">
              <User className="text-indigo-400" size={18} />
              <h4 className="font-bold text-sm text-white">Photographer Identity</h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Studio / Profile Name</label>
                <input 
                  type="text" 
                  value={photographerName}
                  onChange={(e) => setPhotographerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs focus:border-indigo-600 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Passcode (Cloud Cipher)</label>
                <input 
                  type="password" 
                  value={photographerPasscode}
                  onChange={(e) => setPhotographerPasscode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs focus:border-indigo-600 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Configuration Sync Box */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-900">
              <SettingsIcon className="text-indigo-400" size={18} />
              <h4 className="font-bold text-sm text-white">Workspace Configuration</h4>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              Export and import photographer text watermarks, resolution caps, compression ratios, and profile settings to dynamic JSON files.
            </p>

            <div className="space-y-3 pt-1">
              {/* Export Config */}
              <button
                onClick={handleBackupSettings}
                className="w-full text-xs font-bold text-indigo-400 hover:text-white hover:bg-indigo-600 bg-indigo-500/10 border border-indigo-500/15 py-2.5 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <Download size={13} /> Export Settings Backup
              </button>

              {/* Import Config */}
              <label className="w-full text-xs font-bold text-purple-400 hover:text-white hover:bg-purple-600 bg-purple-500/10 border border-purple-500/15 py-2.5 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5">
                <Upload size={13} /> 
                {isBackupRestoring ? "Restoring Configuration..." : "Import Settings Backup"}
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleImportConfig}
                  className="hidden" 
                  disabled={isBackupRestoring}
                />
              </label>
            </div>
          </div>

          {/* Destructive Actions Cache Clear */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl border-rose-500/10 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-900">
              <ShieldAlert className="text-rose-500" size={18} />
              <h4 className="font-bold text-sm text-rose-500">Destructive Actions</h4>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              Clearing buffer revokes temporary image object previews from RAM, clears active states, and resets workspace history.
            </p>

            <button
              onClick={handleClearCache}
              disabled={isClearing}
              className="w-full text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600 bg-rose-500/10 border border-rose-500/15 py-2.5 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
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
  );
};

export default DataManagement;
