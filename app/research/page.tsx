'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ResearchRun, KeywordCandidate } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { useUser } from '@/lib/context/UserContext';

export default function ResearchPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [activeTab, setActiveTab] = useState<'keywords' | 'runs'>('keywords');
  const [keywords, setKeywords] = useState<KeywordCandidate[]>([]);
  const [runs, setRuns] = useState<ResearchRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientId = user?.clientId;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (clientId) {
      fetchData();
    }
  }, [clientId, authLoading, user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const keywordData = await apiClient.get<KeywordCandidate[]>(
        `/content-writer/v3/keywords?clientId=${clientId}`
      );
      setKeywords(keywordData || []);
      // TODO: Fetch research runs when endpoint available
      setRuns([]);
    } catch (err) {
      console.error('Failed to fetch research data:', err);
      setError('Failed to load research data. Please try again later.');
      setKeywords([]);
      setRuns([]);
    } finally {
      setLoading(false);
    }
  };


  const [researchRuns] = useState<ResearchRun[]>([
    {
      id: '1',
      campaignId: '1',
      keyword: 'plumbing services near me',
      status: 'completed',
      discoveredSourceCount: 12,
      spentBudget: 2.45,
      maxBudget: 5.0,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: '2',
      campaignId: '1',
      keyword: 'emergency plumber',
      status: 'running',
      discoveredSourceCount: 5,
      spentBudget: 0.82,
      maxBudget: 5.0,
      createdAt: new Date(Date.now() - 600000).toISOString(),
      startedAt: new Date(Date.now() - 300000).toISOString(),
    },
  ]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'research-queued':
        return 'bg-yellow-100 text-yellow-800';
      case 'researched':
        return 'bg-green-100 text-green-800';
      case 'briefed':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const runStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Research & Intelligence</h1>
        <p className="text-slate-600 mt-2">Manage keyword research and pain point discovery</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 mb-8">
        {['keywords', 'runs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 font-medium text-sm border-b-2 ${
              activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            {tab === 'keywords' && 'Keywords'}
            {tab === 'runs' && 'Research Runs'}
          </button>
        ))}
      </div>

      {/* Keywords Tab */}
      {activeTab === 'keywords' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Keywords</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              Add Keyword
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Keyword</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Volume</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Difficulty</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Intent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((kw) => (
                  <tr key={kw.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{kw.keyword}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{kw.searchVolume?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{kw.difficulty}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{kw.intent}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(kw.status)}`}>
                        {kw.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {kw.status === 'draft' && (
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Start Research
                        </button>
                      )}
                      {kw.status === 'researched' && (
                        <Link href={`/research/${kw.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          View Results
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Research Runs Tab */}
      {activeTab === 'runs' && (
        <div className="space-y-4">
          {researchRuns.map((run) => (
            <Link
              key={run.id}
              href={`/research/runs/${run.id}`}
              className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md hover:border-slate-300 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{run.keyword}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {run.discoveredSourceCount} sources discovered • Budget: ${run.spentBudget.toFixed(2)} / ${run.maxBudget.toFixed(2)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${runStatusColor(run.status)}`}>
                  {run.status === 'running' && '⏳ Running'}
                  {run.status === 'completed' && '✓ Completed'}
                  {run.status === 'failed' && '✗ Failed'}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(run.spentBudget / run.maxBudget) * 100}%` }}
                ></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
