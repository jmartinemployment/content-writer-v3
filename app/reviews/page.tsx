'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ContentAsset } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { useUser } from '@/lib/context/UserContext';

export default function ReviewsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientId = user?.clientId;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (!authLoading && user && !clientId) {
      setLoading(false);
      setError('No client is linked to this account yet.');
      return;
    }
    if (clientId) {
      fetchReviews();
    }
  }, [clientId, authLoading, user, router]);

  const fetchReviews = async () => {
    // TODO: Implement once review endpoints are available
    setLoading(false);
  };


  const statusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'ChangesRequested':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 font-bold';
    if (score >= 6) return 'text-yellow-600 font-bold';
    if (score > 0) return 'text-red-600 font-bold';
    return 'text-slate-400';
  };

  const mockReviews = [
    {
      id: '1',
      assetVersionId: 'av-001',
      status: 'Pending' as const,
      accuracyScore: 0,
      strengthScore: 0,
      alignmentScore: 0,
      editorSummary: '',
    },
    {
      id: '2',
      assetVersionId: 'av-002',
      status: 'Approved' as const,
      accuracyScore: 9,
      strengthScore: 8,
      alignmentScore: 8,
      editorSummary: 'Excellent positioning vs competitors. Strong evidence base.',
      reviewedAt: '2026-07-27T14:30:00Z',
    },
  ];

  const pendingReviews = mockReviews.filter((r) => r.status === 'Pending');
  const completedReviews = mockReviews.filter((r) => r.status !== 'Pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Content Reviews</h1>
        <p className="text-slate-600 mt-2">Editorial quality gate before publication</p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 mt-4">Loading reviews...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchReviews}
            className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Pending Reviews */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Awaiting Review ({pendingReviews.length})
            </h2>
        <div className="space-y-4">
          {pendingReviews.length === 0 ? (
            <p className="text-slate-600">No pending reviews</p>
          ) : (
            pendingReviews.map((review) => (
              <Link key={review.id} href={`/reviews/${review.id}`}>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6 hover:shadow-md cursor-pointer transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Asset Version {review.assetVersionId}
                      </h3>
                      <p className="text-sm text-slate-600">Awaiting editorial review</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Completed Reviews */}
      {completedReviews.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Completed ({completedReviews.length})</h2>
          <div className="space-y-4">
            {completedReviews.map((review) => (
              <Link key={review.id} href={`/reviews/${review.id}`}>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-slate-300 p-6 hover:shadow-md cursor-pointer transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Asset Version {review.assetVersionId}
                      </h3>
                      {review.editorSummary && (
                        <p className="text-sm text-slate-700 mt-2">{review.editorSummary}</p>
                      )}
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-600 mb-1">ACCURACY</div>
                      <div className={`text-2xl ${scoreColor(review.accuracyScore)}`}>
                        {review.accuracyScore > 0 ? `${review.accuracyScore}/10` : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-600 mb-1">STRENGTH</div>
                      <div className={`text-2xl ${scoreColor(review.strengthScore)}`}>
                        {review.strengthScore > 0 ? `${review.strengthScore}/10` : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-600 mb-1">ALIGNMENT</div>
                      <div className={`text-2xl ${scoreColor(review.alignmentScore)}`}>
                        {review.alignmentScore > 0 ? `${review.alignmentScore}/10` : '—'}
                      </div>
                    </div>
                  </div>

                  {review.reviewedAt && (
                    <p className="text-xs text-slate-500 mt-4">
                      Reviewed on {new Date(review.reviewedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
