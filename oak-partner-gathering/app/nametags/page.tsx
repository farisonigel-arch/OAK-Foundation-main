import { db } from '@/lib/db';
import { QRCodeSVG } from 'qrcode.react';

export default async function NametagsPage() {
  const attendees = (await db.attendee.findMany()).filter((attendee) => attendee.qrCodeId);

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-xl font-bold mb-6 print:hidden">Printable Nametag Sheet</h1>
      <div className="grid grid-cols-2 gap-4 print:grid-cols-2">
        {attendees.map((attendee) => (
          <div key={attendee.id} className="border-2 border-dashed border-gray-300 p-6 rounded-xl flex justify-between items-center bg-white">
            <div>
              <p className="text-xs font-bold text-[#073252] uppercase">Oak Zimbabwe Convening</p>
              <h2 className="text-lg font-bold text-gray-900 mt-1">{attendee.fullName}</h2>
              <p className="text-xs text-gray-600">{attendee.organization}</p>
              <span className="inline-block mt-2 text-[10px] bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-700">{attendee.role}</span>
            </div>
            <QRCodeSVG value={attendee.qrCodeId!} size={80} />
          </div>
        ))}
      </div>
    </div>
  );
}
