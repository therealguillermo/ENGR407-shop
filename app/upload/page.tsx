'use client';

import React, { useState, useRef } from 'react';
import { Upload, Loader2, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [saveImages, setSaveImages] = useState(false); // Toggle to save images
  const [savedOriginalUrl, setSavedOriginalUrl] = useState<string | null>(null);
  const [savedProcessedUrl, setSavedProcessedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setProcessedImageUrl(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      setProcessedImageUrl(null);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('saveImages', saveImages.toString());

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      if (data.success && data.image) {
        // Convert base64 to blob URL for preview
        const imageBlob = await fetch(`data:${data.mimeType};base64,${data.image}`).then(r => r.blob());
        const imageUrl = URL.createObjectURL(imageBlob);
        setProcessedImageUrl(imageUrl);
        
        // Store saved URLs if available
        if (data.originalImageUrl) {
          setSavedOriginalUrl(data.originalImageUrl);
        }
        if (data.processedImageUrl) {
          setSavedProcessedUrl(data.processedImageUrl);
        }
      } else {
        throw new Error('No processed image received');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing the image');
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImageUrl) {
      const link = document.createElement('a');
      link.href = processedImageUrl;
      link.download = `laser-engraved-${selectedFile?.name || 'preview.png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#041E42] text-white py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-serif font-bold tracking-wider hover:opacity-80 transition">
            NITTANY CRAFT.
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm hover:opacity-80 transition"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#041E42] mb-4">
            Custom Masterpiece
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Upload your photo to see a preview of how it will look as a laser-engraved sketch on wood.
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-[#041E42] transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {!previewUrl ? (
              <>
                <Upload size={48} className="mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-slate-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <p className="text-sm text-slate-600">
                  {selectedFile?.name} ({originalDimensions?.width} × {originalDimensions?.height}px)
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setProcessedImageUrl(null);
                    setOriginalDimensions(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {previewUrl && !processedImageUrl && (
            <div className="mt-6 space-y-4">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveImages}
                  onChange={(e) => setSaveImages(e.target.checked)}
                  className="w-4 h-4 text-[#041E42] border-slate-300 rounded focus:ring-[#041E42]"
                />
                <span>Save images permanently (for order tracking)</span>
              </label>
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full bg-[#041E42] text-white py-4 rounded-xl font-bold hover:bg-[#001433] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Generate Laser Engraving Preview'
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {processedImageUrl && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-serif font-bold text-[#041E42] mb-6 text-center">
              Laser Engraving Preview
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Original</h3>
                <img
                  src={previewUrl!}
                  alt="Original"
                  className="w-full rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Laser Engraved Preview</h3>
                <img
                  src={processedImageUrl}
                  alt="Laser Engraved Preview"
                  className="w-full rounded-lg border border-slate-200"
                />
              </div>
            </div>
            {(savedOriginalUrl || savedProcessedUrl) && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-800 mb-2">Images saved successfully!</p>
                <div className="text-xs text-green-700 space-y-1">
                  {savedOriginalUrl && (
                    <p>Original: <a href={savedOriginalUrl} target="_blank" rel="noopener noreferrer" className="underline break-all">{savedOriginalUrl}</a></p>
                  )}
                  {savedProcessedUrl && (
                    <p>Processed: <a href={savedProcessedUrl} target="_blank" rel="noopener noreferrer" className="underline break-all">{savedProcessedUrl}</a></p>
                  )}
                </div>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-[#041E42] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#001433] transition"
              >
                <Download size={20} />
                Download Preview
              </button>
              <Link
                href="https://buy.stripe.com/28E28t1HSbk02D87t03Nm01"
                className="flex items-center gap-2 bg-white border-2 border-[#041E42] text-[#041E42] px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition"
              >
                Purchase Custom Engraving - $40
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

