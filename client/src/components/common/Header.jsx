import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  FileJson, 
  Radio, 
  Database, 
  ChevronDown, 
  FileText, 
  Eye, 
  CheckSquare, 
  Wrench, 
  Settings as SettingsIcon, 
  HelpCircle,
  FolderOpen
} from 'lucide-react';

export const Header = ({ activeTab, setActiveTab, onMenuAction }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menuName) => {
    if (activeDropdown === menuName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menuName);
    }
  };

  const handleAction = (action) => {
    setActiveDropdown(null);
    if (onMenuAction) {
      onMenuAction(action);
    } else {
      alert(`Triggered action: ${action}`);
    }
  };

  // Define menus config
  const menus = {
    file: {
      label: 'File',
      icon: <FileText size={13} />,
      items: [
        { label: 'New Proof Session', shortcut: 'Ctrl+N', action: 'new_session' },
        { label: 'Open Selection JSON...', shortcut: 'Ctrl+O', action: 'open_json' },
        { label: 'Export Preferences', shortcut: '', action: 'export_prefs' },
        { label: 'Exit Application', shortcut: 'Alt+F4', action: 'exit' },
      ]
    },
    view: {
      label: 'View',
      icon: <Eye size={13} />,
      items: [
        { label: 'Toggle Fullscreen', shortcut: 'F11', action: 'toggle_fullscreen' },
        { label: 'Reset Zoom', shortcut: 'Ctrl+0', action: 'reset_zoom' },
        { label: 'Toggle Sidebar Config', shortcut: 'Ctrl+B', action: 'toggle_sidebar' },
      ]
    },
    selection: {
      label: 'Selection',
      icon: <CheckSquare size={13} />,
      items: [
        { label: 'Select All Matches', shortcut: 'Ctrl+A', action: 'select_all' },
        { label: 'Clear Current Matches', shortcut: '', action: 'clear_matches' },
        { label: 'Invert Selections', shortcut: 'Ctrl+I', action: 'invert_selections' },
      ]
    },
    tools: {
      label: 'Tools',
      icon: <Wrench size={13} />,
      items: [
        { label: 'Lightroom Query Builder', shortcut: '', action: 'tool_lightroom' },
        { label: 'Batch File Renamer', shortcut: '', action: 'tool_rename' },
        { label: 'Base64 cipher Scrambler', shortcut: '', action: 'tool_cipher' },
      ]
    },
    settings: {
      label: 'Settings',
      icon: <SettingsIcon size={13} />,
      items: [
        { label: 'Photographer Profile', shortcut: '', action: 'settings_profile' },
        { label: 'Watermark Defaults', shortcut: '', action: 'settings_watermark' },
        { label: 'Default Output Paths', shortcut: '', action: 'settings_paths' },
      ]
    },
    help: {
      label: 'Help',
      icon: <HelpCircle size={13} />,
      items: [
        { label: 'User Documentation', shortcut: 'F1', action: 'help_docs' },
        { label: 'Keyboard Shortcuts', shortcut: '', action: 'help_keys' },
        { label: 'Check for Updates...', shortcut: '', action: 'help_updates' },
        { label: 'About StudioGallery', shortcut: '', action: 'help_about' },
      ]
    }
  };

  return (
    <header className="border-b border-slate-900 bg-slate-950 sticky top-0 z-50">
      
      {/* 1. Sleek Top App Menubar (Desktop Simulation) */}
      <div className="bg-slate-950/90 border-b border-slate-900/60 py-1.5 px-6 flex items-center justify-between text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          {Object.keys(menus).map((key) => {
            const menu = menus[key];
            const isOpen = activeDropdown === key;
            return (
              <div key={key} className="relative">
                <button
                  onClick={() => toggleDropdown(key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-medium hover:bg-slate-900 hover:text-slate-200 ${
                    isOpen ? 'bg-slate-900 text-white' : ''
                  }`}
                >
                  {menu.icon}
                  {menu.label}
                  <ChevronDown size={10} className={`opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Panel */}
                {isOpen && (
                  <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-slate-900/90 border border-slate-800 p-1.5 backdrop-blur-xl shadow-2xl animate-fade-in z-50">
                    {menu.items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAction(item.action)}
                        className="w-full flex items-center justify-between text-left px-3 py-2 text-[11px] text-slate-300 hover:text-white hover:bg-indigo-600/90 rounded-lg transition-all cursor-pointer font-medium"
                      >
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <span className="text-[9px] text-slate-500 hover:text-indigo-200 tracking-wide bg-slate-950/40 px-1.5 py-0.5 rounded border border-slate-800/40">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[10px] tracking-wider text-slate-500 font-semibold uppercase">
          <span>Engine Status: <b className="text-emerald-500 animate-pulse">Online</b></span>
          <span className="h-3 w-px bg-slate-900"></span>
          <span>v1.0.0</span>
        </div>
      </div>

      {/* Backdrop overlay to close open dropdowns */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 bg-transparent z-40" 
          onClick={() => setActiveDropdown(null)} 
        />
      )}

      {/* 2. Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Logo and branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="font-extrabold text-lg leading-none bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">StudioGallery</h2>
            <span className="text-xs text-indigo-400/80 font-semibold tracking-wide">Professional Client Proofing</span>
          </div>
        </div>
        
        {/* Tab switcher buttons */}
        <div className="flex flex-wrap bg-slate-900 border border-slate-800 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-[12px] sm:text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'create' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={14} />
            Gallery Creator
          </button>
          
          <button 
            onClick={() => setActiveTab('process')}
            className={`px-4 py-2 text-[12px] sm:text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'process' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileJson size={14} />
            Selection Matcher
          </button>

          <button 
            onClick={() => setActiveTab('receiver')}
            className={`px-4 py-2 text-[12px] sm:text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'receiver' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio size={14} />
            Album Receiver
          </button>

          <button 
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 text-[12px] sm:text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'data' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database size={14} />
            Data Management
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
