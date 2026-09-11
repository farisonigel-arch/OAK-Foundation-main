import { ChevronRight, Globe2, Search, Tag, UsersRound } from 'lucide-react';
import { AppShell, PageHeader } from '../components/AppShell';

const partners = [
    { initials: 'OSF', name: 'Open Society Foundations', role: 'Global', tags: ['Democracy', 'Human Rights', 'Justice'], website: 'opensocietyfoundations.org' },
    { initials: 'ACA', name: 'Africa Climate Alliance', role: 'Sub-Saharan Africa', tags: ['Climate Justice', 'Youth-led'], website: 'africaclimatealliance.org' },
    { initials: 'NEC', name: 'Nordic Evaluation Centre', role: 'Northern Europe', tags: ['Research', 'Evaluation'], website: 'nordicevaluation.org' },
    { initials: 'MIG', name: 'MENA Rights Group', role: 'MENA & North Africa', tags: ['Human Rights', 'Accountability'], website: 'menarights.org' },
    { initials: 'DFI', name: 'Digital Frontiers Institute', role: 'Global / East Africa', tags: ['Digital Rights', 'Civic Tech'], website: 'digitalfrontiers.org' },
    { initials: 'GAL', name: 'Global Advocacy Lab', role: 'Global', tags: ['NGO', 'Communications'], website: 'globaladvocacy.org' },
    { initials: 'SP', name: 'Sciences Po Paris', role: 'Academic partner', tags: ['Academic', 'Research'], website: 'sciencespo.fr' },
    { initials: 'EFA', name: 'Environmental Funds Group', role: 'Europe', tags: ['Nature', 'Environment'], website: 'efundsgroup.org' },
];

export default function DirectoryPage() {
    return (
        <AppShell activePath="/directory">
            <div className="mx-auto max-w-[480px]">
                <PageHeader title="Partner Directory" subtitle="8 participating organizations" />
                <div className="rounded-2xl border border-[#e4e8ed] bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2 rounded-xl bg-[#eef2f6] px-3 py-2 text-[9px] text-[#8693a1]"><Search size={12} /> Search organizations, focus areas...</div>
                    <div className="mt-2 flex gap-1 overflow-hidden text-[7px] font-semibold text-[#6f7e90]"><span className="rounded-full bg-[#06395d] px-2 py-1 text-white">All Partners</span><span className="rounded-full bg-[#eef2f6] px-2 py-1">Global</span><span className="rounded-full bg-[#eef2f6] px-2 py-1">Sub-Saharan Africa</span><span className="rounded-full bg-[#eef2f6] px-2 py-1">Human Rights</span></div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#8693a1]"><UsersRound size={11} /> Sub-partners</div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {partners.slice(0, 3).map((partner) => <div key={partner.initials} className="rounded-2xl border border-[#e4e8ed] bg-white p-3 text-center shadow-sm"><span className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-[#06395d] text-[8px] font-bold text-white">{partner.initials}</span><p className="mt-2 text-[9px] font-bold text-[#1a2a3c]">{partner.initials}</p><p className="text-[7px] text-[#8491a0]">{partner.role}</p></div>)}
                </div>
                <div className="mt-4 space-y-2">
                    <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#8693a1]">All Partners</p>
                    {partners.map((partner, index) => <article key={partner.name} className="rounded-2xl border border-[#e4e8ed] bg-white p-3 shadow-[0_3px_9px_rgba(27,45,67,0.05)]"><div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#06395d] text-[8px] font-bold text-white">{partner.initials}</span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><h2 className="text-[10px] font-bold text-[#172334]">{partner.name}</h2><p className="text-[8px] text-[#8793a0]">{partner.role}</p></div><ChevronRight size={12} className="text-[#9aa5b2]" /></div><div className="mt-2 flex gap-1">{partner.tags.map((tag) => <span key={tag} className="rounded-full bg-[#eef2f6] px-2 py-1 text-[7px] text-[#66778b]"><Tag size={7} className="mr-1 inline" />{tag}</span>)}</div></div></div><div className="mt-3 flex justify-between border-t border-[#eef1f4] pt-2 text-[7px] text-[#8793a0]"><span>Partner since 2018</span><a href={`https://${partner.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-semibold text-[#365c7d]"><Globe2 size={8} />{partner.website}</a></div>{index === 0 && <p className="mt-2 text-[8px] leading-relaxed text-[#697889]">Building vibrant and tolerant democracies through digital rights and justice initiatives.</p>}</article>)}
                </div>
            </div>
        </AppShell>
    );
}
