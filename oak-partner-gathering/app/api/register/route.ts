import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      organization,
      subPartner,
      role,
      email,
      phone,
      dietaryRequirements,
      accessibilityNeeds,
      travelDetails,
      accommodationDetails,
    } = body;

    if (!firstName || !lastName || !organization || !role || !email) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const fullOrg = subPartner ? `${organization} (${subPartner})` : organization;

    const newAttendee = await db.attendee.create({
      data: {
        fullName,
        organization: fullOrg,
        role,
        email,
        phone: phone || null,
        dietaryRequirements: dietaryRequirements || null,
        accessibilityNeeds: accessibilityNeeds || null,
        travelDetails: travelDetails || null,
        accommodationDetails: accommodationDetails || null,
        qrCodeId: role === 'Partner' ? crypto.randomUUID() : undefined,
      },
    });

    const response = NextResponse.json({ success: true, role: newAttendee.role, qrCodeId: newAttendee.qrCodeId });
    response.cookies.set('oak-role', newAttendee.role, { httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
    if (newAttendee.qrCodeId) {
      response.cookies.set('oak-qr-id', newAttendee.qrCodeId, { httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
    }
    return response;
  } catch (error: unknown) {
    const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined;
    if (code === 'P2002') {
      return NextResponse.json(
        { error: 'An attendee with this email address is already registered.' },
        { status: 400 }
      );
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to complete registration.' },
      { status: 500 }
    );
  }
}
