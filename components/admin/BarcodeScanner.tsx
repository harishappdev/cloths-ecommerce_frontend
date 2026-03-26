'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ScanBarcode } from 'lucide-react';

interface BarcodeScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanError?: (errorMessage: string) => void;
}

export default function BarcodeScanner({ onScanSuccess, onScanError }: BarcodeScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        // Initialize scanner only when isScanning is true
        if (isScanning && !scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            const internalOnScanSuccess = (decodedText: string) => {
                if (scannerRef.current) {
                    scannerRef.current.clear().catch(err => console.error('Clear error', err));
                    scannerRef.current = null;
                }
                setIsScanning(false);
                onScanSuccess(decodedText);
            };

            const internalOnScanError = (errorMessage: string) => {
                if (onScanError) {
                    onScanError(errorMessage);
                }
            };

            scannerRef.current.render(internalOnScanSuccess, internalOnScanError);
        }

        return () => {
            // Clean up when unmounting or stopping scan
            if (!isScanning && scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error('Cleanup error', err));
                scannerRef.current = null;
            }
        };
    }, [isScanning, onScanSuccess, onScanError]);

    return (
        <div className="w-full">
            {!isScanning ? (
                <button
                    onClick={() => setIsScanning(true)}
                    className="w-full bg-[#FF2C79] hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-pink-100 flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]"
                >
                    <ScanBarcode className="w-5 h-5" />
                    Scan Barcode
                </button>
            ) : (
                <div className="space-y-4">
                    <div id="reader" className="w-full overflow-hidden rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 min-h-[300px]" />
                    <button
                        onClick={() => setIsScanning(false)}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl transition-all"
                    >
                        Cancel Scanning
                    </button>
                </div>
            )}
        </div>
    );
}
