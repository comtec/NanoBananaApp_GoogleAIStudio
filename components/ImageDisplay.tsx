
import React from 'react';

interface ImageDisplayProps {
  label: string;
  imageUrl: string | null;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ label, imageUrl }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-gray-300 mb-2">{label}</h3>
      <div className="aspect-square w-full bg-base-300 rounded-lg flex items-center justify-center overflow-hidden border border-base-300">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="w-full h-full object-contain" />
        ) : (
          <div className="text-gray-500 p-4 text-center">
            {label === 'Original' ? 'Upload an image to get started' : 'Your edited image will appear here'}
          </div>
        )}
      </div>
    </div>
  );
};
