'use client';

import Link from 'next/link';
import { PainPoint, ResearchEvidence, ResearchSource } from '@/lib/types';

export default function PainPointDetailPage({ params }: { params: { id: string } }) {
  const painPoint: PainPoint = {
    id: params.id,
    clientId: '1',
    name: 'Emergency Plumbing Crisis',
    description: 'Burst pipes and sewage backups require immediate attention',
    readerSymptom: 'Water flooding from pipes or fixture damage',
    costOfInaction: '$500-2000+ water damage repair costs within hours',
    offerTerminology: '24/7 emergency plumbing response',
    objections: ['Too expensive', 'Can DIY temporary fix', 'Unsure if real emergency'],
    confidence: 95,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sources: ResearchSource[] = [
    {
      id: '1',
      researchRunId: '1',
      sourceType: 'AgentDiscoveredExternal',
      url: 'https://www.homeadvisor.com/guide/emergency-plumbing',
      title: 'Emergency Plumbing Guide - HomeAdvisor',
      description: 'Comprehensive guide on emergency plumbing situations and costs',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      researchRunId: '1',
      sourceType: 'OperatorUploaded',
      title: 'Industry Average Costs - Plumbing Association Report 2025',
      description: 'Internal document with verified industry benchmarks',
      createdAt: new Date().toISOString(),
    },
  ];

  const evidence: ResearchEvidence[] = [
    {
      id: '1',
      researchSourceId: '1',
      statement:
        'Burst pipes can cause $500-2000 in water damage within the first few hours',
      supportLevel: 'VerifiedExternalSource',
      approvedForClaim: true,
      confidence: 94,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      researchSourceId: '1',
      statement: '24/7 emergency plumbing services are the industry standard',
      supportLevel: 'ObservedMarketLanguage',
      approvedForClaim: true,
      confidence: 87,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      researchSourceId: '2',
      statement: 'Average emergency plumbing response time is 30-45 minutes',
      supportLevel: 'VerifiedClientFact',
      approvedForClaim: true,
      confidence: 98,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      researchSourceId: '1',
      statement: 'Homeowners can temporarily stop leaks with DIY methods',
      supportLevel: 'ObservedMarketLanguage',
      approvedForClaim: false,
      confidence: 72,
      createdAt: new Date().toISOString(),
    },
  ];

  const supportLevelColor = (level: string) => {
    switch (level) {
      case 'VerifiedClientFact':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'VerifiedExternalSource':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ObservedMarketLanguage':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Unsupported':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/pain-points" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block">
        ← Back to Pain Points
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">{painPoint.name}</h1>
          <p className="text-slate-600 mt-2">{painPoint.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <div className="text-sm font-semibold text-slate-600 mb-2">Reader Symptom</div>
            <p className="text-slate-800">{painPoint.readerSymptom}</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-600 mb-2">Cost of Inaction</div>
            <p className="text-slate-800">{painPoint.costOfInaction}</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-600 mb-2">Service Offering</div>
            <p className="text-slate-800">{painPoint.offerTerminology}</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-600 mb-2">Common Objections</div>
            <ul className="list-disc list-inside text-slate-800 space-y-1">
              {painPoint.objections.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-4 items-center mb-8">
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-600 mb-2">Confidence Score</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${painPoint.confidence}%` }}
                ></div>
              </div>
              <span className="font-bold text-slate-900">{painPoint.confidence}%</span>
            </div>
          </div>
        </div>

        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Edit Pain Point
        </button>
      </div>

      {/* Research Sources */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Research Sources ({sources.length})</h2>
        <div className="space-y-4">
          {sources.map((source) => (
            <div key={source.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded">
                      {source.sourceType.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <h3 className="font-semibold text-slate-900">{source.title}</h3>
                  </div>
                  {source.description && (
                    <p className="text-sm text-slate-600 mt-2">{source.description}</p>
                  )}
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                    >
                      View Source →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Links */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Linked Evidence ({evidence.length})</h2>
        <div className="space-y-4">
          {evidence.map((ev) => (
            <div
              key={ev.id}
              className={`border-l-4 rounded-lg p-4 ${supportLevelColor(ev.supportLevel)}`}
            >
              <div className="flex justify-between items-start mb-3">
                <p className="font-medium text-slate-900 flex-1">{ev.statement}</p>
                <div className="flex gap-2 ml-4">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-white bg-opacity-50">
                    {ev.supportLevel}
                  </span>
                  {ev.approvedForClaim && (
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-green-200 text-green-900">
                      ✓ Approved
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Confidence: </span>
                  <span className="text-slate-600">{ev.confidence}%</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Source: </span>
                  <span className="text-slate-600">
                    {sources.find((s) => s.id === ev.researchSourceId)?.title || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
