'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StrategyBrief } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { useUser } from '@/lib/context/UserContext';

export default function StrategyBriefsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [briefs, setBriefs] = useState<StrategyBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const campaignId = '550e8400-e29b-41d4-a716-446655440000'; // TODO: Get from route params

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (campaignId) {
      fetchBriefs();
    }
  }, [campaignId, authLoading, user, router]);

  const fetchBriefs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<StrategyBrief[]>(
        `/strategy-briefs?campaignId=${campaignId}`
      );
      setBriefs(data || []);
    } catch (err) {
      console.error('Failed to fetch briefs:', err);
      setError('Failed to load strategy briefs. Please try again later.');
      setBriefs([]);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Strategy Briefs</h1>
          <p className="text-slate-600 mt-2">Define content strategy and angles</p>
        </div>
        <Link
          href="/strategy-briefs/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          New Brief
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 mt-4">Loading strategy briefs...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchBriefs}
            className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {briefs.map((brief) => (
          <Link
            key={brief.id}
            href={`/strategy-briefs/${brief.id}`}
            className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  {brief.angle || 'Untitled Brief'}
                </h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Audience:</span> {brief.audienceProfile}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Stage:</span> {brief.buyingStage}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">CTA:</span> {brief.callToAction}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${statusColor(brief.status)}`}>
                {brief.status.charAt(0).toUpperCase() + brief.status.slice(1)}
              </span>
            </div>
          </Link>
          ))}
        </div>
      )}

      {!loading && !error && briefs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No strategy briefs yet</p>
        </div>
      )}
    </div>
  );
}
