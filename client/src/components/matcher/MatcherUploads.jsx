import { FileJson, FolderPlus } from 'lucide-react';

export const MatcherUploads = ({
  jsonInputRef,
  jsonFile,
  handleJsonUpload,
  highResInputRef,
  highResImages,
  handleHighResUpload
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: JSON Selections File Upload */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-white mb-1 flex items-center gap-2">
            <FileJson className="text-indigo-400" size={18} />
            1. Upload Client Selection JSON
          </h3>
          <p className="text-xs text-slate-400 mb-6">Drag or select the selection file downloaded by your client.</p>
        </div>

        <div 
          onClick={() => jsonInputRef.current.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            jsonFile 
              ? 'border-indigo-500/50 bg-indigo-950/5' 
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
          }`}
        >
          <input 
            type="file" 
            accept=".json" 
            ref={jsonInputRef} 
            onChange={handleJsonUpload} 
            className="hidden" 
          />
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
            jsonFile ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-900 text-slate-500'
          }`}>
            <FileJson size={18} />
          </div>
          {jsonFile ? (
            <div>
              <h4 className="font-bold text-xs text-slate-200">{jsonFile.name}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Loaded successfully</p>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-xs text-slate-300">Click to upload .json file</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Selection schema matches automatically</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: High-Res Matches Upload */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-white mb-1 flex items-center gap-2">
            <FolderPlus className="text-indigo-400" size={18} />
            2. Upload Original High-Res Images
          </h3>
          <p className="text-xs text-slate-400 mb-6">Select the matching folder or photos to sync client choices.</p>
        </div>

        <div 
          onClick={() => highResInputRef.current.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            highResImages.length > 0 
              ? 'border-indigo-500/50 bg-indigo-950/5' 
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
          }`}
        >
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            ref={highResInputRef} 
            onChange={handleHighResUpload} 
            className="hidden" 
          />
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
            highResImages.length > 0 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-900 text-slate-500'
          }`}>
            <FolderPlus size={18} />
          </div>
          {highResImages.length > 0 ? (
            <div>
              <h4 className="font-bold text-xs text-slate-200">{highResImages.length} High-Res Loaded</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Available for mapping selection</p>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-xs text-slate-300">Click to select original folder / files</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Strict filename match is performed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MatcherUploads;
