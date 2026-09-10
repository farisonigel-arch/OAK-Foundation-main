import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { qrCodeId } = await request.json();

    if (!qrCodeId) {
      return NextResponse.json({ error: 'QR Code Not Recognized' }, { status: 400 });
    }

    const attendee = await db.attendee.findUnique({
      where: { qrCodeId },
    });

    if (!attendee) {
      return NextResponse.json({ error: 'Invalid QR Code' }, { status: 404 });
    }

    const today = new Date().toISOString().split('T')[0];

    await db.attendanceLog.create({
      data: {
        attendeeId: attendee.id,
        checkInDate: today,
      },
    });

    return NextResponse.json({
      success: true,
      attendee: {
        fullName: attendee.fullName,
        organization: attendee.organization,
        role: attendee.role,
        checkedInAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined;
    if (code === 'P2002') {
      return NextResponse.json({ error: 'Already checked in today' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
