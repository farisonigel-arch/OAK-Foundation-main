'use client';

import { CalendarDays, UserRound, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from './components/AppShell';

export default function RegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      organization: formData.get('organization'),
      subPartner: formData.get('subPartner'),
      role: formData.get('role'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      dietaryRequirements: formData.get('dietaryRequirements'),
      accessibilityNeeds: formData.get('accessibilityNeeds'),
      travelDetails: formData.get('travelDetails'),
      accommodationDetails: formData.get('accommodationDetails'),
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.error || 'Failed to register');
        setLoading(false);
      } else {
        if (result.role === 'Partner' && result.qrCodeId) {
          router.push(`/pass/${result.qrCodeId}`);
        } else if (result.role === 'Coordination Team' || result.role === 'OAK Staff') {
          router.push('/checkin');
        } else {
          router.push('/programme');
        }
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <AppShell activePath="/">
      <div className="mx-auto w-full max-w-[480px] space-y-4">
        <div className="bg-gradient-to-r from-[#031E38] to-[#0D4B75] text-white rounded-2xl p-6 shadow-md">
          <h1 className="text-xl leading-[1.08] font-bold tracking-tight">Partner<br />Convening 2026</h1>
          <p className="text-[10px] leading-none text-blue-200 mt-2 font-medium">Geneva • 9–11 March 2026</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
            <UserRound size={13} strokeWidth={1.7} className="text-[#A8BBCE]" />
            <p className="text-lg font-bold text-gray-900 leading-none mt-1">110+</p>
            <p className="text-[9px] text-gray-400 font-medium mt-1">Attendees</p>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
            <CalendarDays size={13} strokeWidth={1.7} className="text-[#A8BBCE]" />
            <p className="text-lg font-bold text-gray-900 leading-none mt-1">24</p>
            <p className="text-[9px] text-gray-400 font-medium mt-1">Sessions</p>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
            <UsersRound size={13} strokeWidth={1.7} className="text-[#A8BBCE]" />
            <p className="text-lg font-bold text-gray-900 leading-none mt-1">38</p>
            <p className="text-[9px] text-gray-400 font-medium mt-1">Partners</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-5">Registration Form</h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">FIRST NAME <span className="text-red-400">*</span></label>
                <input type="text" name="firstName" required placeholder="Maria" className="w-full h-10 bg-[#EBF0F5] border-0 rounded-lg px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#073252]" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">LAST NAME <span className="text-red-400">*</span></label>
                <input type="text" name="lastName" required placeholder="Schmidt" className="w-full h-10 bg-[#EBF0F5] border-0 rounded-lg px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#073252]" />
              </div>
            </div>

            <div>
              <label className="block text-[6px] font-bold uppercase tracking-wider text-gray-500 mb-1">ORGANISATION <span className="text-red-400">*</span></label>
              <input type="text" name="organization" required placeholder="Your organisation name" className="w-full h-6 bg-[#EBF0F5] border-0 rounded-[6px] px-2 text-[7px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#073252]" />
            </div>

            <div>
              <label className="block text-[6px] font-bold uppercase tracking-wider text-gray-500 mb-1">SUB-PARTNER / PROGRAMME AREA</label>
              <input type="text" name="subPartner" placeholder="Optional" className="w-full h-6 bg-[#EBF0F5] border-0 rounded-[6px] px-2 text-[7px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#073252]" />
            </div>

            <div>
              <label className="block text-[6px] font-bold uppercase tracking-wider text-gray-500 mb-1">ROLE / CAPACITY <span className="text-red-400">*</span></label>
              <select name="role" required defaultValue="" className="w-full h-6 bg-[#EBF0F5] border-0 rounded-[6px] px-2 text-[7px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#073252]">
                <option value="" disabled>Select your role</option>
                <option value="Partner">Partner</option>
                <option value="OAK Staff">OAK Staff</option>
                <option value="Coordination Team">Coordination Team</option>
                <option value="Presenter">Presenter</option>
                <option value="Observer">Observer</option>
              </select>
            </div>

            <div>
              <label className="block text-[6px] font-bold uppercase tracking-wider text-gray-500 mb-1">EMAIL ADDRESS <span className="text-red-400">*</span></label>
              <input type="email" name="email" required placeholder="you@organisation.org" className="w-full h-6 bg-[#EBF0F5] border-0 rounded-[6px] px-2 text-[7px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#073252]" />
            </div>

            <div>
              <label className="block text-[6px] font-bold uppercase tracking-wider text-gray-500 mb-1">PHONE NUMBER</label>
              <input type="tel" name="phone" placeholder="+41 xx xxx xx xx" className="w-full h-6 bg-[#EBF0F5] border-0 rounded-[6px] px-2 text-[7px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#073252]" />
            </div>

            <div className="bg-[#EBF0F5] rounded-[9px] p-2.5 space-y-2 mt-1">
              <p className="text-[6px] font-bold uppercase tracking-wider text-gray-500">REQUIREMENTS</p>
              <div>
                <label className="block text-[6px] font-bold uppercase tracking-wider text-gray-600 mb-1">DIETARY REQUIREMENTS</label>
                <input type="text" name="dietaryRequirements" placeholder="e.g. Vegetarian, Halal, Gluten-free" className="w-full h-5 bg-white border-0 rounded-[5px] px-2 text-[7px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#073252]" />
              </div>
              <div>
                <label className="block text-[6px] font-bold uppercase tracking-wider text-gray-600 mb-1">ACCESSIBILITY REQUIREMENTS</label>
                <input type="text" name="accessibilityNeeds" placeholder="e.g. Wheelchair access, hearing loop" className="w-full h-5 bg-white border-0 rounded-[5px] px-2 text-[7px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#073252]" />
              </div>
              <div>
                <label className="block text-[6px] font-bold uppercase tracking-wider text-gray-600 mb-1">TRAVEL & ACCOMMODATION</label>
                <input type="text" name="travelDetails" placeholder="e.g. Flight from London, hotel needed" className="w-full h-5 bg-white border-0 rounded-[5px] px-2 text-[7px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#073252]" />
              </div>
              <div>
                <label className="hidden">ACCOMMODATION</label>
                <input type="hidden" name="accommodationDetails" />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" name="consent" required className="mt-0.5 h-3 w-3 rounded border-gray-300 text-[#073252]" />
                <span className="text-[7px] leading-tight text-gray-600">
                  I agree to OAK Foundation&apos;s privacy policy and consent to my registration data being used for event coordination.
                </span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-2 bg-[#073252] hover:bg-[#031E38] text-white font-semibold h-7 px-4 rounded-[7px] text-[8px] transition shadow-md disabled:opacity-50">
              {loading ? 'Processing...' : 'Register'}
            </button>
          </form>
        </div>
        <p className="text-[7px] text-center text-gray-400 pb-6">Your data is secured and handled by OAK Foundation in accordance with GDPR.</p>
      </div>
    </AppShell>
  );
}
