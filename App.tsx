
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { Loader } from './components/Loader';
import { editImageWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setOriginalImageFile(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setEditedImageUrl(null);
    setResponseText(null);
    setError(null);
  };

  const handleSubmit = useCallback(async () => {
    if (!originalImageFile || !prompt) {
      setError('Please upload an image and provide an editing prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);
    setResponseText(null);

    try {
      const result = await editImageWithGemini(originalImageFile, prompt);
      if (result.imageUrl) {
        setEditedImageUrl(result.imageUrl);
      }
      if (result.text) {
        setResponseText(result.text);
      }
      if (!result.imageUrl && !result.text) {
        setError("The AI didn't return an image or text. Please try a different prompt.");
      }
    } catch (err: any) {
      console.error(err);
      setError(`An error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, prompt]);
  
  const isButtonDisabled = !originalImageFile || !prompt || isLoading;

  return (
    <div className="min-h-screen bg-base-100 text-content font-sans flex flex-col">
      <header className="p-4 shadow-lg bg-base-200/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white tracking-wider">
            <span className="bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">Nano Banana</span> AI Photo Editor
          </h1>
          <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
            Powered by Gemini
          </a>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-base-200 rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 border-b border-base-300 pb-3">1. Upload Image</h2>
              <ImageUploader onImageSelect={handleImageSelect} />
            </div>
            
            <div className="bg-base-200 rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 border-b border-base-300 pb-3">2. Describe Your Edit</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Add a wizard hat to the person', 'Change the background to a futuristic city', 'Make the photo look like a watercolor painting'..."
                className="w-full h-32 p-3 bg-base-300 rounded-md text-content placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isButtonDisabled}
              className={`w-full py-3 px-6 text-lg font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105
                ${isButtonDisabled 
                  ? 'bg-base-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-2xl animate-gradient-x'
                }`}
            >
              {isLoading ? 'Magically Editing...' : 'Generate Edit'}
            </button>
            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md text-sm">{error}</div>}
          </div>

          {/* Results Column */}
          <div className="lg:col-span-8 bg-base-200 rounded-lg shadow-xl p-6 min-h-[500px]">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-base-300 pb-3">3. View Result</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <ImageDisplay label="Original" imageUrl={originalImageUrl} />
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-base-200/70 flex flex-col items-center justify-center rounded-lg z-10">
                    <Loader />
                    <p className="mt-4 text-white">AI is thinking...</p>
                  </div>
                )}
                <ImageDisplay label="Edited" imageUrl={editedImageUrl} />
                {responseText && !isLoading && (
                   <div className="mt-4 p-3 bg-base-300 rounded-md text-sm italic">
                    <strong className="not-italic text-gray-300">AI's Note:</strong> "{responseText}"
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Nano Banana AI Photo Editor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
