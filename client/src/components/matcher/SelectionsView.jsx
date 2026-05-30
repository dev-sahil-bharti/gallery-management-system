import { RefreshCw, CheckCircle } from 'lucide-react';

export const SelectionsView = ({
  subTab,
  setSubTab,
  matchedSelections,
  matchedUnselected
}) => {
  return (
    <div className="lg:col-span-8 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl">
      
      {/* Tab switches */}
      <div className="flex border-b border-slate-900 pb-3 mb-6 gap-6">
        <button
          onClick={() => setSubTab('selected')}
          className={`text-sm font-bold pb-2 relative transition-colors cursor-pointer ${
            subTab === 'selected' 
              ? 'text-white' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Selected Photos ({matchedSelections.length})
          {subTab === 'selected' && (
            <div className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-indigo-500 rounded-full"></div>
          )}
        </button>
        <button
          onClick={() => setSubTab('unselected')}
          className={`text-sm font-bold pb-2 relative transition-colors cursor-pointer ${
            subTab === 'unselected' 
              ? 'text-white' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Unselected Photos ({matchedUnselected.length})
          {subTab === 'unselected' && (
            <div className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-indigo-500 rounded-full"></div>
          )}
        </button>
      </div>

      {/* Selected items grid with ROTATIONS */}
      {subTab === 'selected' && (
        matchedSelections.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {matchedSelections.map((img, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden relative group">
                <div className="aspect-[3/2] bg-slate-900 overflow-hidden relative flex items-center justify-center">
                  <img 
                    src={img.preview} 
                    alt={img.name} 
                    style={{ transform: `rotate(${img.rotation}deg)` }}
                    className="w-full h-full object-contain transition-transform duration-300" 
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-indigo-400 flex items-center gap-1.5 shadow">
                    <RefreshCw size={9} />
                    {img.rotation}° Rotated
                  </div>
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg">
                    <CheckCircle size={14} />
                  </div>
                </div>
                <div className="p-3 text-[11px]">
                  <p className="font-semibold text-slate-200 truncate" title={img.name}>{img.name}</p>
                  <p className="text-slate-500 mt-0.5">{img.size}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-600">
            <CheckCircle size={28} className="mb-2 text-slate-800" />
            <p className="text-xs font-semibold">No images selected by client in this JSON.</p>
          </div>
        )
      )}

      {/* Unselected items grid */}
      {subTab === 'unselected' && (
        matchedUnselected.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {matchedUnselected.map((img, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden relative group opacity-60 hover:opacity-100 transition-opacity">
                <div className="aspect-[3/2] bg-slate-900 overflow-hidden relative flex items-center justify-center">
                  <img 
                    src={img.preview} 
                    alt={img.name} 
                    className="w-full h-full object-contain transition-transform duration-300" 
                  />
                </div>
                <div className="p-3 text-[11px]">
                  <p className="font-semibold text-slate-200 truncate" title={img.name}>{img.name}</p>
                  <p className="text-slate-500 mt-0.5">{img.size}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-600">
            <CheckCircle size={28} className="mb-2 text-slate-800" />
            <p className="text-xs font-semibold">All original images matched as Selected!</p>
          </div>
        )
      )}

    </div>
  );
};
export default SelectionsView;
