import { useState } from 'react';
import { resizeImage } from '../utils/imageResizer';
import { generateGalleryHtml } from '../templates/galleryTemplate';

export const useGalleryCreator = () => {
  const [creatorImages, setCreatorImages] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState('Sophia & Liam Wedding');
  const [galleryPassword, setGalleryPassword] = useState('');
  const [watermarkText, setWatermarkText] = useState('PROOF ONLY - DO NOT COPY');
  const [watermarkOpacity, setWatermarkOpacity] = useState(15);
  const [maxImageSize, setMaxImageSize] = useState(1024); // max width/height
  const [compressionQuality, setCompressionQuality] = useState(70); // jpeg quality %
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compiledFile, setCompiledFile] = useState(null);

  const handleCreatorFilesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.filter(f => f.type.startsWith('image/')).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      preview: URL.createObjectURL(file)
    }));

    setCreatorImages(prev => [...prev, ...newImages]);
    // Clear compiled cache
    setCompiledFile(null);
  };

  const removeCreatorImage = (id) => {
    setCreatorImages(prev => {
      const target = prev.find(img => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(img => img.id !== id);
    });
    setCompiledFile(null);
  };

  const clearAllCreatorImages = () => {
    creatorImages.forEach(img => URL.revokeObjectURL(img.preview));
    setCreatorImages([]);
    setCompiledFile(null);
  };

  const compileGallery = async () => {
    if (!creatorImages.length) return;
    setIsCompiling(true);
    setCompileProgress(0);

    const compiledImages = [];
    
    for (let i = 0; i < creatorImages.length; i++) {
      const imgObj = creatorImages[i];
      try {
        const base64Data = await resizeImage(
          imgObj.file, 
          maxImageSize, 
          maxImageSize, 
          compressionQuality
        );
        compiledImages.push({
          name: imgObj.name,
          data: base64Data
        });
      } catch (err) {
        console.error("Error resizing image:", imgObj.name, err);
      }
      setCompileProgress(Math.round(((i + 1) / creatorImages.length) * 100));
    }

    const htmlContent = generateGalleryHtml({
      title: galleryTitle,
      password: galleryPassword,
      watermarkText: watermarkText,
      watermarkOpacity: watermarkOpacity,
      images: compiledImages
    });

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    setCompiledFile({
      url,
      filename: `${galleryTitle.trim().replace(/\s+/g, '_')}_proof_gallery.html`,
      size: (blob.size / (1024 * 1024)).toFixed(2) + ' MB'
    });
    
    setIsCompiling(false);
  };

  return {
    creatorImages,
    galleryTitle,
    galleryPassword,
    watermarkText,
    watermarkOpacity,
    maxImageSize,
    compressionQuality,
    isCompiling,
    compileProgress,
    compiledFile,
    setGalleryTitle,
    setGalleryPassword,
    setWatermarkText,
    setWatermarkOpacity,
    setMaxImageSize,
    setCompressionQuality,
    handleCreatorFilesUpload,
    removeCreatorImage,
    clearAllCreatorImages,
    compileGallery
  };
};
