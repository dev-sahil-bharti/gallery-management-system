import { useState } from 'react';
import JSZip from 'jszip';
import { copyToClipboard } from '../utils/clipboard';

export const useSelectionMatcher = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [selectionData, setSelectionData] = useState(null);
  const [highResImages, setHighResImages] = useState([]);
  const [matchedSelections, setMatchedSelections] = useState([]);
  const [matchedUnselected, setMatchedUnselected] = useState([]);
  const [subTab, setSubTab] = useState('selected'); // 'selected' | 'unselected'
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const matchSelections = (json, originalImages) => {
    if (!json || !originalImages.length) return;

    const selectionsMap = new Map();
    json.selections.forEach(item => {
      selectionsMap.set(item.fileName, item);
    });

    const selectedMatches = [];
    const unselectedMatches = [];

    originalImages.forEach(img => {
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
        // If image was not in original JSON selections array, default to unselected
        unselectedMatches.push(img);
      }
    });

    setMatchedSelections(selectedMatches);
    setMatchedUnselected(unselectedMatches);
  };

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setJsonFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.selections || !Array.isArray(parsed.selections)) {
          alert("Invalid selection JSON format. Missing selections array.");
          return;
        }
        setSelectionData(parsed);
        matchSelections(parsed, highResImages);
      } catch (err) {
        console.error("JSON parse error:", err);
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleHighResUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const mapped = files.map(file => ({
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      preview: URL.createObjectURL(file)
    }));

    setHighResImages(mapped);
    if (selectionData) {
      matchSelections(selectionData, mapped);
    }
  };

  const getLightroomFilterString = () => {
    if (!matchedSelections.length) return '';
    return matchedSelections.map(img => {
      const baseName = img.name.substring(0, img.name.lastIndexOf('.')) || img.name;
      return `"${baseName}"`;
    }).join(' | ');
  };

  const downloadSelectedAsZip = async () => {
    if (!matchedSelections.length) return;
    setIsZipping(true);
    setZipProgress(0);

    const zip = new JSZip();
    
    for (let i = 0; i < matchedSelections.length; i++) {
      const item = matchedSelections[i];
      zip.file(item.name, item.file);
      setZipProgress(Math.round(((i + 1) / matchedSelections.length) * 100));
    }

    const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
      setZipProgress(Math.round(metadata.percent));
    });

    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectionData?.clientName || 'Client'}_Selected_Images.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsZipping(false);
  };

  const resetSelectionProcessor = () => {
    highResImages.forEach(img => URL.revokeObjectURL(img.preview));
    setJsonFile(null);
    setSelectionData(null);
    setHighResImages([]);
    setMatchedSelections([]);
    setMatchedUnselected([]);
  };

  return {
    jsonFile,
    selectionData,
    highResImages,
    matchedSelections,
    matchedUnselected,
    subTab,
    isZipping,
    zipProgress,
    setSubTab,
    handleJsonUpload,
    handleHighResUpload,
    getLightroomFilterString,
    copyToClipboard,
    downloadSelectedAsZip,
    resetSelectionProcessor
  };
};
