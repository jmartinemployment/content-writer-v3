'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PainPoint } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { useUser } from '@/lib/context/UserContext';

export default function PainPointsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
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
      fetchPainPoints();
    }
  }, [clientId, authLoading, user, router]);

  const fetchPainPoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<PainPoint[]>(
        `/pain-points?clientId=${clientId}`
      );
      setPainPoints(data || []);
    } catch (err) {
      console.error('Failed to fetch pain points:', err);
      setError('Failed to load pain points. Please try again later.');
      setPainPoints([]);
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 75) return 'bg-blue-100 text-blue-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Pain Points</h1>
        <p className="text-slate-600 mt-2">Client pain points with evidence-linked research</p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 mt-4">Loading pain points...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchPainPoints}
            className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          {painPoints.map((pp) => (
          <Link
            key={pp.id}
            href={`/pain-points/${pp.id}`}
            className="bg-white rounded-lg shadow-sm p-8 border border-slate-200 hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600">{pp.name}</h3>
                <p className="text-slate-600 mt-2">{pp.description}</p>
              </div>
              <div className="flex gap-3 ml-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${confidenceColor(pp.confidence)}`}>
                  {pp.confidence}% confidence
                </span>
                {pp.staleSince && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 whitespace-nowrap">
                    ⚠️ Stale
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Reader Symptom</div>
                <p className="text-slate-800">{pp.readerSymptom}</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Cost of Inaction</div>
                <p className="text-slate-800">{pp.costOfInaction}</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Service Offering</div>
                <p className="text-slate-800">{pp.offerTerminology}</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Common Objections</div>
                <ul className="list-disc list-inside text-slate-800 space-y-1">
                  {pp.objections.slice(0, 2).map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                  {pp.objections.length > 2 && <li className="text-slate-600">+{pp.objections.length - 2} more</li>}
                </ul>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View Evidence
              </button>
              <button className="text-slate-600 hover:text-slate-900 font-medium">
                Edit
              </button>
            </div>
          </Link>
          ))}
        </div>
      )}

      {!loading && !error && painPoints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No pain points yet</p>
          <p className="text-slate-500 mt-2">Run research to discover client pain points</p>
        </div>
      )}
    </div>
  );
}
