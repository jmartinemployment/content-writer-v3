'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PainPoint } from '@/lib/types';

export default function PainPointsPage() {
  const [painPoints] = useState<PainPoint[]>([
    {
      id: '1',
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
    },
    {
      id: '2',
      clientId: '1',
      name: 'Water Heater Failure',
      description: 'Old or broken water heaters need replacement decision',
      readerSymptom: 'No hot water or inconsistent temperature',
      costOfInaction: '$500-3000 replacement delay + daily inconvenience',
      offerTerminology: 'Water heater replacement and installation',
      objections: ['Repair vs replace confusion', 'Cost uncertainty', 'Unsure about size needed'],
      confidence: 87,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      clientId: '1',
      name: 'Slow Drain Issues',
      description: 'Gradual drainage problems indicating clogs',
      readerSymptom: 'Water drains slowly or backs up',
      costOfInaction: '$50-300 drain cleaning or $1000+ pipe damage',
      offerTerminology: 'Drain cleaning and clog removal',
      objections: ['Can try DIY plunger/drain cleaner first', 'Cost for simple issue seems high'],
      confidence: 72,
      staleSince: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const confidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 75) return 'bg-blue-100 text-blue-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Pain Points</h1>
        <p className="text-slate-600 mt-2">Client pain points with evidence-linked research</p>
      </div>

      <div className="space-y-6">
        {painPoints.map((pp) => (
          <Link
            key={pp.id}
            href={`/pain-points/${pp.id}`}
            className="bg-white rounded-lg shadow-sm p-8 border border-slate-200 hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600">{pp.name}</h3>
                <p className="text-slate-600 mt-2">{pp.description}</p>
              </div>
              <div className="flex gap-3 ml-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${confidenceColor(pp.confidence)}`}>
                  {pp.confidence}% confidence
                </span>
                {pp.staleSince && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 whitespace-nowrap">
                    ⚠️ Stale
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Reader Symptom</div>
                <p className="text-slate-800">{pp.readerSymptom}</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Cost of Inaction</div>
                <p className="text-slate-800">{pp.costOfInaction}</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Service Offering</div>
                <p className="text-slate-800">{pp.offerTerminology}</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-600 mb-2">Common Objections</div>
                <ul className="list-disc list-inside text-slate-800 space-y-1">
                  {pp.objections.slice(0, 2).map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                  {pp.objections.length > 2 && <li className="text-slate-600">+{pp.objections.length - 2} more</li>}
                </ul>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View Evidence
              </button>
              <button className="text-slate-600 hover:text-slate-900 font-medium">
                Edit
              </button>
            </div>
          </Link>
        ))}
      </div>

      {painPoints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No pain points yet</p>
          <p className="text-slate-500 mt-2">Run research to discover client pain points</p>
        </div>
      )}
    </div>
  );
}
