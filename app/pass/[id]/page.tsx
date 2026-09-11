import { db } from '@/lib/db';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '../../components/AppShell';
import { DownloadQrButton } from './DownloadQrButton';

export default async function PassPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const attendee = await db.attendee.findUnique({ where: { qrCodeId: id } });
    if (!attendee?.qrCodeId || attendee.role !== 'Partner') notFound();
    const firstName = attendee.fullName.split(/\s+/)[0];

    return (
        <AppShell activePath="/pass">
            <div className="mx-auto w-full max-w-[304px]">
                <div className="rounded-xl bg-gradient-to-br from-[#06395d] to-[#164e77] px-3 py-3 text-white shadow-md">
                    <div className="flex items-start gap-2">
                        <div className="rounded-lg border border-white/20 bg-white/10 p-1.5"><CheckCircle2 size={14} /></div>
                        <div>
                            <p className="text-[6px] font-bold uppercase tracking-[0.16em] text-[#b7c8d8]">Registration complete</p>
                            <h1 className="mt-0.5 text-[13px] font-extrabold leading-[1.05]">You&apos;re Registered,<br />{firstName}!</h1>
                            <p className="mt-1 text-[6px] text-[#b7c8d8]">uncommon.org</p>
                        </div>
                    </div>
                </div>

                <section className="mt-2 rounded-xl border border-[#e4e8ed] bg-white px-4 py-3 text-center shadow-sm">
                    <p className="text-[6px] font-bold uppercase tracking-[0.16em] text-[#8491a0]">Your entry pass</p>
                    <div className="mx-auto mt-2 flex w-fit justify-center rounded-xl bg-[#eef2f5] p-2.5">
                        <QRCodeSVG value={attendee.qrCodeId} size={104} level="H" />
                    </div>
                    <p className="mt-2 font-mono text-[6px] tracking-[0.14em] text-[#8491a0]">OAK-{attendee.id.slice(0, 4).toUpperCase()}-{attendee.id.slice(-4).toUpperCase()}</p>
                    <p className="mt-1 text-[6px] text-[#8491a0]">Present at event entrance for check-in</p>
                </section>

                <section className="mt-2 rounded-xl border border-[#e4e8ed] bg-white px-3 py-2.5 shadow-sm">
                    <p className="mb-1 text-[6px] font-bold uppercase tracking-[0.16em] text-[#8491a0]">Registration details</p>
                    <dl className="text-[7px]">
                        {[
                            ['Name', attendee.fullName],
                            ['Organisation', attendee.organization],
                            ['Role', attendee.role],
                            ['Email', attendee.email],
                            ['Event Dates', '9–11 March 2026'],
                            ['Location', 'Harare, Zimbabwe'],
                        ].map(([label, value]) => (
                            <div key={label} className="flex justify-between gap-3 border-t border-[#eef1f4] py-1 first:border-t-0">
                                <dt className="text-[#8491a0]">{label}</dt>
                                <dd className="text-right font-semibold text-[#26384b]">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                <DownloadQrButton value={attendee.qrCodeId} name={attendee.fullName} />
                <Link href="/" className="mt-2 flex items-center justify-center gap-1 text-[7px] text-[#8491a0] hover:text-[#06395d]"><UserRoundPlus size={9} /> Register another attendee</Link>
            </div>
        </AppShell>
    );
}
