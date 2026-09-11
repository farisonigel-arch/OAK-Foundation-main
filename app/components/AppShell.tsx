'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Globe2, LayoutGrid, ScanLine, UserRoundPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

const navigation = [
    { href: '/', label: 'Register', icon: UserRoundPlus },
    { href: '/checkin', label: 'Check In', icon: ScanLine },
    { href: '/programme', label: 'Programme', icon: CalendarDays },
    { href: '/directory', label: 'Partners', icon: Globe2 },
    { href: '/attendance', label: 'Attendance', icon: LayoutGrid },
];

export function AppShell({ children, activePath }: { children: React.ReactNode; activePath?: string }) {
    const pathname = usePathname();
    const active = activePath ?? pathname;
    const registrationOnly = pathname === '/';
    const role = useSyncExternalStore(
        () => () => undefined,
        () => {
            const match = document.cookie.match(/(?:^|; )oak-role=([^;]+)/);
            return match ? decodeURIComponent(match[1]) : null;
        },
        () => null,
    );

<<<<<<< HEAD
    const allowedPaths = role === 'Coordination Team' || role === 'OAK Staff'
=======
    const allowedPaths = role === 'Coordination Team'
>>>>>>> d203fbf811e27424e823814268aff38d62c536db
        ? ['/', '/checkin', '/programme', '/directory', '/attendance']
        : role === 'Partner'
            ? ['/', '/pass', '/directory']
            : role
                ? ['/', '/programme', '/directory']
                : ['/'];

    return (
        <div className="min-h-screen bg-[#f4f5f7] text-[#0e1726] md:flex">
            <aside className="hidden w-[132px] shrink-0 flex-col border-r border-[#e4e8ed] bg-white md:flex">
                <div className="border-b border-[#e4e8ed] px-3 pb-4 pt-3">
                    <Image src="/logo.jpeg" alt="OAK Foundation" width={92} height={44} className="h-11 w-[92px] object-contain object-left" />
                </div>
                <nav className="space-y-1 px-3 py-3">
                    {navigation.filter(({ href }) => registrationOnly ? href === '/' : allowedPaths.some((path) => path === '/' ? href === '/' : href.startsWith(path))).map(({ href, label, icon: Icon }) => {
                        const isActive = href === '/' ? active === '/' : active.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[10px] font-semibold transition ${isActive ? 'bg-[#06395d] text-white shadow-[0_4px_10px_rgba(6,57,93,0.22)]' : 'text-[#68788c] hover:bg-[#eef1f5]'
                                    }`}
                            >
                                <Icon size={13} strokeWidth={1.8} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="mt-auto border-t border-[#e4e8ed] px-4 py-4">
                    <div className="flex items-center gap-2 text-[#778596]">
                        <Globe2 size={14} strokeWidth={1.7} />
                        <div>
                            <p className="text-[9px] font-bold text-[#26384b]">Harare, Zimbabwe</p>
                            <p className="text-[8px]">9–11 March 2026</p>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex min-h-screen flex-1 flex-col">
                <header className="flex items-center gap-3 border-b border-[#e4e8ed] bg-white px-4 py-3 md:hidden">
                    <Image src="/logo.jpeg" alt="OAK Foundation" width={90} height={36} className="h-9 w-[90px] object-contain" />
                </header>
                <main className="flex-1 px-4 py-6 md:px-8 md:py-7">{children}</main>
            </div>
        </div>
    );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
    return (
        <header className="mb-5">
            {eyebrow && <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#8491a0]">{eyebrow}</p>}
            <h1 className="mt-1 text-[20px] font-extrabold tracking-[-0.02em] text-[#0e1726]">{title}</h1>
            {subtitle && <p className="mt-1 text-[10px] text-[#7d8b9b]">{subtitle}</p>}
        </header>
    );
}
