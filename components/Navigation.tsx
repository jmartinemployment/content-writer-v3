'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-lg text-slate-900">
              Content Writer V3
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${
                isActive('/dashboard')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              } pb-4`}
            >
              Dashboard
            </Link>
            <Link
              href="/campaigns"
              className={`text-sm font-medium ${
                isActive('/campaigns') || pathname.startsWith('/campaigns')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              } pb-4`}
            >
              Campaigns
            </Link>
            <Link
              href="/assets"
              className={`text-sm font-medium ${
                isActive('/assets') || pathname.startsWith('/assets')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              } pb-4`}
            >
              Assets
            </Link>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">
                Settings
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
