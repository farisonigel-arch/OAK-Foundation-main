'use client';

import { CheckCircle2, ChevronRight, CircleAlert, RefreshCw, ScanLine } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AppShell, PageHeader } from '../components/AppShell';

export default function CheckInPage() {
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [manualCode, setManualCode] = useState('');
    const [scannerError, setScannerError] = useState('');
    const [scannerKey, setScannerKey] = useState(0);
    const processingScan = useRef(false);

    async function checkIn(qrCodeId: string) {
        const normalizedQrCodeId = qrCodeId.trim();
        if (!normalizedQrCodeId || processingScan.current) return;
        processingScan.current = true;

        try {
            const response = await fetch('/api/checkin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qrCodeId: normalizedQrCodeId }) });
            const data = await response.json();
            if (data.success) {
                setStatus('success');
                setMessage(data.attendee.fullName);
                setManualCode('');
            } else {
                setStatus('error');
                setMessage(data.error || 'QR Code Not Recognized');
            }
        } finally {
            window.setTimeout(() => { processingScan.current = false; }, 1500);
        }
    }

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 190, height: 190 } }, false);
        scanner.render(
            (decodedText: string) => { void checkIn(decodedText); },
            (errorMessage: string) => {
                if (!errorMessage.toLowerCase().includes('qr code parse error')) {
                    setScannerError(errorMessage);
                }
            },
        );
        return () => { scanner.clear().catch(() => undefined); };
    }, [scannerKey]);

    return (
        <AppShell activePath="/checkin">
            <div className="mx-auto max-w-[304px]">
                <PageHeader title="Event Check-In" subtitle="Scan an attendee QR code to check them in" />
                {status === 'success' && <section className="mb-2 rounded-xl bg-[#04b88d] p-3 text-white shadow-md"><div className="flex items-center gap-2"><CheckCircle2 size={16} /><div><h2 className="text-[11px] font-extrabold">Checked In Successfully</h2><p className="text-[7px] text-[#c8fff0]">{message}</p></div></div></section>}
                {status === 'error' && <section className="mb-2 rounded-xl bg-[#ff3945] p-3 text-white shadow-md"><div className="flex items-center gap-2"><CircleAlert size={16} /><div><h2 className="text-[11px] font-extrabold">QR Not Recognised</h2><p className="text-[7px] text-[#ffd2d5]">{message}</p></div></div></section>}
                <section className="rounded-xl border border-[#e4e8ed] bg-white p-2 shadow-sm"><div className="rounded-xl bg-[#071b2b] p-2"><div id="qr-reader" key={scannerKey} className="min-h-[190px] overflow-hidden rounded-lg [&_video]:rounded-lg [&_button]:text-[8px]" /><div className="flex items-center gap-1 border-t border-white/10 pt-2 text-[7px] text-[#8ca1b4]"><ScanLine size={10} /> Hold camera steady · Auto-scans in 2 seconds</div></div></section>
                {scannerError && <section className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-[#ffd6d8] bg-[#fff1f2] p-2 text-[7px] text-[#b4232b]"><span>{scannerError}</span><button type="button" onClick={() => setScannerKey((key) => key + 1)} className="flex shrink-0 items-center gap-1 rounded-lg bg-[#06395d] px-2 py-1.5 font-bold text-white"><RefreshCw size={9} /> Retry camera</button></section>}
                <section className="mt-2 rounded-xl border border-[#e4e8ed] bg-white p-2 shadow-sm"><p className="mb-1 text-[6px] font-bold uppercase tracking-[0.16em] text-[#8491a0]">Simulate QR Scan</p>{['Maria Schmidt', 'James Odhiambo', 'Awa Diallo', 'Fatima Z. Benali'].map((name, index) => <div key={name} className="flex items-center gap-2 border-b border-[#eef1f4] py-1.5 last:border-0"><span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#06395d] text-[6px] font-bold text-white">{name.split(' ').map((part) => part[0]).join('')}</span><span className="flex-1"><span className="block text-[7px] font-bold text-[#26384b]">{name}</span><span className="block text-[5px] text-[#8793a0]">OAK-2026-{String(index + 1).padStart(4, '0')}-XPH</span></span><span className="rounded-full bg-[#eef3fa] px-1.5 py-0.5 text-[5px] text-[#28537b]">{index % 2 ? 'OAK Staff' : 'Partner'}</span><ChevronRight size={9} className="text-[#9aa5b2]" /></div>)}</section>
                <form onSubmit={(event) => { event.preventDefault(); void checkIn(manualCode); }} className="mt-2 flex items-center gap-1 rounded-xl border border-[#e4e8ed] bg-white p-2 shadow-sm"><div className="flex-1"><p className="mb-1 text-[6px] font-bold uppercase tracking-[0.16em] text-[#8491a0]">Manual code entry</p><input value={manualCode} onChange={(event) => setManualCode(event.target.value)} placeholder="OAK-2026-XXXX-XXXX" className="h-7 w-full rounded-lg bg-[#eef2f5] px-2 text-[7px] text-[#26384b] outline-none" /></div><button type="submit" className="mt-3 rounded-lg bg-[#06395d] px-3 py-2 text-[7px] font-bold text-white shadow-md">Check</button></form>
            </div>
        </AppShell>
    );
}
