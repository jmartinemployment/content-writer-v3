'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Comment {
  id: string;
  section: string;
  type: 'Factual' | 'Tone' | 'Clarity' | 'Structure' | 'CTA' | 'Evidence' | 'Offering' | 'Competitive';
  severity: 'Blocker' | 'Major' | 'Minor' | 'Suggestion';
  text: string;
  resolved: boolean;
}

interface ReviewDetail {
  id: string;
  status: string;
  draftContent: string;
  warnings: string[];
  recommendations: string[];
  comments: Comment[];
  accuracyScore: number;
  strengthScore: number;
  alignmentScore: number;
  editorSummary: string;
}

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const [review] = useState<ReviewDetail>({
    id: params.id,
    status: 'Pending',
    draftContent: `# Emergency Plumbing: Strategies for When Minutes Matter

## Introduction
When a pipe bursts or a toilet overflows at midnight, homeowners don't have time for a scheduled appointment. Emergency plumbing services exist precisely for these moments—but most people don't understand when they actually need them or how to choose a provider under pressure.

## Why Emergency Response Windows Are Critical

Once a pipe bursts, you don't have days to fix it. The reality is stark: a burst pipe can flood a 2,000 sq ft home with thousands of gallons in just 2-4 hours. That's not an exaggeration—it's the difference between a $500 emergency call and a $15,000 water damage claim.

What homeowners get wrong is thinking they can DIY a temporary fix and call during business hours. But temporary fixes fail, and water damage compounds exponentially. The first 4 hours are the critical window.

## How Professional Assessment Prevents Catastrophic Damage

This is where the real value emerges. A professional emergency plumber doesn't just stop the leak—they assess what caused it, whether your system is at risk for cascading failures, and what your options are.

Most homeowners see this as pure cost. But it's actually insurance against $10,000+ repairs that might not show up for weeks.

## Next Steps

If you're facing a plumbing emergency, don't wait. Call our emergency line at [number]. We respond within 2 hours guaranteed, and our first consultation is complimentary.`,
    warnings: [
      'Possible redundancy with existing cornerstone: "Emergency Plumbing Services" (/articles/emergency-plumbing)',
    ],
    recommendations: [
      'Consider linking to cornerstone content on Preventive Maintenance: https://example.com/preventive-maintenance',
      'Audience is very broad — consider targeting specific segment from: Homeowners 35-55, Property Managers',
    ],
    comments: [
      {
        id: '1',
        section: 'Why Emergency Response Windows Are Critical',
        type: 'Factual',
        severity: 'Major',
        text: 'The "2-4 hours before catastrophic damage" claim needs a source. Is this universally true or dependent on water volume/type of leak?',
        resolved: false,
      },
      {
        id: '2',
        section: 'How Professional Assessment Prevents Catastrophic Damage',
        type: 'Tone',
        severity: 'Minor',
        text: 'Love the "$10,000+ repairs" framing—reframes as insurance. But feel the "insurance" language might be clearer if we explicitly say it.',
        resolved: false,
      },
    ],
    accuracyScore: 0,
    strengthScore: 0,
    alignmentScore: 0,
    editorSummary: '',
  });

  const [scores, setScores] = useState({
    accuracy: review.accuracyScore,
    strength: review.strengthScore,
    alignment: review.alignmentScore,
  });

  const [newComment, setNewComment] = useState({
    section: '',
    type: 'Factual' as const,
    severity: 'Minor' as const,
    text: '',
  });

  const blockingComments = review.comments.filter(
    (c) => c.severity === 'Blocker' && !c.resolved
  );

  const commentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Factual: 'bg-red-100 text-red-800',
      Tone: 'bg-purple-100 text-purple-800',
      Clarity: 'bg-blue-100 text-blue-800',
      Structure: 'bg-indigo-100 text-indigo-800',
      CTA: 'bg-green-100 text-green-800',
      Evidence: 'bg-orange-100 text-orange-800',
      Offering: 'bg-pink-100 text-pink-800',
      Competitive: 'bg-cyan-100 text-cyan-800',
    };
    return colors[type] || 'bg-slate-100 text-slate-800';
  };

  const severityColor = (severity: string) => {
    const colors: Record<string, string> = {
      Blocker: 'border-red-500 bg-red-50',
      Major: 'border-orange-500 bg-orange-50',
      Minor: 'border-yellow-500 bg-yellow-50',
      Suggestion: 'border-blue-500 bg-blue-50',
    };
    return colors[severity] || 'border-slate-300 bg-slate-50';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/reviews" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
        ← Back to Reviews
      </Link>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Draft Content Review</h1>

            {/* Warnings */}
            {review.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Validation Warnings</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {review.warnings.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {review.recommendations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Recommendations</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {review.recommendations.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Draft Content */}
            <div className="prose max-w-none mb-8">
              <div
                className="whitespace-pre-wrap text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: review.draftContent }}
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Editorial Comments ({review.comments.length})</h2>

            {blockingComments.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 font-semibold">
                  ⛔ {blockingComments.length} unresolved blocker(s) must be resolved before approval
                </p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              {review.comments.map((comment) => (
                <div key={comment.id} className={`border-l-4 rounded-lg p-4 ${severityColor(comment.severity)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${commentTypeColor(comment.type)}`}>
                        {comment.type}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          comment.severity === 'Blocker'
                            ? 'bg-red-200 text-red-900'
                            : comment.severity === 'Major'
                              ? 'bg-orange-200 text-orange-900'
                              : comment.severity === 'Minor'
                                ? 'bg-yellow-200 text-yellow-900'
                                : 'bg-blue-200 text-blue-900'
                        }`}
                      >
                        {comment.severity}
                      </span>
                    </div>
                    {comment.resolved && (
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-green-200 text-green-900">
                        ✓ Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">"{comment.section}"</p>
                  <p className="text-sm text-slate-700">{comment.text}</p>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Comment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">Section/Heading</label>
                  <input
                    type="text"
                    value={newComment.section}
                    onChange={(e) => setNewComment({ ...newComment, section: e.target.value })}
                    placeholder="e.g., 'Why Emergency Response Matters'"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1">Type</label>
                    <select
                      value={newComment.type}
                      onChange={(e) =>
                        setNewComment({ ...newComment, type: e.target.value as typeof newComment.type })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option>Factual</option>
                      <option>Tone</option>
                      <option>Clarity</option>
                      <option>Structure</option>
                      <option>CTA</option>
                      <option>Evidence</option>
                      <option>Offering</option>
                      <option>Competitive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1">Severity</label>
                    <select
                      value={newComment.severity}
                      onChange={(e) =>
                        setNewComment({ ...newComment, severity: e.target.value as typeof newComment.severity })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option>Blocker</option>
                      <option>Major</option>
                      <option>Minor</option>
                      <option>Suggestion</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">Comment</label>
                  <textarea
                    value={newComment.text}
                    onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                    placeholder="Detailed feedback..."
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Scoring & Actions */}
        <div>
          {/* Scores */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quality Scores</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Accuracy (1-10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={scores.accuracy}
                  onChange={(e) => setScores({ ...scores, accuracy: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <p className="text-xs text-slate-600 mt-1">How well fact-checked & supported?</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Strength (1-10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={scores.strength}
                  onChange={(e) => setScores({ ...scores, strength: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <p className="text-xs text-slate-600 mt-1">How compelling & differentiated?</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Alignment (1-10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={scores.alignment}
                  onChange={(e) => setScores({ ...scores, alignment: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <p className="text-xs text-slate-600 mt-1">How well positioned & offering-aligned?</p>
              </div>
            </div>
          </div>

          {/* Editor Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Editor Summary</h2>
            <textarea
              placeholder="Overall assessment..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              disabled={blockingComments.length > 0}
              className={`w-full px-4 py-2 rounded-lg font-semibold text-white ${
                blockingComments.length > 0
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              ✓ Approve for Publishing
            </button>
            <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700">
              🔄 Request Changes
            </button>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">
              ✕ Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
