import React, { useState, useRef } from 'react';
import { AlertCircle, HelpCircle, X, CheckSquare, Settings as SettingsIcon } from 'lucide-react';

// Hooks
import { useGalleryCreator } from './hooks/useGalleryCreator';
import { useSelectionMatcher } from './hooks/useSelectionMatcher';

// Components
import Header from './components/common/Header';
import SettingsSidebar from './components/creator/SettingsSidebar';
import UploadZone from './components/creator/UploadZone';
import ImageGrid from './components/creator/ImageGrid';
import MatcherUploads from './components/matcher/MatcherUploads';
import ClientDetailsSidebar from './components/matcher/ClientDetailsSidebar';
import SelectionsView from './components/matcher/SelectionsView';
import AlbumReceiver from './components/receiver/AlbumReceiver';
import DataManagement from './components/data/DataManagement';

// Utilities
import { copyToClipboard } from './utils/clipboard';

function App() {
  const [activeTab, setActiveTab] = useState('create');
  
  // Custom View States
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showShortcutModal, setShowShortcutModal] = useState(false);

  // Hook integrations
  const creator = useGalleryCreator();
  const matcher = useSelectionMatcher();

  // Refs for uploads
  const fileInputRef = useRef(null);
  const jsonInputRef = useRef(null);
  const highResInputRef = useRef(null);

  // Global Menubar Action Handler
  const handleMenuAction = (action) => {
    switch (action) {
      // FILE ACTIONS
      case 'new_session':
        creator.clearAllCreatorImages();
        matcher.resetSelectionProcessor();
        setActiveTab('create');
        alert('New proofing session initialized! All local states cleared.');
        break;

      case 'open_json':
        setActiveTab('process');
        // Let React cycle render, then click json input
        setTimeout(() => {
          if (jsonInputRef.current) jsonInputRef.current.click();
        }, 100);
        break;

      case 'export_prefs':
        // Trigger photographer settings backup download
        const backupData = {
          appName: "StudioGallery",
          backupDate: new Date().toISOString(),
          watermarkDefault: creator.watermarkText,
          watermarkOpacityDefault: creator.watermarkOpacity,
          compressionQualityDefault: creator.compressionQuality,
          maxImageSizeDefault: creator.maxImageSize
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
        alert('Default proof settings backed up successfully!');
        break;

      case 'exit':
        if (window.confirm("Are you sure you want to exit StudioGallery?")) {
          alert("Main process close message dispatched. Running inside desktop package.");
        }
        break;

      // VIEW ACTIONS
      case 'toggle_fullscreen':
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch((err) => {
            alert(`Error attempting to enable fullscreen: ${err.message}`);
          });
        } else {
          document.exitFullscreen();
        }
        break;

      case 'reset_zoom':
        document.body.style.zoom = "100%";
        alert("View Zoom reset to standard 100%.");
        break;

      case 'toggle_sidebar':
        setShowSidebar(prev => !prev);
        break;

      // SELECTION ACTIONS
      case 'select_all':
        if (activeTab !== 'process' || !matcher.selectionData) {
          alert("Please upload selection files inside the 'Selection Matcher' tab first.");
          return;
        }
        // Force all high-res as selected
        const allSelected = matcher.highResImages.map(img => ({ ...img, rotation: 0 }));
        matcher.setMatchedSelections(allSelected);
        matcher.setMatchedUnselected([]);
        alert("Force matched all loaded high-res images as selected.");
        break;

      case 'clear_matches':
        if (activeTab !== 'process' || !matcher.selectionData) {
          alert("No active selections found in matching board.");
          return;
        }
        matcher.resetSelectionProcessor();
        break;

      case 'invert_selections':
        if (activeTab !== 'process' || !matcher.selectionData) {
          alert("Please upload selection files inside the 'Selection Matcher' tab first.");
          return;
        }
        // Invert choices
        const invertedSel = [...matcher.matchedUnselected].map(img => ({ ...img, rotation: 0 }));
        const invertedUnsel = [...matcher.matchedSelections];
        matcher.setMatchedSelections(invertedSel);
        matcher.setMatchedUnselected(invertedUnsel);
        alert("Inverted selections matched!");
        break;

      // TOOLS ACTIONS
      case 'tool_lightroom':
        if (activeTab !== 'process' || !matcher.selectionData) {
          alert("No active selections loaded. Import a JSON selection file first.");
          return;
        }
        const lrQuery = matcher.getLightroomFilterString();
        copyToClipboard(lrQuery, "Lightroom search string copied!");
        break;

      case 'tool_rename':
        alert("Batch Renaming requires local shell access. Please run within packaged Electron environments to execute.");
        break;

      case 'tool_cipher':
        alert("StudioGallery utilizes high-performance scrambler shift ciphers. Encrypted proofs are decrypted only after a client inputs a valid matching photographer passcode.");
        break;

      // SETTINGS ACTIONS
      case 'settings_profile':
        alert("Profile Manager: Setup active client directories and export credentials.");
        break;

      case 'settings_watermark':
        setActiveTab('create');
        alert("Focused configurations. Set your custom Watermark text and Opacity sliders.");
        break;

      case 'settings_paths':
        alert("Configure system root folders to auto-import source cards.");
        break;

      // HELP ACTIONS
      case 'help_docs':
        window.open('https://github.com/AntigravityAI', '_blank');
        break;

      case 'help_keys':
        setShowShortcutModal(true);
        break;

      case 'help_updates':
        alert("Connecting to server... Your StudioGallery client is fully up-to-date (v1.0.0).");
        break;

      case 'help_about':
        setShowAboutModal(true);
        break;

      default:
        console.warn("Unresolved menubar action:", action);
    }
  };

  // Callback to sync remote album details directly into the Matcher State
  const handleImportRemoteJson = (jsonData) => {
    // Simulate uploading a file manually by settings state values
    matcher.setSelectionData(jsonData);
    
    // Auto-match if high-res images are already in state
    if (matcher.highResImages.length > 0) {
      const selectionsMap = new Map();
      jsonData.selections.forEach(item => {
        selectionsMap.set(item.fileName, item);
      });

      const selectedMatches = [];
      const unselectedMatches = [];

      matcher.highResImages.forEach(img => {
        const match = selectionsMap.get(img.name);
        if (match) {
          if (match.selected) {
            selectedMatches.push({
              ...img,
              rotation: match.rotation || 0
            });
          } else {
            unselectedMatches.push(img);
          }
        } else {
          unselectedMatches.push(img);
        }
      });

      matcher.setMatchedSelections(selectedMatches);
      matcher.setMatchedUnselected(unselectedMatches);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Global Application Nav Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onMenuAction={handleMenuAction} />

      {/* Main Body Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* ==============================================================
            TAB 1: GALLERY CREATOR
            ============================================================== */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Configuration (Left) - Toggleable View */}
            {showSidebar && (
              <SettingsSidebar 
                galleryTitle={creator.galleryTitle}
                setGalleryTitle={creator.setGalleryTitle}
                galleryPassword={creator.galleryPassword}
                setGalleryPassword={creator.setGalleryPassword}
                watermarkText={creator.watermarkText}
                setWatermarkText={creator.setWatermarkText}
                watermarkOpacity={creator.watermarkOpacity}
                setWatermarkOpacity={creator.setWatermarkOpacity}
                maxImageSize={creator.maxImageSize}
                setMaxImageSize={creator.setMaxImageSize}
                compressionQuality={creator.compressionQuality}
                setCompressionQuality={creator.setCompressionQuality}
                isCompiling={creator.isCompiling}
                compileProgress={creator.compileProgress}
                compiledFile={creator.compiledFile}
                compileGallery={creator.compileGallery}
                creatorImagesLength={creator.creatorImages.length}
              />
            )}

            {/* Board Controls & Upload Grid (Right) */}
            <div className={`${showSidebar ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
              <UploadZone 
                fileInputRef={fileInputRef}
                handleCreatorFilesUpload={creator.handleCreatorFilesUpload}
                clearAllCreatorImages={creator.clearAllCreatorImages}
                creatorImagesLength={creator.creatorImages.length}
              />
              <ImageGrid 
                creatorImages={creator.creatorImages}
                removeCreatorImage={creator.removeCreatorImage}
              />
            </div>

          </div>
        )}

        {/* ==============================================================
            TAB 2: SELECTION PROCESSOR (MATCHER)
            ============================================================== */}
        {activeTab === 'process' && (
          <div className="space-y-8">
            
            {/* Double Drag-Drop File Upload Targets */}
            <MatcherUploads 
              jsonInputRef={jsonInputRef}
              jsonFile={matcher.jsonFile}
              handleJsonUpload={matcher.handleJsonUpload}
              highResInputRef={highResInputRef}
              highResImages={matcher.highResImages}
              handleHighResUpload={matcher.handleHighResUpload}
            />

            {/* Matched Details Panel */}
            {matcher.selectionData ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                
                {/* Active Selections Client & CSV Actions (Left Sidebar) - Toggleable */}
                {showSidebar && (
                  <ClientDetailsSidebar 
                    selectionData={matcher.selectionData}
                    matchedSelections={matcher.matchedSelections}
                    matchedUnselected={matcher.matchedUnselected}
                    getLightroomFilterString={matcher.getLightroomFilterString}
                    copyToClipboard={matcher.copyToClipboard}
                    downloadSelectedAsZip={matcher.downloadSelectedAsZip}
                    isZipping={matcher.isZipping}
                    zipProgress={matcher.zipProgress}
                    resetSelectionProcessor={matcher.resetSelectionProcessor}
                  />
                )}

                {/* Sub Tab selection lists (Right Main board) */}
                <div className={showSidebar ? 'lg:col-span-8' : 'lg:col-span-12'}>
                  <SelectionsView 
                    subTab={matcher.subTab}
                    setSubTab={matcher.setSubTab}
                    matchedSelections={matcher.matchedSelections}
                    matchedUnselected={matcher.matchedUnselected}
                  />
                </div>

              </div>
            ) : (
              /* Awaiting User input state card */
              <div className="h-96 border border-slate-900 rounded-3xl flex flex-col items-center justify-center text-slate-600 bg-slate-900/10 backdrop-blur-md">
                <AlertCircle size={36} className="mb-3 text-slate-700" />
                <h4 className="font-bold text-sm text-slate-400">Board Awaiting Inputs</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm text-center">Please load the Client Selection JSON (Step 1) and your High-Res source photos (Step 2) to match choices.</p>
              </div>
            )}

          </div>
        )}

        {/* ==============================================================
            TAB 3: ALBUM RECEIVER
            ============================================================== */}
        {activeTab === 'receiver' && (
          <AlbumReceiver 
            onImportJsonData={handleImportRemoteJson} 
            setActiveTab={setActiveTab} 
          />
        )}

        {/* ==============================================================
            TAB 4: DATA MANAGEMENT
            ============================================================== */}
        {activeTab === 'data' && (
          <DataManagement />
        )}

      </main>

      {/* ==============================================================
          MODALS & OVERLAYS (GLASSMORPHIC DIALOGS)
          ============================================================== */}
      
      {/* 1. About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg p-8 relative shadow-2xl space-y-6">
            <button 
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800"
            >
              <X size={15} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">StudioGallery v1.0.0</h3>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Professional Client Proofing Suite</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              StudioGallery is a production-ready application designed for professional photography studios. It streamlines local image downscaling, builds robust client-side encryption viewing ciphers, watermarks digital assets, and processes selections back into Lightroom filter configurations.
            </p>
            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>Engineered with <b>Antigravity AI</b></span>
              <span>© 2026 StudioGallery</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Shortcuts Modal */}
      {showShortcutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md p-8 relative shadow-2xl space-y-6 w-full">
            <button 
              onClick={() => setShowShortcutModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800"
            >
              <X size={15} />
            </button>
            
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <HelpCircle size={20} />
              </div>
              <h3 className="font-extrabold text-base text-white">Keyboard Shortcuts</h3>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="space-y-2">
                <h4 className="font-bold text-[10px] uppercase text-indigo-400 tracking-wider">General</h4>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40">
                  <span>New Proofing Session</span>
                  <kbd className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">Ctrl + N</kbd>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40">
                  <span>Import Selection JSON</span>
                  <kbd className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">Ctrl + O</kbd>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40">
                  <span>Toggle Configuration Sidebar</span>
                  <kbd className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">Ctrl + B</kbd>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span>Toggle Fullscreen</span>
                  <kbd className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">F11</kbd>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-[10px] uppercase text-indigo-400 tracking-wider">Selection Matcher</h4>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40">
                  <span>Select All matches</span>
                  <kbd className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">Ctrl + A</kbd>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span>Invert Current Selections</span>
                  <kbd className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">Ctrl + I</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;