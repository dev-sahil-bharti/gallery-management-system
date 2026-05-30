import { 
  Sliders, 
  Type, 
  Key, 
  Lock, 
  Image as ImageIcon, 
  RefreshCw, 
  FileCode, 
  CheckCircle, 
  Download 
} from 'lucide-react';

export const SettingsSidebar = ({
  galleryTitle,
  setGalleryTitle,
  galleryPassword,
  setGalleryPassword,
  watermarkText,
  setWatermarkText,
  watermarkOpacity,
  setWatermarkOpacity,
  maxImageSize,
  setMaxImageSize,
  compressionQuality,
  setCompressionQuality,
  isCompiling,
  compileProgress,
  compiledFile,
  compileGallery,
  creatorImagesLength
}) => {
  return (
    <div className="lg:col-span-4 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-900">
        <Sliders className="text-indigo-400" size={18} />
        <h3 className="font-bold text-base text-white">Gallery Settings</h3>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Type size={12} />
            Gallery Title
          </label>
          <input 
            type="text" 
            value={galleryTitle}
            onChange={e => setGalleryTitle(e.target.value)}
            placeholder="Sophia & Liam Wedding" 
            className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Password Protection */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Key size={12} />
            Password Lock (Optional)
          </label>
          <div className="relative">
            <input 
              type="password" 
              value={galleryPassword}
              onChange={e => setGalleryPassword(e.target.value)}
              placeholder="Leave empty for public gallery" 
              className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <Lock size={16} className="absolute right-3.5 top-3.5 text-slate-600 pointer-events-none" />
          </div>
        </div>

        {/* Watermark Config */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ImageIcon size={12} />
            Watermark Text
          </label>
          <input 
            type="text" 
            value={watermarkText}
            onChange={e => setWatermarkText(e.target.value)}
            placeholder="PROOF ONLY - DO NOT COPY" 
            className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Watermark Opacity Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Watermark Opacity
            </label>
            <span className="text-xs text-indigo-400 font-bold">{watermarkOpacity}%</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="60"
            value={watermarkOpacity}
            onChange={e => setWatermarkOpacity(Number(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-950 rounded-lg h-2"
          />
        </div>

        {/* Resizing Resolution dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Max Resolution (Proofing Size)
          </label>
          <select 
            value={maxImageSize}
            onChange={e => setMaxImageSize(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value={800}>800px (Extra Fast / Light File)</option>
            <option value={1024}>1024px (Standard Proofing - Recommended)</option>
            <option value={1200}>1200px (High Quality Proof)</option>
            <option value={1600}>1600px (Ultra Sharp Proof - Larger File)</option>
          </select>
        </div>

        {/* Compression JPEG Quality */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              JPEG Quality
            </label>
            <span className="text-xs text-indigo-400 font-bold">{compressionQuality}%</span>
          </div>
          <input 
            type="range" 
            min="40" 
            max="90"
            value={compressionQuality}
            onChange={e => setCompressionQuality(Number(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-950 rounded-lg h-2"
          />
        </div>

        {/* Compilation Action */}
        <button
          onClick={compileGallery}
          disabled={!creatorImagesLength || isCompiling}
          className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 disabled:from-slate-900 disabled:to-slate-900 disabled:text-slate-600 text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 mt-4 cursor-pointer hover:shadow-indigo-600/25 active:scale-[0.99] hover:brightness-110 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isCompiling ? (
            <>
              <RefreshCw className="animate-spin" size={16} />
              Resizing & Encoding ({compileProgress}%)
            </>
          ) : (
            <>
              <FileCode size={16} />
              Compile Standalone HTML
            </>
          )}
        </button>
      </div>

      {/* Compilation Done Output Card */}
      {compiledFile && (
        <div className="mt-6 bg-emerald-950/20 border border-emerald-900/60 p-5 rounded-2xl animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-emerald-400">Compilation Successful!</h4>
              <p className="text-xs text-slate-400 mt-1 truncate">{compiledFile.filename}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Size: {compiledFile.size}</p>
              
              <a
                href={compiledFile.url}
                download={compiledFile.filename}
                className="mt-4 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-200 cursor-pointer"
              >
                <Download size={14} />
                Download Gallery HTML
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SettingsSidebar;
