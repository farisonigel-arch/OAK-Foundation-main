'use client';

import { CheckCircle2, ChevronRight, CircleAlert, RefreshCw, ScanLine, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AppShell, PageHeader } from '../components/AppShell';

export default function CheckInPage() {
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const processingScan = useRef(false);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 190, height: 190 } }, false);
        scanner.render(async (decodedText: string) => {
            const qrCodeId = decodedText.trim();
            if (!qrCodeId || processingScan.current) return;
            processingScan.current = true;

            try {
                const response = await fetch('/api/checkin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qrCodeId }) });
                const data = await response.json();
                if (data.success) {
                    setStatus('success');
                    setMessage(data.attendee.fullName);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'QR Code Not Recognized');
                }
            } finally {
                window.setTimeout(() => { processingScan.current = false; }, 1500);
            }
        }, () => undefined);
        return () => { scanner.clear().catch(() => undefined); };
    }, []);

    return (
        <AppShell activePath="/checkin">
            <div className="mx-auto max-w-[480px]">
                <PageHeader title="Event Check-In" subtitle="Scan an attendee QR code to check them in" />
                {status === 'error' && <section className="mb-3 rounded-2xl bg-[#ff3945] p-4 text-white shadow-md"><div className="flex items-center gap-3"><div className="rounded-xl bg-white/15 p-2"><CircleAlert size={22} /></div><div><p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#ffd2d5]">Check-in failed</p><h2 className="mt-1 text-[16px] font-extrabold">QR Not Recognised</h2><p className="text-[9px] text-[#ffd2d5]">{message}</p></div></div></section>}
                {status === 'success' && <section className="mb-3 rounded-2xl bg-[#04b88d] p-4 text-white shadow-md"><div className="flex items-center gap-3"><div className="rounded-xl bg-white/15 p-2"><CheckCircle2 size={22} /></div><div><h2 className="text-[15px] font-extrabold">Checked In Successfully</h2><p className="text-[9px] text-[#c8fff0]">{message} · just now</p></div></div></section>}
                <section className="rounded-2xl border border-[#e4e8ed] bg-white p-3 shadow-sm"><div className="rounded-2xl bg-[#071b2b] p-3"><div id="qr-reader" className="min-h-[270px] overflow-hidden rounded-xl [&_video]:rounded-xl" /><div className="flex items-center gap-2 border-t border-white/10 pt-3 text-[8px] text-[#8ca1b4]"><ScanLine size={12} /> Hold camera steady · Auto-scans in 2 seconds</div></div></section>
                <section className="mt-3 rounded-2xl border border-[#e4e8ed] bg-white p-3 shadow-sm"><p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#8491a0]">Simulate QR Scan</p>{['Maria Schmidt', 'James Odhiambo', 'Awa Diallo', 'Fatima Z. Benali'].map((name, index) => <button key={name} className="flex w-full items-center gap-2 border-b border-[#eef1f4] py-2 text-left last:border-0"><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#06395d] text-[7px] font-bold text-white">{name.split(' ').map((part) => part[0]).join('')}</span><span className="flex-1"><span className="block text-[9px] font-bold text-[#26384b]">{name}</span><span className="block text-[7px] text-[#8793a0]">OAK Foundation · {index + 1} March 2026</span></span><span className="rounded-full bg-[#eef3fa] px-2 py-1 text-[7px] text-[#28537b]">{index % 2 ? 'OAK Staff' : 'Partner'}</span><ChevronRight size={11} className="text-[#9aa5b2]" /></button>)}</section>
                {status === 'error' && <><section className="mt-3 rounded-2xl border border-[#e4e8ed] bg-white p-4 shadow-sm"><p className="flex items-center gap-2 text-[10px] font-bold text-[#26384b]"><CircleAlert size={12} className="text-[#ff6870]" /> Possible reasons</p>{['QR code belongs to a different event', 'Registration was not completed', 'Code has been altered or corrupted', 'Attendee registered under a different email'].map((reason) => <p key={reason} className="mt-2 text-[9px] text-[#8491a0]">🔴 {reason}</p>)}</section><button onClick={() => setStatus('idle')} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#06395d] py-3 text-[10px] font-bold text-white shadow-md"><RefreshCw size={12} /> Try Again</button></>}
                {status !== 'error' && <div className="mt-3 rounded-2xl border border-[#e4e8ed] bg-white p-3"><div className="flex items-center gap-2 text-[9px] text-[#8491a0]"><UserRound size={12} /> Scan status: Ready for next attendee</div></div>}
            </div>
        </AppShell>
    );
}
