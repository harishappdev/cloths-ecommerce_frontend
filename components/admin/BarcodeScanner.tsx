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
                <div className="space-y-6">
                    <div className="relative group/scanner overflow-hidden rounded-[2.5rem] border-4 border-gray-900 bg-black shadow-2xl">
                        {/* Viewfinder Overlays */}
                        <div className="absolute inset-0 pointer-events-none z-20">
                            {/* Decorative Corners */}
                            <div className="absolute top-8 left-8 w-10 h-10 border-t-4 border-l-4 border-[#FF2C79] rounded-tl-xl shadow-[0_0_15px_rgba(255,44,121,0.3)]" />
                            <div className="absolute top-8 right-8 w-10 h-10 border-t-4 border-r-4 border-[#FF2C79] rounded-tr-xl shadow-[0_0_15px_rgba(255,44,121,0.3)]" />
                            <div className="absolute bottom-8 left-8 w-10 h-10 border-b-4 border-l-4 border-[#FF2C79] rounded-bl-xl shadow-[0_0_15px_rgba(255,44,121,0.3)]" />
                            <div className="absolute bottom-8 right-8 w-10 h-10 border-b-4 border-r-4 border-[#FF2C79] rounded-br-xl shadow-[0_0_15px_rgba(255,44,121,0.3)]" />
                            
                            {/* Scanning Beam */}
                            <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF2C79] to-transparent shadow-[0_0_20px_#FF2C79,0_0_40px_#FF2C79] opacity-80 animate-[scan_3s_ease-in-out_infinite]" />
                            
                            {/* Center Target Box Shadow */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-[250px] h-[250px] border border-white/20 rounded-2xl bg-white/5 backdrop-blur-[1px]" />
                            </div>

                            {/* HUD Text */}
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF2C79] animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] whitespace-nowrap">Capturing Optical Intel</span>
                            </div>
                        </div>

                        <div id="reader" className="w-full min-h-[400px] transition-all" />

                        <style dangerouslySetInnerHTML={{ __html: `
                            @keyframes scan {
                                0% { top: 15%; opacity: 0; }
                                20% { opacity: 1; }
                                80% { opacity: 1; }
                                100% { top: 85%; opacity: 0; }
                            }
                            #reader button {
                                background-color: #111827 !important;
                                border: none !important;
                                border-radius: 12px !important;
                                color: white !important;
                                font-weight: 700 !important;
                                padding: 8px 16px !important;
                                cursor: pointer !important;
                                transition: all 0.3s !important;
                                text-transform: uppercase !important;
                                letter-spacing: 0.1em !important;
                                font-size: 10px !important;
                                margin-top: 20px !important;
                            }
                            #reader button:hover {
                                background-color: #FF2C79 !important;
                                transform: scale(1.05) !important;
                            }
                            #reader select {
                                background-color: #f9fafb !important;
                                border: 1px solid #e5e7eb !important;
                                border-radius: 8px !important;
                                padding: 4px 8px !important;
                                font-size: 11px !important;
                            }
                        `}} />
                    </div>
                    
                    <button
                        onClick={() => setIsScanning(false)}
                        className="w-full bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 font-black py-4 px-6 rounded-2xl transition-all uppercase tracking-widest text-[11px] border border-gray-200/50"
                    >
                        Terminate Session
                    </button>
                </div>
            )}
        </div>
    );
}
