'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useUser } from '@/lib/context/UserContext';

interface ContentMetrics {
  id: string;
  title: string;
  publishedDate: string;
  views: number;
  engagedViews: number;
  conversions: number;
  avgTimeOnPage: number;
  bounceRate: number;
  qualityScore: number;
}

interface InsightAnalytics {
  insightId: string;
  title: string;
  usageCount: number;
  successCount: number;
  averageScore: number;
  successRate: number;
  status: 'ProvenWinner' | 'Solid' | 'Struggling' | 'RetirementCandidate';
  strengths: string[];
  weaknesses: string[];
  shouldRetire: boolean;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [contentMetrics, setContentMetrics] = useState<ContentMetrics[]>([]);
  const [insightAnalytics, setInsightAnalytics] = useState<InsightAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientId = user?.clientId;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (clientId) {
      fetchAnalytics();
    }
  }, [clientId, authLoading, user, router]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<{ metrics: ContentMetrics[]; insights: InsightAnalytics[] }>(
        `/content-writer/v3/analytics?clientId=${clientId}`
      );
      setContentMetrics(data?.metrics || []);
      setInsightAnalytics(data?.insights || []);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics. Please try again later.');
      setContentMetrics([]);
      setInsightAnalytics([]);
    } finally {
      setLoading(false);
    }
  };

  const mockContentMetrics = [
    {
      id: '1',
      title: 'Emergency Plumbing: When Minutes Matter',
      publishedDate: '2026-07-25',
      views: 1250,
      engagedViews: 892,
      conversions: 87,
      avgTimeOnPage: 3.2,
      bounceRate: 28,
      qualityScore: 8,
    },
    {
      id: '2',
      title: 'Preventive Maintenance ROI',
      publishedDate: '2026-07-20',
      views: 680,
      engagedViews: 442,
      conversions: 31,
      avgTimeOnPage: 2.1,
      bounceRate: 35,
      qualityScore: 6,
    },
  ];

  const mockInsightAnalytics = [
    {
      insightId: '1',
      title: 'Emergency Response Window is Critical',
      usageCount: 2,
      successCount: 2,
      averageScore: 9,
      successRate: 100,
      status: 'ProvenWinner',
      strengths: ['Drives urgency', 'High conversion intent'],
      weaknesses: [],
      shouldRetire: false,
    },
    {
      insightId: '2',
      title: 'Preventive Maintenance ROI',
      usageCount: 2,
      successCount: 1,
      averageScore: 6.5,
      successRate: 50,
      status: 'Solid',
      strengths: ['Reframes cost as investment'],
      weaknesses: ['Not as compelling as urgency angle'],
      shouldRetire: false,
    },
    {
      insightId: '3',
      title: 'DIY Dangers Myth',
      usageCount: 3,
      successCount: 0,
      averageScore: 2,
      successRate: 0,
      status: 'RetirementCandidate',
      strengths: [],
      weaknesses: ['Too obvious', 'Readers see everywhere', 'No differentiation'],
      shouldRetire: true,
    },
  ];

  const qualityColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const insightStatusColor = (status: string) => {
    switch (status) {
      case 'ProvenWinner':
        return 'bg-green-100 text-green-800';
      case 'Solid':
        return 'bg-blue-100 text-blue-800';
      case 'Struggling':
        return 'bg-yellow-100 text-yellow-800';
      case 'RetirementCandidate':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const engagementRate = (engaged: number, views: number) =>
    views > 0 ? ((engaged / views) * 100).toFixed(1) : '0';
  const conversionRate = (conversions: number, views: number) =>
    views > 0 ? ((conversions / views) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Analytics & Learning</h1>
        <p className="text-slate-600 mt-2">Performance feedback loop: measure, analyze, improve</p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 mt-4">Loading analytics...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Content Performance */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Content Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 border-b-2 border-slate-300">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Title</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Views</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Engagement</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Conversions</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Avg Time</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {contentMetrics.map((content) => (
                <tr key={content.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900 font-medium">{content.title}</td>
                  <td className="px-4 py-3 text-center text-slate-700">{content.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-slate-700">
                    {engagementRate(content.engagedViews, content.views)}%
                  </td>
                  <td className="px-4 py-3 text-center text-slate-700">
                    {conversionRate(content.conversions, content.views)}%
                  </td>
                  <td className="px-4 py-3 text-center text-slate-700">{content.avgTimeOnPage}m</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold px-3 py-1 rounded-full ${qualityColor(content.qualityScore)}`}>
                      {content.qualityScore}/10
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insight Performance */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Insight Performance</h2>
        <div className="space-y-4">
          {insightAnalytics.map((insight) => (
            <div key={insight.insightId} className="bg-white rounded-lg shadow-sm border-l-4 border-slate-300 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{insight.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${insightStatusColor(insight.status)}`}>
                      {insight.status.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Used in {insight.usageCount} pieces • {insight.successRate}% success rate
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">{insight.averageScore.toFixed(1)}</div>
                  <p className="text-xs text-slate-600">Average Score</p>
                </div>
              </div>

              {/* Strengths */}
              {insight.strengths.length > 0 && (
                <div className="mb-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-semibold text-green-900 mb-1">✓ What Works</p>
                  <ul className="text-sm text-green-800 space-y-1">
                    {insight.strengths.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {insight.weaknesses.length > 0 && (
                <div className="mb-3 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-semibold text-red-900 mb-1">✕ Needs Work</p>
                  <ul className="text-sm text-red-800 space-y-1">
                    {insight.weaknesses.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {insight.shouldRetire && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-sm font-semibold text-red-900">
                    ⚠️ Recommendation: Retire this insight. Has underperformed in multiple uses.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-blue-900 mb-3">Key Learnings</h2>
        <ul className="text-blue-900 space-y-2">
          <li>
            • <strong>Urgency framing wins:</strong> "Emergency Response Window" insight is a proven winner across
            multiple pieces
          </li>
          <li>
            • <strong>Retire weak insights:</strong> "DIY Dangers" has 0% success rate, recommend skipping in future
            content
          </li>
          <li>
            • <strong>Time investment matters:</strong> Pieces with 2+ min avg time show 2x higher quality scores
          </li>
        </ul>
      </div>
        </>
      )}
    </div>
  );
}
