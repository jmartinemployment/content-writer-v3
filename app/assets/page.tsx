'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ContentAsset } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { useUser } from '@/lib/context/UserContext';

export default function AssetsPage() {
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
      fetchAssets();
    }
  }, [clientId, authLoading, user, router]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<ContentAsset[]>(
        `/assets?clientId=${clientId}`
      );
      setAssets(data || []);
    } catch (err) {
      console.error('Failed to fetch assets:', err);
      setError('Failed to load assets. Please try again later.');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };


  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-yellow-100 text-yellow-800',
      readyForApproval: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      published: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Content Assets</h1>
        <p className="text-slate-600 mt-2">View and manage all generated content assets</p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 mt-4">Loading assets...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchAssets}
            className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {assets.map((asset) => (
          <div key={asset.id} className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <Link href={`/assets/${asset.id}`} className="flex-1 group">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{asset.type === 'pillar' ? '📄' : '📑'}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">{asset.name}</h3>
                    <p className="text-sm text-slate-600">
                      Type: <span className="font-medium">{asset.type}</span> | Campaign: {asset.campaignId}
                    </p>
                  </div>
                </div>
              </Link>
              <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${statusBadge(asset.status)}`}>
                {asset.status.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
            <div className="mt-4 flex gap-4">
              <Link
                href={`/assets/${asset.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View / Edit
              </Link>
              {asset.status !== 'published' && (
                <button className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        </div>
      )}

      {!loading && !error && assets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No assets yet</p>
        </div>
      )}
    </div>
  );
}
