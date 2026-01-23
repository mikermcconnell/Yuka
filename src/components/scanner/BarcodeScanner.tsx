'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { getErrorMessage } from '@/lib/utils/formatters';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
}

export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const lastScannedRef = useRef<string>('');
  const lastScannedTimeRef = useRef<number>(0);

  // Get available cameras
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back camera on mobile
          const backCamera = devices.find(
            (d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear')
          );
          setSelectedCamera(backCamera?.id || devices[0].id);
          setHasPermission(true);
        } else {
          setHasPermission(false);
          onError?.('No cameras found');
        }
      })
      .catch((err) => {
        setHasPermission(false);
        const errorMessage = err.message || 'Camera permission denied';
        if (onError) {
          onError(errorMessage);
        } else {
          console.error('BarcodeScanner camera error:', errorMessage);
        }
      });
  }, [onError]);

  const startScanning = useCallback(async () => {
    if (!selectedCamera || !containerRef.current) return;

    try {
      // Clean up existing scanner
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {
          // Ignore stop errors
        }
        scannerRef.current.clear();
      }

      const scanner = new Html5Qrcode('barcode-scanner', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
        ],
        verbose: false,
      });

      scannerRef.current = scanner;

      await scanner.start(
        selectedCamera,
        {
          fps: 15,
          qrbox: { width: 300, height: 180 },
          aspectRatio: 1.777778,
        },
        (decodedText) => {
          // Debounce: prevent scanning the same barcode within 2 seconds
          const now = Date.now();
          if (
            decodedText === lastScannedRef.current &&
            now - lastScannedTimeRef.current < 2000
          ) {
            return;
          }

          lastScannedRef.current = decodedText;
          lastScannedTimeRef.current = now;

          // Haptic feedback if available
          if (navigator.vibrate) {
            navigator.vibrate(100);
          }

          onScan(decodedText);
        },
        () => {
          // QR code scan error (no code found) - ignore
        }
      );

      setIsScanning(true);

      // Check if torch is supported
      try {
        const videoElement = document.querySelector('#barcode-scanner video') as HTMLVideoElement;
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject as MediaStream;
          const track = stream.getVideoTracks()[0];
          const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
          setTorchSupported(!!capabilities.torch);
        }
      } catch {
        setTorchSupported(false);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Failed to start scanner');
      onError?.(errorMessage);
      setIsScanning(false);
    }
  }, [selectedCamera, onScan, onError]);

  // Toggle torch/flashlight
  const toggleTorch = useCallback(async () => {
    try {
      const videoElement = document.querySelector('#barcode-scanner video') as HTMLVideoElement;
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        const track = stream.getVideoTracks()[0];

        // Check if torch is actually supported before attempting to use it
        const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
        if (!capabilities.torch) {
          console.warn('Torch not supported on this device');
          setTorchSupported(false);
          return;
        }

        const newTorchState = !torchOn;
        await track.applyConstraints({
          advanced: [{ torch: newTorchState } as MediaTrackConstraintSet & { torch: boolean }],
        });
        setTorchOn(newTorchState);
      }
    } catch (err) {
      console.error('Failed to toggle torch:', err);
      setTorchSupported(false);
    }
  }, [torchOn]);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // Ignore errors
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
    setTorchOn(false);
    setTorchSupported(false);
  }, []);

  // Start scanning when camera is selected
  useEffect(() => {
    if (selectedCamera && hasPermission) {
      startScanning();
    }

    return () => {
      stopScanning();
    };
  }, [selectedCamera, hasPermission, startScanning, stopScanning]);

  // Camera switch handler
  const handleCameraSwitch = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex((c) => c.id === selectedCamera);
    const nextIndex = (currentIndex + 1) % cameras.length;
    setSelectedCamera(cameras[nextIndex].id);
  };

  if (hasPermission === null) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-2xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4" />
        <p className="text-gray-600">Requesting camera permission...</p>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl">
        <svg
          className="w-12 h-12 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        <p className="text-red-700 font-medium mb-2">Camera Access Denied</p>
        <p className="text-red-600 text-sm text-center">
          Please enable camera access in your browser settings to scan barcodes.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Scanner container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl bg-black"
        style={{ aspectRatio: '16/9' }}
      >
        <div id="barcode-scanner" className="w-full h-full" />

        {/* Scanning overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner markers - sized to match 300x180 scanning box */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: '300px', height: '180px' }}>
                {/* Top-left corner */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-green-500 rounded-tl-lg" />
                {/* Top-right corner */}
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-green-500 rounded-tr-lg" />
                {/* Bottom-left corner */}
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-green-500 rounded-bl-lg" />
                {/* Bottom-right corner */}
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-green-500 rounded-br-lg" />
                {/* Scanning line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 animate-scan" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Camera controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* Torch/Flash button */}
        {torchSupported && (
          <button
            onClick={toggleTorch}
            className={`p-2 rounded-full text-white transition-colors ${
              torchOn ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-black/50 hover:bg-black/70'
            }`}
            aria-label={torchOn ? 'Turn off flash' : 'Turn on flash'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {torchOn ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              )}
            </svg>
          </button>
        )}

        {/* Camera switch button */}
        {cameras.length > 1 && (
          <button
            onClick={handleCameraSwitch}
            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label="Switch camera"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Instructions */}
      <p className="text-center text-gray-500 text-sm mt-4">
        Point your camera at a barcode to scan
      </p>
    </div>
  );
}
