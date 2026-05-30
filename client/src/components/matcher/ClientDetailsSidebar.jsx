import { Copy, Download, RefreshCw } from 'lucide-react';

export const ClientDetailsSidebar = ({
  selectionData,
  matchedSelections,
  matchedUnselected,
  getLightroomFilterString,
  copyToClipboard,
  downloadSelectedAsZip,
  isZipping,
  zipProgress,
  resetSelectionProcessor
}) => {
  return (
    <div className="lg:col-span-4 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl space-y-6">
      
      {/* Submission Header */}
      <div>
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/10">Active Match</span>
        <h3 className="font-extrabold text-lg text-white mt-3">{selectionData.galleryTitle || "Untitled Gallery"}</h3>
        <p className="text-xs text-slate-500 mt-1">Submitted on: {new Date(selectionData.submissionDate).toLocaleString()}</p>
      </div>

      {/* Customer card */}
      <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-2xl">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client Info</h4>
        <p className="font-bold text-sm text-slate-200 mt-1">{selectionData.clientName || 'Anonymous Client'}</p>
        {selectionData.clientNotes && (
          <div className="mt-3 pt-3 border-t border-slate-900/50">
            <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Comments</h5>
            <p className="text-xs text-slate-400 mt-1 italic whitespace-pre-line bg-slate-900/50 p-2.5 rounded-xl border border-slate-900">
              "{selectionData.clientNotes}"
            </p>
          </div>
        )}
      </div>

      {/* Match Stats */}
      <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-2xl">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Metrics</h4>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-900">
            <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Selections</span>
            <span className="font-black text-xl text-emerald-400 mt-0.5 block">{matchedSelections.length}</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-900">
            <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Unselected</span>
            <span className="font-black text-xl text-slate-400 mt-0.5 block">{matchedUnselected.length}</span>
          </div>
        </div>
      </div>

      {/* Copy tools */}
      {matchedSelections.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Export Tools</h4>
          
          {/* Lightroom Filter Query */}
          <button
            onClick={() => copyToClipboard(getLightroomFilterString(), "Lightroom search string copied!")}
            className="w-full flex items-center justify-between bg-slate-950 hover:bg-slate-900 text-xs font-semibold px-4 py-3 rounded-xl border border-slate-900 transition-colors text-indigo-400 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Copy size={13} />
              Lightroom Search Query
            </span>
            <span className="text-[10px] text-slate-500">Copy</span>
          </button>

          {/* Plain List of names */}
          <button
            onClick={() => copyToClipboard(matchedSelections.map(img => img.name).join(', '), "Filenames copied!")}
            className="w-full flex items-center justify-between bg-slate-950 hover:bg-slate-900 text-xs font-semibold px-4 py-3 rounded-xl border border-slate-900 transition-colors text-slate-300 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Copy size={13} />
              Selected Filenames CSV
            </span>
            <span className="text-[10px] text-slate-500">Copy</span>
          </button>

          {/* Download original folder as ZIP */}
          <button
            onClick={downloadSelectedAsZip}
            disabled={isZipping}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-600 text-white font-bold text-xs px-4 py-3.5 rounded-xl shadow-lg shadow-indigo-600/10 transition-all duration-200 cursor-pointer"
          >
            {isZipping ? (
              <>
                <RefreshCw className="animate-spin" size={13} />
                Creating ZIP ({zipProgress}%)
              </>
            ) : (
              <>
                <Download size={13} />
                Download High-Res ZIP
              </>
            )}
          </button>
        </div>
      )}

      <button
        onClick={resetSelectionProcessor}
        className="w-full text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1 bg-rose-500/10 px-4 py-3 rounded-xl border border-rose-500/5 hover:bg-rose-500/15 cursor-pointer mt-4"
      >
        Reset Board
      </button>
    </div>
  );
};
export default ClientDetailsSidebar;
