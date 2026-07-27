'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Insight {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  whatPeopleGetWrong: string;
  difficulty: number; // 1-10
  importance: number; // 1-10
  rankScore: number;
  orderIndex: number;
  includeInOutline: boolean;
  reasonForSkipping?: string;
}

export default function InsightsPage() {
  const [insights] = useState<Insight[]>([
    {
      id: '1',
      title: 'Emergency Response Window is Hours, Not Days',
      description: 'Once a pipe bursts, you have 2-4 hours before water damage becomes catastrophic.',
      whyItMatters: 'This urgency justifies the premium price of emergency service.',
      whatPeopleGetWrong: 'They think they can DIY a temporary fix and call a plumber during business hours.',
      difficulty: 7,
      importance: 9,
      rankScore: 8.2,
      orderIndex: 1,
      includeInOutline: true,
    },
    {
      id: '2',
      title: 'Preventive Maintenance ROI is 10:1',
      description: 'One $500 inspection prevents $5000+ in water damage.',
      whyItMatters: 'Shifts conversation from cost to investment.',
      whatPeopleGetWrong: 'They see maintenance as an expense, not insurance.',
      difficulty: 6,
      importance: 8,
      rankScore: 7.6,
      orderIndex: 2,
      includeInOutline: true,
    },
    {
      id: '3',
      title: 'Copper vs PVC vs PEX: Lifespan Determines Your Decision',
      description: 'Not all pipes are created equal, and mixing them creates problems.',
      whyItMatters: 'The right material choice prevents 20-year regret.',
      whatPeopleGetWrong: 'They think all pipes last forever.',
      difficulty: 8,
      importance: 7,
      rankScore: 7.4,
      orderIndex: 3,
      includeInOutline: true,
    },
    {
      id: '5',
      title: 'DIY Drain Cleaning Products Destroy Pipes',
      description: 'Chemical drain cleaners corrode pipes from inside.',
      whyItMatters: 'Explains why professional cleaning costs less than the damage.',
      whatPeopleGetWrong: 'They think Drano is free and harmless.',
      difficulty: 4,
      importance: 4,
      rankScore: 4.0,
      orderIndex: 0,
      includeInOutline: false,
      reasonForSkipping: 'Too niche; only relevant to small segment.',
    },
  ]);

  const includedInsights = insights.filter((i) => i.includeInOutline).sort((a, b) => a.orderIndex - b.orderIndex);
  const skippedInsights = insights.filter((i) => !i.includeInOutline);

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

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Included in Content ({includedInsights.length})</h2>
        <div className="space-y-4">
          {includedInsights.map((insight) => (
            <div key={insight.id} className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-blue-600">Section {insight.orderIndex}</span>
                    <h3 className="text-lg font-semibold text-slate-900">{insight.title}</h3>
                  </div>
                  <p className="text-slate-700 mb-3">{insight.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-1">WHY IT MATTERS</div>
                  <p className="text-sm text-slate-700">{insight.whyItMatters}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-1">WHAT PEOPLE GET WRONG</div>
                  <p className="text-sm text-slate-700">{insight.whatPeopleGetWrong}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${difficultyColor(insight.difficulty)}`}>
                  Difficulty: {insight.difficulty}/10
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${importanceColor(insight.importance)}`}>
                  Importance: {insight.importance}/10
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-800">
                  Rank Score: {insight.rankScore.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {skippedInsights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Skipped ({skippedInsights.length})</h2>
          <div className="space-y-3">
            {skippedInsights.map((insight) => (
              <div key={insight.id} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-700">{insight.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{insight.reasonForSkipping}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-200 text-slate-800 whitespace-nowrap ml-4">
                    Skipped
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
