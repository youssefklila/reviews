'use client';

import React, { useState, useEffect } from 'react';
import { generateQrCodeDataURL } from '@/lib/qrUtils'; // Assuming @/lib resolves correctly

export default function TestQrPage() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null); // For SVG example
  const [inputText, setInputText] = useState<string>('https://example.com');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQr = async () => {
    if (!inputText.trim()) {
      setError('Input text cannot be empty.');
      setQrCodeDataUrl(null);
      setQrCodeSvg(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const dataUrl = await generateQrCodeDataURL(inputText);
      setQrCodeDataUrl(dataUrl);

      // Example for SVG (optional, just for testing the other utility function)
      // const svgString = await generateQrCodeSvg(inputText);
      // setQrCodeSvg(svgString);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Generation failed: ${errorMessage}`);
      setQrCodeDataUrl(null);
      setQrCodeSvg(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Optionally, generate one on load for quick testing
  useEffect(() => {
    handleGenerateQr();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount with default inputText

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test QR Code Generation</h1>
      <div className="mb-4">
        <label htmlFor="qrInput" className="block text-sm font-medium text-gray-700 mb-1">
          Enter text for QR Code:
        </label>
        <input
          type="text"
          id="qrInput"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        onClick={handleGenerateQr}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Generating...' : 'Generate QR Code'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          <p>Error: {error}</p>
        </div>
      )}

      {qrCodeDataUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Generated QR Code (Data URL as &lt;img&gt;):</h2>
          <img src={qrCodeDataUrl} alt="Generated QR Code" className="border border-gray-400" />
        </div>
      )}

      {/* Example for displaying SVG directly (if you use generateQrCodeSvg) */}
      {/* qrCodeSvg && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Generated QR Code (SVG directly):</h2>
          <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} className="border border-gray-400 w-48 h-48"/>
        </div>
      )*/}
    </div>
  );
}
