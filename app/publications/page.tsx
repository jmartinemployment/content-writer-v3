'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Publication } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { useUser } from '@/lib/context/UserContext';

export default function PublicationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchPublications();
    }
  }, [authLoading, user, router]);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<Publication[]>(
        `/publications`
      );
      setPublications(data || []);
    } catch (err) {
      console.error('Failed to fetch publications:', err);
      setError('Failed to load publications. Please try again later.');
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Publications</h1>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 mt-4">Loading publications...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchPublications}
            className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {publications.map((pub) => (
            <div
              key={pub.id}
              className="bg-white rounded-lg shadow-sm p-6 border border-slate-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {pub.status}
                  </h3>
                  <p className="text-slate-600 mt-2">ID: {pub.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && publications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No publications yet</p>
        </div>
      )}
    </div>
  );
}
