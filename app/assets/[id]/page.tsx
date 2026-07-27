'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ContentAssetVersion, ContentDocument } from '@/lib/types';

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'editor' | 'review' | 'claims'>('editor');

  const [asset] = useState({
    id: params.id,
    name: 'Complete Guide to Plumbing Services',
    type: 'pillar' as const,
    status: 'draft' as const,
    versions: 1,
  });

  const [version] = useState<ContentAssetVersion>({
    id: '1',
    assetId: params.id,
    versionNumber: 1,
    bodyDocument: {
      lede: 'Understanding plumbing services helps homeowners make informed decisions about repairs and maintenance.',
      sections: [
        {
          heading: 'Types of Plumbing Services',
          paragraphs: [
            {
              $type: 'text',
              runs: [
                {
                  text: 'Professional plumbing services encompass a wide range of work, from emergency repairs to preventive maintenance. Understanding these categories helps you know what to expect when hiring a plumber.',
                },
              ],
            },
          ],
          children: [
            {
              heading: 'Emergency Services',
              paragraphs: [
                {
                  $type: 'text',
                  runs: [
                    {
                      text: 'Emergency plumbing services handle urgent issues like burst pipes, severe leaks, and complete blockages that require immediate attention.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          heading: 'Common Plumbing Problems',
          paragraphs: [
            {
              $type: 'list',
              ordered: false,
              items: [
                [{ text: 'Dripping faucets and leaks' }],
                [{ text: 'Clogged drains and pipes' }],
                [{ text: 'Water heater failures' }],
                [{ text: 'Burst or frozen pipes' }],
              ],
            },
          ],
        },
      ],
    },
    rowVersion: 1,
    createdAt: new Date().toISOString(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/assets" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block">
        ← Back to Assets
      </Link>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{asset.name}</h1>
          <p className="text-slate-600 mt-2">Type: {asset.type} | Version: {asset.versions}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 text-sm font-medium">
            Revise
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
            Approve
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 mb-8">
        {['editor', 'review', 'claims'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 font-medium text-sm border-b-2 ${
              activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            {tab === 'editor' && 'Content'}
            {tab === 'review' && 'Editorial Review'}
            {tab === 'claims' && 'Claims & Evidence'}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'editor' && (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-sm max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Lede</h2>
              <p className="text-slate-700 text-lg leading-relaxed">{version.bodyDocument.lede}</p>
            </div>

            {version.bodyDocument.sections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.heading}</h2>

                {section.paragraphs.map((para, pIndex) => (
                  <div key={pIndex} className="mb-6">
                    {para.$type === 'text' ? (
                      <p className="text-slate-700 leading-relaxed">
                        {para.runs.map((run, rIndex) => (
                          <span
                            key={rIndex}
                            className={`${run.bold ? 'font-bold' : ''} ${run.italic ? 'italic' : ''}`}
                          >
                            {run.linkUrl ? <a href={run.linkUrl} className="text-blue-600 hover:underline">{run.text}</a> : run.text}
                          </span>
                        ))}
                      </p>
                    ) : (
                      <ul className={`space-y-2 ${para.ordered ? 'list-decimal' : 'list-disc'} list-inside text-slate-700`}>
                        {para.items.map((item, iIndex) => (
                          <li key={iIndex}>
                            {item.map((run, rIndex) => (
                              <span key={rIndex} className={`${run.bold ? 'font-bold' : ''} ${run.italic ? 'italic' : ''}`}>
                                {run.text}
                              </span>
                            ))}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {section.children && section.children.length > 0 && (
                  <div className="ml-6 mt-8">
                    {section.children.map((child, cIndex) => (
                      <div key={cIndex} className="mb-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">{child.heading}</h3>
                        {child.paragraphs.map((para, pIndex) => (
                          <div key={pIndex}>
                            {para.$type === 'text' ? (
                              <p className="text-slate-700 leading-relaxed mb-4">
                                {para.runs.map((run, rIndex) => (
                                  <span key={rIndex}>{run.text}</span>
                                ))}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editorial Review Tab */}
      {activeTab === 'review' && (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded">
              <h3 className="font-semibold text-yellow-900">Brand Voice Fit</h3>
              <p className="text-yellow-800 mt-2">
                The tone in "Common Plumbing Problems" section could be more conversational to match your brand voice. Consider rephrasing technical terms for clarity.
              </p>
            </div>
            <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded">
              <h3 className="font-semibold text-green-900">Evidence Traceability</h3>
              <p className="text-green-800 mt-2">
                All claims in this asset are properly linked to verified evidence sources. No unsupported claims detected.
              </p>
            </div>
            <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded">
              <h3 className="font-semibold text-blue-900">Reader Empathy</h3>
              <p className="text-blue-800 mt-2">
                Strong opening with the "Lede" section. Consider adding more specific cost information in the "Common Problems" section.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Claims Tab */}
      {activeTab === 'claims' && (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="font-semibold text-lg text-slate-900 mb-4">Extracted Claims</h3>
          <div className="space-y-4">
            <div className="border border-green-300 bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-900">Emergency plumbing services handle urgent issues like burst pipes, severe leaks, and complete blockages</p>
                  <p className="text-sm text-slate-600 mt-2">Status: Verified Evidence</p>
                </div>
                <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded">Supported</span>
              </div>
            </div>
            <div className="border border-yellow-300 bg-yellow-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-900">Professional plumbing services encompass a wide range of work</p>
                  <p className="text-sm text-slate-600 mt-2">Status: Market Language Observed</p>
                </div>
                <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded">Marginal</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
