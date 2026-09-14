import { UsersRound, ScanLine } from 'lucide-react';
import { db } from '@/lib/db';
import { AppShell, PageHeader } from '../components/AppShell';

// Queries the database on every request, so it must be server-rendered
// per-request rather than statically generated at build time.
export const dynamic = 'force-dynamic';

export default async function AttendancePage() {
    const [registered, checkedIn, roleCounts] = await Promise.all([
        db.attendee.count(),
        db.attendanceLog.findMany({ distinct: ['attendeeId'], select: { attendeeId: true } }),
        db.attendee.groupBy({ by: ['role'], _count: { role: true } }),
    ]);
    const pending = Math.max(registered - checkedIn.length, 0);

    return (
        <AppShell activePath="/attendance">
            <div className="mx-auto max-w-[480px]">
                <PageHeader title="Attendance" subtitle="Check-in tracking · 9–11 March 2026" />
                <section className="rounded-2xl border border-[#e4e8ed] bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef3f7] text-[#a8bbce]"><UsersRound size={27} strokeWidth={1.5} /></div>
                    <h2 className="mt-4 text-[13px] font-extrabold text-[#172334]">{checkedIn.length ? `${checkedIn.length} check-ins recorded` : 'No check-ins yet'}</h2>
                    <p className="mx-auto mt-2 max-w-[260px] text-[9px] leading-relaxed text-[#8491a0]">Attendees will appear here once they have been scanned in at the event entrance.</p>
                    <a href="/checkin" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#06395d] px-4 py-3 text-[10px] font-bold text-white shadow-md"><ScanLine size={12} /> Go to Check-In Scanner</a>
                </section>
                <section className="mt-4 rounded-2xl border border-[#e4e8ed] bg-white p-4 shadow-sm"><p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#8491a0]">Event Overview</p><div className="mt-3 grid grid-cols-3 gap-2">{[['Expected', registered], ['Checked in', checkedIn.length], ['Pending', pending]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#eef2f6] p-3 text-center"><p className="text-[17px] font-extrabold text-[#123b60]">{value}</p><p className="text-[8px] text-[#8793a0]">{label}</p></div>)}</div></section>
                <section className="mt-4 rounded-2xl border border-[#e4e8ed] bg-white p-4 shadow-sm"><p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#8491a0]">Role Breakdown</p><div className="mt-3 space-y-2">{['Partner', 'OAK Staff', 'Coordination Team', 'Presenter', 'Observer'].map((role) => <div key={role} className="flex items-center justify-between rounded-xl bg-[#f7f8fa] px-3 py-2 text-[9px]"><span className="text-[#66778b]">{role}</span><span className="font-bold text-[#123b60]">{roleCounts.find((item) => item.role === role)?._count.role ?? 0}</span></div>)}</div></section>
            </div>
        </AppShell>
    );
}
