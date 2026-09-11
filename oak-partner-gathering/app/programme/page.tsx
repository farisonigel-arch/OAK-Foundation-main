'use client';

import { CalendarDays, ChevronDown, MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import { AppShell, PageHeader } from '../components/AppShell';

const days = [
    { id: 'Day 1', date: '8 Mar', label: 'MON' },
    { id: 'Day 2', date: '10 Mar', label: 'TUE' },
    { id: 'Day 3', date: '11 Mar', label: 'WED' },
];

const schedule = [
    { time: '08:30', end: '09:30', title: 'Registration & Welcome Coffee', room: 'Main Hall A', type: 'Plenary' },
    { time: '10:30', end: '11:30', title: 'Thematic Dialogue: Climate Justice & Grantmaking', room: 'Conference Room B2', speaker: 'Samuel Okafor · Africa Climate Alliance', type: 'Breakout' },
    { time: '11:30', end: '12:30', title: 'Workshop: Measuring Long-term Change', room: 'Workshop Room C', speaker: 'Dr. Ingrid Holm · Nordic Evaluation Centre', type: 'Workshop' },
    { time: '13:30', end: '14:30', title: 'Partner Spotlight: Rights-Based Approaches', room: 'Main Hall A', speaker: 'Fatima Zahra Benali · MENA Rights Group', type: 'Plenary' },
    { time: '14:45', end: '16:00', title: 'Digital Rights in Authoritarian Contexts', room: 'Conference Room B1', speaker: 'Li Wei · Digital Frontiers Institute', type: 'Breakout' },
    { time: '18:00', end: '20:00', title: 'Welcome Reception & Dinner', room: 'Rooftop Terrace', type: 'Social' },
];

const typeStyles: Record<string, string> = {
    Plenary: 'bg-[#eef3fa] text-[#28537b]',
    Breakout: 'bg-[#fff3c8] text-[#946c00]',
    Workshop: 'bg-[#f4ecff] text-[#7744a8]',
    Social: 'bg-[#fff0e5] text-[#ad642c]',
};

export default function ProgrammePage() {
    const [activeDay, setActiveDay] = useState('Day 1');
    return (
        <AppShell activePath="/programme">
            <div className="mx-auto max-w-[480px]">
                <PageHeader title="Programme" subtitle="OAK Partner Convening 2026" />
                <div className="mb-3 flex rounded-lg bg-[#e6ebf1] p-1 text-[9px] font-semibold text-[#738195]">
                    <button className="flex-1 rounded-md bg-white py-2 text-[#1c2e45] shadow-sm">Schedule</button>
                    <button className="flex-1 py-2">Docs</button>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2">
                    {days.map((day, index) => (
                        <button key={day.id} onClick={() => setActiveDay(day.id)} className={`rounded-2xl border p-3 text-left ${activeDay === day.id ? 'border-[#06395d] bg-[#06395d] text-white shadow-md' : 'border-[#e7eaee] bg-white text-[#26384b]'}`}>
                            <p className="text-[8px] font-bold tracking-widest opacity-70">{day.label}</p>
                            <p className="mt-1 text-[16px] font-extrabold">Day {index + 1}</p>
                            <p className="text-[9px] opacity-70">{day.date}</p>
                        </button>
                    ))}
                </div>
                <section className="mb-4 rounded-2xl bg-gradient-to-br from-[#071d32] to-[#123f62] p-5 text-white shadow-md">
                    <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-[#adc3d8]"><Star size={10} fill="currentColor" /> Featured · 09:30–10:30</div>
                    <h2 className="mt-3 text-[16px] font-extrabold">Opening Plenary: Pathways to Impact</h2>
                    <p className="mt-2 text-[9px] text-[#b7c8d8]">Dr. Helena Moreau · OAK Foundation</p>
                    <p className="mt-2 flex items-center gap-1 text-[9px] text-[#b7c8d8]"><MapPin size={10} /> Main Hall A</p>
                </section>
                <div className="mb-2 flex items-center gap-4 text-[8px] text-[#738195]"><span className="text-[#28537b]">● Plenary</span><span className="text-[#dcae1d]">● Breakout</span><span className="text-[#8d5fba]">● Workshop</span><span className="text-[#d67a42]">● Social</span></div>
                <div className="space-y-2">
                    {schedule.map((item) => (
                        <article key={item.title} className="flex gap-3 rounded-2xl border border-[#e7eaee] bg-white p-3 shadow-[0_3px_9px_rgba(27,45,67,0.06)]">
                            <div className="w-11 shrink-0 pt-1 text-[8px] font-bold text-[#55677d]"><p>{item.time}</p><p className="font-normal text-[#9aa5b2]">-{item.end}</p></div>
                            <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="text-[10px] font-bold text-[#172334]">{item.title}</h3><span className={`shrink-0 rounded-full px-2 py-1 text-[7px] font-bold ${typeStyles[item.type]}`}>{item.type}</span></div>{item.speaker && <p className="mt-1 text-[8px] text-[#778596]">{item.speaker}</p>}<p className="mt-1 flex items-center gap-1 text-[8px] text-[#778596]"><MapPin size={9} /> {item.room}</p></div><ChevronDown size={12} className="mt-1 shrink-0 text-[#9aa5b2]" />
                        </article>
                    ))}
                </div>
                <p className="mt-4 flex items-center justify-center gap-1 text-[8px] text-[#8793a0]"><CalendarDays size={10} /> Showing {activeDay} · 9–11 March 2026</p>
            </div>
        </AppShell>
    );
}
