'use client';

import { useState, useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
  onImageSelect: (url: string) => void;
  currentImage?: string | null;
  className?: string;
}

export default function ImageUploader({ onImageSelect, currentImage, className = '' }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compressionInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      
      // Show compression info
      const originalSize = (file.size / (1024 * 1024)).toFixed(2);
      const compressedSize = (compressedFile.size / (1024 * 1024)).toFixed(2);
      const compressionRatio = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
      
      // setCompressionInfo(
      //   `Compressed from ${originalSize}MB to ${compressedSize}MB (${compressionRatio}% reduction)`
      // );

      return compressedFile;
    } catch (error) {
      console.error('Compression failed:', error);
      // If compression fails, return original file
      return file;
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setIsUploading(true);
    setError(null);
    // setCompressionInfo(null);

    try {
      // Compress the image first
      const compressedFile = await compressImage(file);
      
      const formData = new FormData();
      formData.append('file', compressedFile);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const { url } = await response.json();
      onImageSelect(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const removeImage = () => {
    onImageSelect('');
    // setCompressionInfo(null);
  };

  return (
    <div className={className}>
      {currentImage ? (
        <div className="relative inline-block">
          <img
            src={currentImage}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-4xl p-6 text-center transition-colors ${
            isDragging
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="space-y-2">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-sm text-gray-600">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="font-medium text-purple-600 hover:text-purple-500"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Click to upload'}
              </button>
              {' '}or drag and drop
            </div>
            <p className="text-xs text-gray-500">
              ไม่เอารูปแปลกๆ เป็นอันใช้ได้นะ
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {compressionInfo && (
        <p className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
          {compressionInfo}
        </p>
      )}
      
      {isUploading && (
        <div className="mt-2 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-sm text-gray-600">Uploading...</span>
        </div>
      )}
    </div>
  );
}
