import { Image as ImageIcon, Trash2 } from 'lucide-react';

export const ImageGrid = ({ creatorImages, removeCreatorImage }) => {
  if (creatorImages.length === 0) {
    return (
      <div className="h-64 border border-slate-900 rounded-3xl flex flex-col items-center justify-center text-slate-600 bg-slate-900/10">
        <ImageIcon size={32} className="mb-2 text-slate-800" />
        <p className="text-xs font-semibold">No images added to the compiler yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex justify-between items-center mb-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">
        <span>Uploaded Proofs</span>
        <span className="text-indigo-400">{creatorImages.length} Files</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {creatorImages.map(img => (
          <div key={img.id} className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden relative group">
            <div className="aspect-square bg-slate-900 overflow-hidden relative flex items-center justify-center">
              <img src={img.preview} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <button 
                onClick={() => removeCreatorImage(img.id)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-rose-400 hover:text-white hover:bg-rose-600 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <div className="p-3 text-[11px] leading-tight">
              <p className="font-semibold text-slate-200 truncate" title={img.name}>{img.name}</p>
              <p className="text-slate-500 mt-0.5">{img.size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ImageGrid;
