'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
              href="/research"
              className={`text-sm font-medium ${
                isActive('/research') || pathname.startsWith('/research')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              } pb-4`}
            >
              Research
            </Link>
            <Link
              href="/pain-points"
              className={`text-sm font-medium ${
                isActive('/pain-points') || pathname.startsWith('/pain-points')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              } pb-4`}
            >
              Pain Points
            </Link>
            <Link
              href="/reconciliation"
              className={`text-sm font-medium ${
                isActive('/reconciliation')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              } pb-4`}
            >
              Reconciliation
            </Link>
            <Link
              href="/reviews"
              className={`text-sm font-medium ${
                isActive('/reviews') || pathname.startsWith('/reviews')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              } pb-4`}
            >
              Content Reviews
            </Link>
            <Link
              href="/strategy-briefs"
              className={`text-sm font-medium ${
                isActive('/strategy-briefs') || pathname.startsWith('/strategy-briefs')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              } pb-4`}
            >
              Strategy
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
            <Link
              href="/publications"
              className={`text-sm font-medium ${
                isActive('/publications') || pathname.startsWith('/publications')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              } pb-4`}
            >
              Publications
            </Link>
            <Link
              href="/analytics"
              className={`text-sm font-medium ${
                isActive('/analytics')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              } pb-4`}
            >
              Analytics
            </Link>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <span className="text-sm text-slate-600 px-2">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-md transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
