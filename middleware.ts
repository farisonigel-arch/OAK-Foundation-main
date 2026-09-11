import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/checkin', '/programme', '/directory', '/attendance', '/pass'];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const rawRole = request.cookies.get('oak-role')?.value;
    const role = rawRole ? decodeURIComponent(rawRole) : undefined;
    if (!protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
        return NextResponse.next();
    }

    const allowed = role === 'Coordination Team' || role === 'OAK Staff'
        ? ['/checkin', '/programme', '/directory', '/attendance']
        : role === 'Partner'
            ? ['/pass', '/directory']
            : role
                ? ['/programme', '/directory']
                : [];

    if (!role || !allowed.some((allowedPath) => path.startsWith(allowedPath))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = { matcher: ['/checkin/:path*', '/programme/:path*', '/directory/:path*', '/attendance/:path*', '/pass/:path*'] };