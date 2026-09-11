'use client';

import { Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export function DownloadQrButton({ value, name }: { value: string; name: string }) {
    function downloadQrCode() {
        const canvas = document.getElementById('partner-qr-code') as HTMLCanvasElement | null;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-oak-qr.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    return (
        <>
            <div className="absolute -left-[10000px] top-0 bg-white p-4">
                <QRCodeCanvas id="partner-qr-code" value={value} size={800} level="H" includeMargin />
            </div>
            <button type="button" onClick={downloadQrCode} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#06395d] py-3 text-[10px] font-bold text-white shadow-md transition hover:bg-[#052d4b]">
                <Download size={12} /> Download QR Code
            </button>
        </>
    );
}
