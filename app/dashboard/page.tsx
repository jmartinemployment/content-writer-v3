'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ContentCampaign, Workspace, Client } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { useUser } from '@/lib/context/UserContext';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [campaigns, setCampaigns] = useState<ContentCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const workspaceId = user?.workspaceId || '550e8400-e29b-41d4-a716-446655440001';

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchDashboardData();
    }
  }, [authLoading, user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const mockWorkspace: Workspace = {
        id: workspaceId,
        name: 'Demo Workspace',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const clientsData = await apiClient.get<Client[]>(
        `/clients?workspaceId=${workspaceId}`
      );

      // Fetch campaigns for the first client if available
      let campaignsData: ContentCampaign[] = [];
      if (clientsData && clientsData.length > 0) {
        const firstClientId = clientsData[0].id;
        campaignsData = await apiClient.get<ContentCampaign[]>(
          `/campaigns?clientId=${firstClientId}`
        ) || [];
      }

      // #region agent log
      fetch('http://127.0.0.1:7348/ingest/f9329de2-14be-4120-a838-fc1db3a1d0c6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2d6b04'},body:JSON.stringify({sessionId:'2d6b04',runId:'post-fix-h23',hypothesisId:'H23',location:'dashboard/page.tsx',message:'dashboard loaded',data:{clientCount:(clientsData||[]).length,campaignCount:(campaignsData||[]).length,workspaceId,userClientId:user?.clientId?String(user.clientId).slice(0,8):null},timestamp:Date.now()})}).catch(()=>{});
      fetch('/api/agent-debug',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'2d6b04',runId:'post-fix-h23',hypothesisId:'H23',message:'dashboard loaded',data:{clientCount:(clientsData||[]).length,campaignCount:(campaignsData||[]).length}})}).catch(()=>{});
      // #endregion

      setWorkspace(mockWorkspace);
      setClients(clientsData || []);
      setCampaigns(campaignsData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      const detail = err instanceof Error ? err.message : String(err);
      const axiosDetail = err as { response?: { status?: number } };
      setError(
        `Failed to load dashboard: ${detail}` +
          (axiosDetail.response?.status ? ` [HTTP ${axiosDetail.response.status}]` : '')
      );

      const mockWorkspace: Workspace = {
        id: workspaceId,
        name: 'Demo Workspace',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setWorkspace(mockWorkspace);
      setClients([]);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

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

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

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
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                    No campaigns yet. API connected successfully — create a client/campaign to get started.
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
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
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
