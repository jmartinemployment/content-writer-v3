'use client';

import Link from 'next/link';
import { useState } from 'react';
import { StrategyBrief } from '@/lib/types';

export default function StrategyBriefsPage() {
  const [briefs] = useState<StrategyBrief[]>([
    {
      id: '1',
      campaignId: '1',
      painPointId: '1',
      audienceProfile: 'Homeowners age 35-55',
      buyingStage: 'research',
      angle: 'Emergency preparedness through professional help',
      callToAction: 'Schedule your inspection today',
      status: 'draft',
      rowVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      campaignId: '1',
      painPointId: '2',
      audienceProfile: 'Homeowners with aging infrastructure',
      buyingStage: 'decision',
      angle: 'Long-term value and reliability',
      callToAction: 'Request a free estimate',
      status: 'approved',
      rowVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

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

      {briefs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No strategy briefs yet</p>
        </div>
      )}
    </div>
  );
}
