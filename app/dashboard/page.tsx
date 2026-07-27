'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ContentCampaign, Workspace, Client } from '@/lib/types';

export default function Dashboard() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [campaigns, setCampaigns] = useState<ContentCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Phase 0: Mock data for development
    // In production, these will be fetched from the API
    const mockWorkspace: Workspace = {
      id: '1',
      name: 'Demo Workspace',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockClients: Client[] = [
      {
        id: '1',
        workspaceId: '1',
        name: 'ACME Corp',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const mockCampaigns: ContentCampaign[] = [
      {
        id: '1',
        clientId: '1',
        name: 'Home Services SEO',
        keyword: 'plumbing services',
        status: 'draft',
        profileVersionId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rowVersion: 1,
      },
    ];

    setWorkspace(mockWorkspace);
    setClients(mockClients);
    setCampaigns(mockCampaigns);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {workspace?.name}
        </h1>
        <p className="text-slate-600">
          Manage campaigns, research, and content generation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="text-sm text-slate-600">Total Clients</div>
          <div className="text-3xl font-bold text-slate-900">{clients.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="text-sm text-slate-600">Active Campaigns</div>
          <div className="text-3xl font-bold text-slate-900">
            {campaigns.filter((c) => c.status !== 'archived').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="text-sm text-slate-600">In Progress</div>
          <div className="text-3xl font-bold text-slate-900">
            {campaigns.filter((c) => ['research', 'drafting'].includes(c.status)).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="text-sm text-slate-600">Published</div>
          <div className="text-3xl font-bold text-slate-900">
            {campaigns.filter((c) => c.status === 'published').length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Recent Campaigns</h2>
          <Link
            href="/campaigns/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            New Campaign
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Keyword</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{campaign.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {clients.find((c) => c.id === campaign.clientId)?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{campaign.keyword}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : campaign.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
