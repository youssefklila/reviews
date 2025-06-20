import QRCode from 'qrcode';

/**
 * Generates a QR code as a base64 encoded data URL.
 * @param text The text or data to encode in the QR code.
 * @param options Optional QR code generation options.
 * @returns A promise that resolves to the QR code data URL string, or null if an error occurs.
 */
export async function generateQrCodeDataURL(
  text: string,
  options?: QRCode.QRCodeToDataURLOptions
): Promise<string | null> {
  if (!text) {
    console.error('QR Code generation failed: Input text cannot be empty.');
    return null;
  }

  try {
    // Sensible defaults for QR codes if not overridden by options
    const defaultOptions: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'M', // Medium error correction
      type: 'image/png',
      quality: 0.92, // For JPEGs/WebP, PNG is lossless so this has less effect
      margin: 1, // Margin around the QR code (number of modules)
      // color: { // Example: customize colors
      //   dark: '#000000FF',  // Black
      //   light: '#FFFFFFFF', // White
      // },
      ...options, // User-provided options will override defaults
    };

    const dataUrl = await QRCode.toDataURL(text, defaultOptions);
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code data URL:', err);
    return null;
  }
}

/**
 * Example of generating an SVG string if needed, though Data URL is often more versatile for <img> tags.
 * @param text The text or data to encode in the QR code.
 * @param options Optional QR code generation options for SVG.
 * @returns A promise that resolves to the QR code SVG string, or null if an error occurs.
 */
export async function generateQrCodeSvg(
  text: string,
  options?: QRCode.QRCodeToStringOptions
): Promise<string | null> {
  if (!text) {
    console.error('QR Code SVG generation failed: Input text cannot be empty.');
    return null;
  }
  try {
    const defaultOptions: QRCode.QRCodeToStringOptions = {
      errorCorrectionLevel: 'M',
      type: 'svg', // Explicitly SVG
      margin: 1,
      ...options,
    };
    const svgString = await QRCode.toString(text, defaultOptions);
    return svgString;
  } catch (err) {
    console.error('Failed to generate QR code SVG:', err);
    return null;
  }
}
