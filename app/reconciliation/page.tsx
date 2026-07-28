'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReconciliationProposal } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { useUser } from '@/lib/context/UserContext';

export default function ReconciliationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [proposals, setProposals] = useState<ReconciliationProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientId = user?.clientId;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (clientId) {
      fetchProposals();
    }
  }, [clientId, authLoading, user, router]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<ReconciliationProposal[]>(
        `/content-writer/v3/reconciliation?clientId=${clientId}`
      );
      setProposals(data || []);
    } catch (err) {
      console.error('Failed to fetch proposals:', err);
      setError('Failed to load reconciliation proposals. Please try again later.');
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  const mockProposals = [
    {
      id: '1',
      researchRunId: '1',
      proposalType: 'new-pain-point',
      proposedData: {
        name: 'Frozen Pipe Risk',
        description: 'Pipes that freeze in winter months causing ruptures',
        readerSymptom: 'No water flow in winter cold snaps',
        costOfInaction: '$1000-5000+ emergency burst pipe repair',
        offerTerminology: 'Pipe insulation and freeze protection',
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      researchRunId: '1',
      proposalType: 'update-pain-point',
      painPointId: '2',
      proposedData: {
        costOfInaction: '$500-4000 replacement delay + potential damage',
        confidence: 92,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      researchRunId: '1',
      proposalType: 'new-evidence-link',
      painPointId: '1',
      proposedData: {
        statement: 'Average emergency plumbing calls happen at 2 AM',
        source: 'Industry report: Emergency Services Analysis 2025',
        supportLevel: 'ObservedMarketLanguage',
      },
      status: 'approved' as const,
      reviewedBy: 'user-123',
      reviewedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  const handleApprove = (id: string) => {
    setProposals(
      proposals.map((p) =>
        p.id === id
          ? { ...p, status: 'approved' as const, reviewedBy: 'current-user', reviewedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const handleDismiss = (id: string) => {
    setProposals(
      proposals.map((p) =>
        p.id === id
          ? { ...p, status: 'dismissed' as const, reviewedBy: 'current-user', reviewedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const pendingProposals = proposals.filter((p) => p.status === 'pending');
  const reviewedProposals = proposals.filter((p) => p.status !== 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Reconciliation Review</h1>
        <p className="text-slate-600 mt-2">Review proposed pain point updates from research</p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 mt-4">Loading proposals...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchProposals}
            className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Pending Proposals */}
      {pendingProposals.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Pending Review ({pendingProposals.length})
          </h2>
          <div className="space-y-4">
            {pendingProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-yellow-200 bg-yellow-50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm font-semibold text-yellow-900 uppercase tracking-wide">
                      {proposal.proposalType === 'new-pain-point' && '✨ New Pain Point'}
                      {proposal.proposalType === 'update-pain-point' && '🔄 Update Pain Point'}
                      {proposal.proposalType === 'new-evidence-link' && '📎 New Evidence Link'}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
                    Pending
                  </span>
                </div>

                <div className="mb-6 bg-white rounded p-4 border border-yellow-100">
                  {proposal.proposalType === 'new-pain-point' && (
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-slate-600">Name</div>
                        <div className="text-slate-900 font-semibold">
                          {String(proposal.proposedData.name)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-600">Description</div>
                        <div className="text-slate-800">{String(proposal.proposedData.description)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-slate-600">Reader Symptom</div>
                          <div className="text-slate-800">{String(proposal.proposedData.readerSymptom)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-slate-600">Cost of Inaction</div>
                          <div className="text-slate-800">{String(proposal.proposedData.costOfInaction)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {proposal.proposalType === 'update-pain-point' && (
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-slate-600">Proposed Changes</div>
                      {Object.entries(proposal.proposedData).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium text-slate-700">{key}:</span>
                          <span className="text-slate-800 ml-2">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {proposal.proposalType === 'new-evidence-link' && (
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-slate-600">Statement</div>
                        <div className="text-slate-800">{String(proposal.proposedData.statement)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-slate-600">Source</div>
                          <div className="text-slate-800">{String(proposal.proposedData.source)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-slate-600">Support Level</div>
                          <div className="text-slate-800">{String(proposal.proposedData.supportLevel)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(proposal.id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleDismiss(proposal.id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
                  >
                    ✗ Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed Proposals */}
      {reviewedProposals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Review History ({reviewedProposals.length})
          </h2>
          <div className="space-y-3">
            {reviewedProposals.map((proposal) => (
              <div
                key={proposal.id}
                className={`rounded-lg p-4 border ${
                  proposal.status === 'approved'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div
                      className={`text-sm font-semibold uppercase tracking-wide ${
                        proposal.status === 'approved'
                          ? 'text-green-900'
                          : 'text-red-900'
                      }`}
                    >
                      {proposal.proposalType === 'new-pain-point' && '✨ New Pain Point'}
                      {proposal.proposalType === 'update-pain-point' && '🔄 Update Pain Point'}
                      {proposal.proposalType === 'new-evidence-link' && '📎 New Evidence Link'}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      proposal.status === 'approved'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {proposal.status === 'approved' ? '✓ Approved' : '✗ Dismissed'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Reviewed by {proposal.reviewedBy} on{' '}
                  {new Date(proposal.reviewedAt!).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

          {proposals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No proposals to review</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
