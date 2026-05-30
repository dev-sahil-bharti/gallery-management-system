import { Upload, Trash2 } from 'lucide-react';

export const UploadZone = ({
  fileInputRef,
  handleCreatorFilesUpload,
  clearAllCreatorImages,
  creatorImagesLength
}) => {
  return (
    <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-lg text-white">Add Gallery Proof Photos</h3>
          <p className="text-sm text-slate-400 mt-1">Images remain completely local. High-res files will be downscaled in browser.</p>
        </div>
        {creatorImagesLength > 0 && (
          <button 
            onClick={clearAllCreatorImages}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-3.5 py-2 rounded-lg cursor-pointer hover:bg-rose-500/15"
          >
            <Trash2 size={13} />
            Clear All
          </button>
        )}
      </div>

      {/* Drag and Drop Zone */}
      <div 
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/40 hover:bg-slate-950/80 transition-all rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer group"
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleCreatorFilesUpload} 
          className="hidden" 
        />
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform duration-200 flex items-center justify-center mb-4">
          <Upload size={22} />
        </div>
        <h4 className="font-bold text-sm text-slate-200">Drag & drop gallery photos here</h4>
        <p className="text-xs text-slate-500 mt-1">PNG, JPG, JPEG formats are supported</p>
        <span className="mt-3 text-xs bg-slate-900 text-indigo-400 font-semibold px-3 py-1.5 rounded-lg border border-slate-800">Browse Files</span>
      </div>
    </div>
  );
};
export default UploadZone;
