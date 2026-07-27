'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ContentCampaign, ContentAsset } from '@/lib/types';

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
  const [campaign] = useState<ContentCampaign>({
    id: params.id,
    clientId: '1',
    name: 'Home Services SEO - Plumbing',
    keyword: 'plumbing services near me',
    status: 'draft',
    profileVersionId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rowVersion: 1,
  });

  const [assets] = useState<ContentAsset[]>([
    {
      id: '1',
      campaignId: params.id,
      type: 'pillar',
      name: 'Complete Guide to Plumbing Services',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      campaignId: params.id,
      type: 'companion',
      name: 'Plumbing Repair vs Replacement',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const phases = [
    { id: 0, name: 'Research', status: 'complete', icon: '🔬' },
    { id: 1, name: 'Strategy', status: 'current', icon: '📋' },
    { id: 2, name: 'Drafting', status: 'pending', icon: '✍️' },
    { id: 3, name: 'Review', status: 'pending', icon: '👁️' },
    { id: 4, name: 'Publish', status: 'pending', icon: '🚀' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/campaigns" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block">
        ← Back to Campaigns
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{campaign.name}</h1>
            <p className="text-slate-600 mt-2">Keyword: {campaign.keyword}</p>
          </div>
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            Draft
          </span>
        </div>

        {/* Phase Progress */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Pipeline Progress</h3>
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div key={phase.id} className="flex items-center">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      phase.status === 'complete'
                        ? 'bg-green-100'
                        : phase.status === 'current'
                        ? 'bg-blue-100'
                        : 'bg-slate-100'
                    }`}
                  >
                    {phase.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Phase {phase.id}: {phase.name}</p>
                    <p className="text-xs text-slate-600">
                      {phase.status === 'complete'
                        ? 'Completed'
                        : phase.status === 'current'
                        ? 'In Progress'
                        : 'Pending'}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    phase.status === 'complete' ? 'bg-green-500' : phase.status === 'current' ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Assets */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Content Assets</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              New Asset
            </button>
          </div>
          <div className="space-y-3">
            {assets.map((asset) => (
              <Link
                key={asset.id}
                href={`/assets/${asset.id}`}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {asset.type === 'pillar' ? '📄' : '📑'} {asset.name}
                  </p>
                  <p className="text-sm text-slate-600">Type: {asset.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  asset.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {asset.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
