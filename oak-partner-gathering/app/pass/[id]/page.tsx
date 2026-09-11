import { db } from '@/lib/db';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, QrCode } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AppShell } from '../../components/AppShell';
import { DownloadQrButton } from './DownloadQrButton';

export default async function PassPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const attendee = await db.attendee.findUnique({ where: { qrCodeId: id } });
    if (!attendee?.qrCodeId || attendee.role !== 'Partner') notFound();

    return (
        <AppShell activePath="/pass">
            <div className="mx-auto w-full max-w-[480px]">
                <div className="rounded-2xl border border-[#e4e8ed] bg-white p-4 text-center shadow-sm">
                    <div className="rounded-2xl bg-gradient-to-br from-[#071d32] to-[#123f62] p-5 text-left text-white">
                        <p className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#b7c8d8]"><QrCode size={11} /> Partner QR Pass</p>
                        <h1 className="mt-2 text-[18px] font-extrabold">OAK Foundation Event</h1>
                        <p className="mt-1 text-[9px] text-[#b7c8d8]">9–11 March 2026 · Harare, Zimbabwe</p>
                    </div>
                    <div className="py-4">
                        <h2 className="text-[16px] font-extrabold text-gray-900">{attendee.fullName}</h2>
                        <p className="mt-1 text-[10px] font-medium text-gray-500">{attendee.organization}</p>
                        <p className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-[8px] font-semibold text-emerald-700">{attendee.role}</p>
                    </div>
                    <div className="flex justify-center rounded-2xl border border-[#e4e8ed] bg-[#f4f6f8] p-5"><QRCodeSVG value={attendee.qrCodeId} size={190} includeMargin /></div>
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-[#eef2f6] px-3 py-2 text-left text-[8px] text-[#68788c]"><span>Registration ID</span><strong className="text-[#26384b]">{attendee.id.slice(0, 8).toUpperCase()}</strong></div>
                    <p className="mt-3 flex items-center justify-center gap-1 text-[9px] text-gray-500"><MapPin size={11} /> Present this QR code at the door</p>
                    <DownloadQrButton value={attendee.qrCodeId} name={attendee.fullName} />
                </div>
            </div>
        </AppShell>
    );
}
