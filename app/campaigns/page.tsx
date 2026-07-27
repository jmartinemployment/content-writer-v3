'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ContentCampaign } from '@/lib/types';

export default function CampaignsPage() {
  const [campaigns] = useState<ContentCampaign[]>([
    {
      id: '1',
      clientId: '1',
      name: 'Home Services SEO - Plumbing',
      keyword: 'plumbing services near me',
      status: 'draft',
      profileVersionId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rowVersion: 1,
    },
    {
      id: '2',
      clientId: '1',
      name: 'Water Heater Replacement',
      keyword: 'water heater replacement cost',
      status: 'research',
      profileVersionId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rowVersion: 1,
    },
  ]);

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'research':
        return 'bg-blue-100 text-blue-800';
      case 'strategy':
        return 'bg-purple-100 text-purple-800';
      case 'drafting':
        return 'bg-indigo-100 text-indigo-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Campaigns</h1>
          <p className="text-slate-600 mt-2">Manage content campaigns and track progress</p>
        </div>
        <Link
          href="/campaigns/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          New Campaign
        </Link>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            href={`/campaigns/${campaign.id}`}
            className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{campaign.name}</h3>
                <p className="text-slate-600 mt-1">Keyword: {campaign.keyword}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeColor(campaign.status)}`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
            </div>
            <div className="mt-4 flex gap-6 text-sm text-slate-500">
              <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
              <span>Updated {new Date(campaign.updatedAt).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No campaigns yet</p>
          <Link
            href="/campaigns/new"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first campaign
          </Link>
        </div>
      )}
    </div>
  );
}
