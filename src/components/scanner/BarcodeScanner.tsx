'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { getErrorMessage } from '@/lib/utils/formatters';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
}

// Check if native BarcodeDetector API is available
const hasNativeBarcodeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;

// Type for native BarcodeDetector
interface DetectedBarcode {
  rawValue: string;
  format: string;
  boundingBox: DOMRectReadOnly;
  cornerPoints: { x: number; y: number }[];
}

interface BarcodeDetectorType {
  detect: (source: ImageBitmapSource) => Promise<DetectedBarcode[]>;
}

declare global {
  interface Window {
    BarcodeDetector: {
      new (options?: { formats: string[] }): BarcodeDetectorType;
      getSupportedFormats: () => Promise<string[]>;
    };
  }
}

// Scan statistics interface
interface ScanStats {
  scanStartTime: number | null;
  lastScanDuration: number | null;
  totalScans: number;
  averageScanTime: number;
  failedAttempts: number;
}

// Positioning guidance types
type PositionHint = 'none' | 'too-far' | 'too-close' | 'hold-steady' | 'good';

export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const nativeDetectorRef = useRef<BarcodeDetectorType | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [lowLightWarning, setLowLightWarning] = useState(false);
  const [useNativeDetector, setUseNativeDetector] = useState(false);
  const [scanBoxSize, setScanBoxSize] = useState({ width: 300, height: 180 });

  // Enterprise features state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomSupported, setZoomSupported] = useState(false);
  const [zoomRange, setZoomRange] = useState({ min: 1, max: 1 });
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [positionHint, setPositionHint] = useState<PositionHint>('none');
  const [scanStats, setScanStats] = useState<ScanStats>({
    scanStartTime: null,
    lastScanDuration: null,
    totalScans: 0,
    averageScanTime: 0,
    failedAttempts: 0,
  });
  // Track detected barcode position for potential future use (e.g., AR overlay)
  const [, setDetectedBarcodeBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [showStats, setShowStats] = useState(false);

  const lastScannedRef = useRef<string>('');
  const lastScannedTimeRef = useRef<number>(0);
  const brightnessHistoryRef = useRef<number[]>([]);
  const scanTimesRef = useRef<number[]>([]);
  const noDetectionCountRef = useRef(0);
  const partialDetectionRef = useRef<{ count: number; avgSize: number }>({ count: 0, avgSize: 0 });

  // Refs to prevent race conditions
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);
  const mountedRef = useRef(true);

  // Stable refs for callbacks to avoid dependency issues
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);

  // Keep refs updated
  useEffect(() => {
    onScanRef.current = onScan;
    onErrorRef.current = onError;
  }, [onScan, onError]);

  // Track mounted state for cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Initialize audio context for beep sound
  useEffect(() => {
    // Create audio context on first user interaction to comply with autoplay policy
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('click', initAudio);
    };

    document.addEventListener('touchstart', initAudio, { once: true });
    document.addEventListener('click', initAudio, { once: true });

    return () => {
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('click', initAudio);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play beep sound on successful scan
  const playBeepSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Pleasant beep frequency
      oscillator.frequency.value = 1800;
      oscillator.type = 'sine';

      // Quick fade in/out for smooth sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (err) {
      console.warn('Could not play beep sound:', err);
    }
  }, []);

  // Calculate dynamic scan box size based on container
  useEffect(() => {
    const updateScanBoxSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Make scan box 70% of container width, with aspect ratio ~5:3 for barcodes
        const width = Math.min(Math.round(containerWidth * 0.7), 400);
        const height = Math.round(width * 0.6);
        setScanBoxSize({ width, height });
      }
    };

    updateScanBoxSize();
    window.addEventListener('resize', updateScanBoxSize);
    return () => window.removeEventListener('resize', updateScanBoxSize);
  }, []);

  // Check for native BarcodeDetector support
  useEffect(() => {
    const checkNativeSupport = async () => {
      if (hasNativeBarcodeDetector) {
        try {
          const formats = await window.BarcodeDetector.getSupportedFormats();
          const hasRequiredFormats = ['ean_13', 'ean_8', 'upc_a', 'upc_e'].some((f) =>
            formats.includes(f)
          );
          if (hasRequiredFormats) {
            nativeDetectorRef.current = new window.BarcodeDetector({
              formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'],
            });
            setUseNativeDetector(true);
            console.log('Using native BarcodeDetector API for faster scanning');
          }
        } catch {
          console.log('Native BarcodeDetector not available, using html5-qrcode');
        }
      }
    };
    checkNativeSupport();
  }, []);

  // Get available cameras (runs once on mount)
  useEffect(() => {
    // Start scan timer when scanning begins
    setScanStats(prev => ({ ...prev, scanStartTime: Date.now() }));

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!mountedRef.current) return;

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
          onErrorRef.current?.('No cameras found');
        }
      })
      .catch((err) => {
        if (!mountedRef.current) return;

        setHasPermission(false);
        const errorMessage = err.message || 'Camera permission denied';
        if (onErrorRef.current) {
          onErrorRef.current(errorMessage);
        } else {
          console.error('BarcodeScanner camera error:', errorMessage);
        }
      });
  }, []); // Empty deps - only run once on mount

  // Analyze frame brightness to detect low light
  const analyzeBrightness = useCallback((imageData: ImageData): number => {
    const data = imageData.data;
    let totalBrightness = 0;
    // Sample every 16th pixel for performance
    for (let i = 0; i < data.length; i += 64) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Perceived brightness formula
      totalBrightness += (0.299 * r + 0.587 * g + 0.114 * b);
    }
    return totalBrightness / (data.length / 64);
  }, []);

  // Update position hint based on detection patterns
  const updatePositionHint = useCallback((barcode: DetectedBarcode | null, canvasWidth: number, canvasHeight: number) => {
    if (barcode) {
      const barcodeArea = barcode.boundingBox.width * barcode.boundingBox.height;
      const frameArea = canvasWidth * canvasHeight;
      const areaRatio = barcodeArea / frameArea;

      // Track partial detections for guidance
      partialDetectionRef.current.count++;
      partialDetectionRef.current.avgSize =
        (partialDetectionRef.current.avgSize * (partialDetectionRef.current.count - 1) + areaRatio) /
        partialDetectionRef.current.count;

      if (areaRatio < 0.02) {
        setPositionHint('too-far');
      } else if (areaRatio > 0.5) {
        setPositionHint('too-close');
      } else {
        setPositionHint('good');
        noDetectionCountRef.current = 0;
      }
    } else {
      noDetectionCountRef.current++;

      // After 60 frames (~2 seconds) with no detection, show hold steady
      if (noDetectionCountRef.current > 60 && noDetectionCountRef.current < 150) {
        setPositionHint('hold-steady');
      } else if (noDetectionCountRef.current >= 150) {
        // After ~5 seconds, suggest moving closer
        if (partialDetectionRef.current.avgSize < 0.05) {
          setPositionHint('too-far');
        } else {
          setPositionHint('hold-steady');
        }
      }
    }
  }, []);

  // Draw barcode highlight on overlay canvas
  const drawBarcodeHighlight = useCallback((barcode: DetectedBarcode, videoWidth: number, videoHeight: number) => {
    if (!overlayCanvasRef.current || !containerRef.current) return;

    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale coordinates to overlay canvas size
    const containerRect = containerRef.current.getBoundingClientRect();
    const scaleX = containerRect.width / videoWidth;
    const scaleY = containerRect.height / videoHeight;

    const box = {
      x: barcode.boundingBox.x * scaleX,
      y: barcode.boundingBox.y * scaleY,
      width: barcode.boundingBox.width * scaleX,
      height: barcode.boundingBox.height * scaleY,
    };

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw highlight box
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    // Draw rounded rectangle
    const radius = 8;
    ctx.beginPath();
    ctx.moveTo(box.x + radius, box.y);
    ctx.lineTo(box.x + box.width - radius, box.y);
    ctx.quadraticCurveTo(box.x + box.width, box.y, box.x + box.width, box.y + radius);
    ctx.lineTo(box.x + box.width, box.y + box.height - radius);
    ctx.quadraticCurveTo(box.x + box.width, box.y + box.height, box.x + box.width - radius, box.y + box.height);
    ctx.lineTo(box.x + radius, box.y + box.height);
    ctx.quadraticCurveTo(box.x, box.y + box.height, box.x, box.y + box.height - radius);
    ctx.lineTo(box.x, box.y + radius);
    ctx.quadraticCurveTo(box.x, box.y, box.x + radius, box.y);
    ctx.closePath();
    ctx.stroke();

    // Draw corner accents
    ctx.fillStyle = '#22c55e';
    const cornerSize = 12;

    // Top-left
    ctx.fillRect(box.x - 2, box.y - 2, cornerSize, 4);
    ctx.fillRect(box.x - 2, box.y - 2, 4, cornerSize);

    // Top-right
    ctx.fillRect(box.x + box.width - cornerSize + 2, box.y - 2, cornerSize, 4);
    ctx.fillRect(box.x + box.width - 2, box.y - 2, 4, cornerSize);

    // Bottom-left
    ctx.fillRect(box.x - 2, box.y + box.height - 2, cornerSize, 4);
    ctx.fillRect(box.x - 2, box.y + box.height - cornerSize + 2, 4, cornerSize);

    // Bottom-right
    ctx.fillRect(box.x + box.width - cornerSize + 2, box.y + box.height - 2, cornerSize, 4);
    ctx.fillRect(box.x + box.width - 2, box.y + box.height - cornerSize + 2, 4, cornerSize);

    setDetectedBarcodeBox(box);
  }, []);

  // Clear barcode highlight
  const clearBarcodeHighlight = useCallback(() => {
    if (!overlayCanvasRef.current) return;
    const ctx = overlayCanvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    }
    setDetectedBarcodeBox(null);
  }, []);

  // Handle successful barcode detection
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBarcodeDetected = useCallback((decodedText: string, barcode?: DetectedBarcode) => {
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

    // Calculate scan duration
    const scanDuration = scanStats.scanStartTime ? now - scanStats.scanStartTime : 0;
    scanTimesRef.current.push(scanDuration);
    if (scanTimesRef.current.length > 10) scanTimesRef.current.shift();

    const avgTime = scanTimesRef.current.reduce((a, b) => a + b, 0) / scanTimesRef.current.length;

    setScanStats(prev => ({
      ...prev,
      lastScanDuration: scanDuration,
      totalScans: prev.totalScans + 1,
      averageScanTime: avgTime,
      scanStartTime: Date.now(), // Reset for next scan
    }));

    // Reset position tracking
    noDetectionCountRef.current = 0;
    partialDetectionRef.current = { count: 0, avgSize: 0 };
    setPositionHint('good');

    // Play beep sound
    playBeepSound();

    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    // Show success animation
    setShowSuccessAnimation(true);
    setTimeout(() => {
      if (mountedRef.current) {
        setShowSuccessAnimation(false);
      }
    }, 500);

    // Announce to screen readers
    const announcement = document.getElementById('scan-announcement');
    if (announcement) {
      announcement.textContent = `Barcode scanned successfully: ${decodedText}`;
    }

    // Use ref to avoid stale closure
    onScanRef.current(decodedText);
  }, [scanStats.scanStartTime, playBeepSound]);

  // Handle zoom change
  const handleZoomChange = useCallback(async (newZoom: number) => {
    try {
      const track = streamRef.current?.getVideoTracks()[0] ||
        ((document.querySelector('#barcode-scanner video') as HTMLVideoElement)?.srcObject as MediaStream)?.getVideoTracks()[0];

      if (track) {
        await track.applyConstraints({
          advanced: [{ zoom: newZoom } as MediaTrackConstraintSet & { zoom: number }],
        });
        setZoomLevel(newZoom);
      }
    } catch (err) {
      console.warn('Could not change zoom:', err);
    }
  }, []);

  // Handle tap to focus
  const handleTapToFocus = useCallback(async (e: React.TouchEvent | React.MouseEvent) => {
    if (!containerRef.current || !streamRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    // Convert to normalized coordinates (0-1)
    const pointX = x / rect.width;
    const pointY = y / rect.height;

    try {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as MediaTrackCapabilities & {
        focusMode?: string[];
        pointsOfInterest?: boolean;
      };

      if (capabilities.focusMode?.includes('manual') || capabilities.pointsOfInterest) {
        await track.applyConstraints({
          advanced: [{
            // @ts-expect-error - pointsOfInterest not in TypeScript types
            pointsOfInterest: [{ x: pointX, y: pointY }],
            focusMode: 'manual',
          }],
        });

        // Reset to continuous focus after a moment
        setTimeout(async () => {
          try {
            await track.applyConstraints({
              // @ts-expect-error - focusMode constraint
              advanced: [{ focusMode: 'continuous' }],
            });
          } catch {
            // Ignore reset errors
          }
        }, 2000);

        // Visual feedback for tap location
        const focusIndicator = document.createElement('div');
        focusIndicator.className = 'absolute w-16 h-16 border-2 border-white rounded-full pointer-events-none animate-ping';
        focusIndicator.style.left = `${x - 32}px`;
        focusIndicator.style.top = `${y - 32}px`;
        containerRef.current.appendChild(focusIndicator);

        setTimeout(() => {
          focusIndicator.remove();
        }, 500);
      }
    } catch (err) {
      console.warn('Tap to focus not supported:', err);
    }
  }, []);

  // Native BarcodeDetector scanning loop
  const startNativeScanning = useCallback(async () => {
    if (!selectedCamera || !containerRef.current) return;
    if (isStartingRef.current || isStoppingRef.current) return;

    isStartingRef.current = true;
    setScanStats(prev => ({ ...prev, scanStartTime: Date.now() }));

    try {
      // Get high-quality video stream with optimized constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: selectedCamera },
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          frameRate: { ideal: 30, min: 15 },
          facingMode: { ideal: 'environment' },
          // @ts-expect-error - focusMode is not in TypeScript types yet
          focusMode: { ideal: 'continuous' },
        },
        audio: false,
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        isStartingRef.current = false;
        return;
      }

      streamRef.current = stream;

      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.muted = true;
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      videoRef.current = video;

      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play().then(() => resolve());
        };
      });

      // Add video to container
      const scannerElement = document.getElementById('barcode-scanner');
      if (scannerElement) {
        scannerElement.innerHTML = '';
        scannerElement.appendChild(video);
      }

      // Create canvas for frame analysis
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvasRef.current = canvas;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      // Check capabilities
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as MediaTrackCapabilities & {
        torch?: boolean;
        zoom?: { min: number; max: number };
      };
      setTorchSupported(!!capabilities.torch);

      // Check zoom support
      if (capabilities.zoom) {
        setZoomSupported(true);
        setZoomRange({ min: capabilities.zoom.min, max: capabilities.zoom.max });
      }

      setIsScanning(true);

      // Scanning loop
      let frameCount = 0;
      const scanFrame = async () => {
        if (!mountedRef.current || !videoRef.current || !ctx || !nativeDetectorRef.current) {
          return;
        }

        frameCount++;

        // Draw current frame to canvas
        ctx.drawImage(videoRef.current, 0, 0);

        // Check brightness every 30 frames (~1 second at 30fps)
        if (frameCount % 30 === 0) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const brightness = analyzeBrightness(imageData);

          brightnessHistoryRef.current.push(brightness);
          if (brightnessHistoryRef.current.length > 5) {
            brightnessHistoryRef.current.shift();
          }

          const avgBrightness = brightnessHistoryRef.current.reduce((a, b) => a + b, 0) /
            brightnessHistoryRef.current.length;

          // Threshold of 50 indicates low light
          const isLowLight = avgBrightness < 50;
          if (isLowLight !== lowLightWarning && mountedRef.current) {
            setLowLightWarning(isLowLight);
            // Auto-enable torch if supported and in low light
            if (isLowLight && torchSupported && !torchOn) {
              toggleTorchInternal(true);
            }
          }
        }

        // Detect barcodes
        try {
          const barcodes = await nativeDetectorRef.current.detect(canvas);
          if (barcodes.length > 0) {
            const barcode = barcodes[0];
            drawBarcodeHighlight(barcode, canvas.width, canvas.height);
            updatePositionHint(barcode, canvas.width, canvas.height);
            handleBarcodeDetected(barcode.rawValue, barcode);
          } else {
            clearBarcodeHighlight();
            updatePositionHint(null, canvas.width, canvas.height);

            // Track failed attempts
            setScanStats(prev => ({
              ...prev,
              failedAttempts: prev.failedAttempts + 1,
            }));
          }
        } catch {
          // Detection error, continue scanning
          clearBarcodeHighlight();
        }

        // Continue scanning
        animationFrameRef.current = requestAnimationFrame(scanFrame);
      };

      // Start scanning loop
      animationFrameRef.current = requestAnimationFrame(scanFrame);
    } catch (err) {
      if (!mountedRef.current) {
        isStartingRef.current = false;
        return;
      }
      const errorMessage = getErrorMessage(err, 'Failed to start scanner');
      onErrorRef.current?.(errorMessage);
      setIsScanning(false);
      // Fallback to html5-qrcode if native fails
      setUseNativeDetector(false);
    } finally {
      isStartingRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCamera, analyzeBrightness, handleBarcodeDetected, lowLightWarning, torchSupported, torchOn, drawBarcodeHighlight, clearBarcodeHighlight, updatePositionHint]);

  // Internal torch toggle that can be called with specific state
  const toggleTorchInternal = useCallback(async (enable: boolean) => {
    try {
      const track = streamRef.current?.getVideoTracks()[0] ||
        (document.querySelector('#barcode-scanner video') as HTMLVideoElement)?.srcObject instanceof MediaStream
          ? ((document.querySelector('#barcode-scanner video') as HTMLVideoElement).srcObject as MediaStream).getVideoTracks()[0]
          : null;

      if (track) {
        const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
        if (!capabilities.torch) {
          setTorchSupported(false);
          return;
        }

        await track.applyConstraints({
          advanced: [{ torch: enable } as MediaTrackConstraintSet & { torch: boolean }],
        });
        setTorchOn(enable);
      }
    } catch (err) {
      console.error('Failed to toggle torch:', err);
      setTorchSupported(false);
    }
  }, []);

  // html5-qrcode fallback scanner
  const startHtml5QrcodeScanning = useCallback(async () => {
    if (!selectedCamera || !containerRef.current) return;
    if (isStartingRef.current || isStoppingRef.current) return;

    const scannerElement = document.getElementById('barcode-scanner');
    if (!scannerElement) {
      console.warn('Scanner DOM element not found, retrying...');
      setTimeout(() => {
        if (mountedRef.current && !isStartingRef.current) {
          startHtml5QrcodeScanning();
        }
      }, 100);
      return;
    }

    isStartingRef.current = true;
    setScanStats(prev => ({ ...prev, scanStartTime: Date.now() }));

    try {
      // Clean up existing scanner
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {
          // Ignore stop errors
        }
        try {
          scannerRef.current.clear();
        } catch {
          // Ignore clear errors
        }
        scannerRef.current = null;
      }

      if (!mountedRef.current) {
        isStartingRef.current = false;
        return;
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

      // Use enhanced configuration for better scanning
      await scanner.start(
        {
          deviceId: { exact: selectedCamera },
        },
        {
          fps: 25, // Increased from 15 for faster detection
          qrbox: scanBoxSize,
          aspectRatio: 1.777778,
          videoConstraints: {
            deviceId: { exact: selectedCamera },
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
            frameRate: { ideal: 30, min: 15 },
            facingMode: { ideal: 'environment' },
            // @ts-expect-error - focusMode and exposureMode not in TypeScript types yet
            focusMode: { ideal: 'continuous' },
            exposureMode: { ideal: 'continuous' },
          },
        },
        (decodedText) => {
          handleBarcodeDetected(decodedText);
        },
        () => {
          // QR code scan error (no code found) - increment failed attempts
          setScanStats(prev => ({
            ...prev,
            failedAttempts: prev.failedAttempts + 1,
          }));

          // Update position hints
          noDetectionCountRef.current++;
          if (noDetectionCountRef.current > 60 && noDetectionCountRef.current < 150) {
            setPositionHint('hold-steady');
          } else if (noDetectionCountRef.current >= 150) {
            setPositionHint('too-far');
          }
        }
      );

      if (!mountedRef.current) {
        try {
          await scanner.stop();
          scanner.clear();
        } catch {
          // Ignore cleanup errors
        }
        isStartingRef.current = false;
        return;
      }

      setIsScanning(true);

      // Check torch support and brightness
      try {
        const videoElement = document.querySelector('#barcode-scanner video') as HTMLVideoElement;
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject as MediaStream;
          streamRef.current = stream;
          const track = stream.getVideoTracks()[0];
          const capabilities = track.getCapabilities() as MediaTrackCapabilities & {
            torch?: boolean;
            zoom?: { min: number; max: number };
          };
          setTorchSupported(!!capabilities.torch);

          // Check zoom support
          if (capabilities.zoom) {
            setZoomSupported(true);
            setZoomRange({ min: capabilities.zoom.min, max: capabilities.zoom.max });
          }

          // Set up brightness monitoring
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          const checkBrightness = () => {
            if (!mountedRef.current || !videoElement || videoElement.paused) return;

            canvas.width = videoElement.videoWidth / 4; // Downscale for performance
            canvas.height = videoElement.videoHeight / 4;

            if (ctx) {
              ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const brightness = analyzeBrightness(imageData);

              brightnessHistoryRef.current.push(brightness);
              if (brightnessHistoryRef.current.length > 5) {
                brightnessHistoryRef.current.shift();
              }

              const avgBrightness = brightnessHistoryRef.current.reduce((a, b) => a + b, 0) /
                brightnessHistoryRef.current.length;

              const isLowLight = avgBrightness < 50;
              if (isLowLight !== lowLightWarning && mountedRef.current) {
                setLowLightWarning(isLowLight);
              }
            }
          };

          // Check brightness every second
          const brightnessInterval = setInterval(checkBrightness, 1000);

          // Clean up interval when scanner stops
          const originalStop = scanner.stop.bind(scanner);
          scanner.stop = async () => {
            clearInterval(brightnessInterval);
            return originalStop();
          };
        }
      } catch {
        setTorchSupported(false);
      }
    } catch (err) {
      if (!mountedRef.current) {
        isStartingRef.current = false;
        return;
      }
      const errorMessage = getErrorMessage(err, 'Failed to start scanner');
      onErrorRef.current?.(errorMessage);
      setIsScanning(false);
    } finally {
      isStartingRef.current = false;
    }
  }, [selectedCamera, scanBoxSize, handleBarcodeDetected, analyzeBrightness, lowLightWarning]);

  // Main start scanning function - chooses native or fallback
  const startScanning = useCallback(async () => {
    if (useNativeDetector && nativeDetectorRef.current) {
      await startNativeScanning();
    } else {
      await startHtml5QrcodeScanning();
    }
  }, [useNativeDetector, startNativeScanning, startHtml5QrcodeScanning]);

  // Toggle torch/flashlight
  const toggleTorch = useCallback(async () => {
    await toggleTorchInternal(!torchOn);
  }, [torchOn, toggleTorchInternal]);

  const stopScanning = useCallback(async () => {
    if (isStoppingRef.current) return;

    if (isStartingRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (isStartingRef.current) {
        return;
      }
    }

    isStoppingRef.current = true;

    // Stop native scanning
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }

    // Stop html5-qrcode scanner
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {
        // Ignore stop errors
      }
      try {
        scannerRef.current.clear();
      } catch {
        // Ignore clear errors
      }
      scannerRef.current = null;
    }

    if (mountedRef.current) {
      setIsScanning(false);
      setTorchOn(false);
      setTorchSupported(false);
      setLowLightWarning(false);
      setZoomSupported(false);
      setZoomLevel(1);
      setPositionHint('none');
      brightnessHistoryRef.current = [];
    }

    isStoppingRef.current = false;
  }, []);

  // Start scanning when camera is selected
  useEffect(() => {
    if (selectedCamera && hasPermission) {
      const timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          startScanning();
        }
      }, 50);

      return () => {
        clearTimeout(timeoutId);
        stopScanning();
      };
    }
  }, [selectedCamera, hasPermission, startScanning, stopScanning]);

  // Setup overlay canvas
  useEffect(() => {
    if (containerRef.current && isScanning) {
      const existingCanvas = containerRef.current.querySelector('.overlay-canvas');
      if (!existingCanvas) {
        const canvas = document.createElement('canvas');
        canvas.className = 'overlay-canvas absolute inset-0 pointer-events-none';
        canvas.width = containerRef.current.offsetWidth;
        canvas.height = containerRef.current.offsetHeight;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        containerRef.current.appendChild(canvas);
        overlayCanvasRef.current = canvas;
      }
    }

    return () => {
      if (overlayCanvasRef.current) {
        overlayCanvasRef.current.remove();
        overlayCanvasRef.current = null;
      }
    };
  }, [isScanning]);

  // Camera switch handler
  const handleCameraSwitch = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex((c) => c.id === selectedCamera);
    const nextIndex = (currentIndex + 1) % cameras.length;
    setSelectedCamera(cameras[nextIndex].id);
  };

  // Get position hint message
  const getPositionHintMessage = (): string => {
    switch (positionHint) {
      case 'too-far':
        return 'Move closer to the barcode';
      case 'too-close':
        return 'Move further from the barcode';
      case 'hold-steady':
        return 'Hold steady...';
      case 'good':
        return 'Barcode detected!';
      default:
        return '';
    }
  };

  if (hasPermission === null) {
    return (
      <div
        className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-2xl"
        role="status"
        aria-live="polite"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4" aria-hidden="true" />
        <p className="text-gray-600">Requesting camera permission...</p>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div
        className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl"
        role="alert"
        aria-live="assertive"
      >
        <svg
          className="w-12 h-12 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
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
    <div className="relative w-full" role="application" aria-label="Barcode scanner">
      {/* Screen reader announcements */}
      <div id="scan-announcement" className="sr-only" aria-live="assertive" aria-atomic="true" />

      {/* Scanner container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl bg-black"
        style={{ aspectRatio: '16/9' }}
        onClick={handleTapToFocus}
        onTouchStart={handleTapToFocus}
        role="img"
        aria-label="Camera viewfinder. Tap to focus on a specific area."
      >
        <div id="barcode-scanner" className="w-full h-full" />

        {/* Success animation overlay */}
        {showSuccessAnimation && (
          <div
            className="absolute inset-0 bg-green-500/30 animate-pulse pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Scanning overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Darkened areas outside scan region */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="relative"
                style={{ width: `${scanBoxSize.width}px`, height: `${scanBoxSize.height}px` }}
              >
                {/* Scan region guide text */}
                <div className="absolute -top-8 left-0 right-0 text-center">
                  <span className="text-white/80 text-xs bg-black/50 px-2 py-1 rounded">
                    Position barcode here
                  </span>
                </div>

                {/* Top-left corner */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-green-500 rounded-tl-lg" />
                {/* Top-right corner */}
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-green-500 rounded-tr-lg" />
                {/* Bottom-left corner */}
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-green-500 rounded-bl-lg" />
                {/* Bottom-right corner */}
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-green-500 rounded-br-lg" />

                {/* Dashed border guide */}
                <div className="absolute inset-2 border-2 border-dashed border-white/30 rounded" />

                {/* Scanning line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 animate-scan" />

                {/* Center crosshair */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-white/50" />
                  <div className="w-0.5 h-8 bg-white/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Position hint indicator */}
            {positionHint !== 'none' && positionHint !== 'good' && (
              <div className="absolute bottom-16 left-4 right-4 flex justify-center">
                <div className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  positionHint === 'hold-steady'
                    ? 'bg-blue-500/90 text-white'
                    : 'bg-orange-500/90 text-white'
                }`}>
                  {positionHint === 'too-far' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  )}
                  {positionHint === 'too-close' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                  )}
                  {positionHint === 'hold-steady' && (
                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span>{getPositionHintMessage()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Low light warning */}
        {lowLightWarning && !torchOn && (
          <div
            className="absolute bottom-4 left-4 right-4 bg-yellow-500/90 text-yellow-900 text-sm px-3 py-2 rounded-lg flex items-center gap-2"
            role="alert"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Low light detected. {torchSupported ? 'Tap the flash button for better scanning.' : 'Move to a brighter area.'}</span>
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
            aria-pressed={torchOn}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}

        {/* Stats toggle button */}
        <button
          onClick={() => setShowStats(!showStats)}
          className={`p-2 rounded-full text-white transition-colors ${
            showStats ? 'bg-blue-500 hover:bg-blue-600' : 'bg-black/50 hover:bg-black/70'
          }`}
          aria-label={showStats ? 'Hide scan statistics' : 'Show scan statistics'}
          aria-pressed={showStats}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>

      {/* Zoom control */}
      {zoomSupported && isScanning && (
        <div className="absolute bottom-20 left-4 right-4 flex items-center gap-3 bg-black/50 rounded-lg px-3 py-2">
          <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
          <input
            type="range"
            min={zoomRange.min}
            max={zoomRange.max}
            step={0.1}
            value={zoomLevel}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-green-500"
            aria-label={`Zoom level: ${zoomLevel.toFixed(1)}x`}
          />
          <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          <span className="text-white text-sm font-medium min-w-[3rem] text-right">{zoomLevel.toFixed(1)}x</span>
        </div>
      )}

      {/* Scan statistics panel */}
      {showStats && (
        <div
          className="absolute top-16 left-4 bg-black/80 text-white text-xs rounded-lg p-3 space-y-1"
          role="status"
          aria-label="Scan statistics"
        >
          <div className="font-semibold text-green-400 mb-2">Scan Statistics</div>
          <div>Total scans: <span className="font-mono">{scanStats.totalScans}</span></div>
          <div>Last scan: <span className="font-mono">{scanStats.lastScanDuration ? `${(scanStats.lastScanDuration / 1000).toFixed(2)}s` : '-'}</span></div>
          <div>Avg time: <span className="font-mono">{scanStats.averageScanTime ? `${(scanStats.averageScanTime / 1000).toFixed(2)}s` : '-'}</span></div>
          <div>Mode: <span className="font-mono text-blue-400">{useNativeDetector ? 'Native API' : 'html5-qrcode'}</span></div>
        </div>
      )}

      {/* Instructions */}
      <p className="text-center text-gray-500 text-sm mt-4" id="scanner-instructions">
        {useNativeDetector ? 'Fast scanning enabled • ' : ''}
        Tap screen to focus • {zoomSupported ? 'Use slider to zoom' : 'Point camera at barcode'}
      </p>

      {/* Accessibility hint */}
      <p className="sr-only">
        Scanner is active. Position a barcode within the viewfinder area.
        You will hear a beep and feel a vibration when a barcode is successfully scanned.
        {zoomSupported && ' Use the zoom slider to adjust magnification.'}
        {torchSupported && ' Flash button is available for low light conditions.'}
      </p>
    </div>
  );
}
