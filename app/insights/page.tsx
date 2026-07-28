'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PainPoint } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { useUser } from '@/lib/context/UserContext';

export default function InsightsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [insights, setInsights] = useState<PainPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientId = user?.clientId;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (clientId) {
      fetchInsights();
    }
  }, [clientId, authLoading, user, router]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<PainPoint[]>(
        `/pain-points?clientId=${clientId}`
      );
      setInsights(data || []);
    } catch (err) {
      console.error('Failed to fetch insights:', err);
      setError('Failed to load insights. Please try again later.');
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };


  // TODO: Backend returns different schema — map when real data endpoint is available
  const includedInsights = insights.slice(0, 0);
  const skippedInsights = insights.slice(0, 0);

  const difficultyColor = (difficulty: number) => {
    if (difficulty >= 7) return 'bg-red-100 text-red-800';
    if (difficulty >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const importanceColor = (importance: number) => {
    if (importance >= 8) return 'bg-purple-100 text-purple-800';
    if (importance >= 6) return 'bg-blue-100 text-blue-800';
    return 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Research Insights</h1>
        <p className="text-slate-600 mt-2">Independent reasoning, not SERP copying. Ordered by importance & difficulty.</p>
      </div>

      {!loading && !error && insights.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No insights discovered yet. Run research to generate insights.</p>
        </div>
      )}
    </div>
  );
}
