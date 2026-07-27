'use client';

import Link from 'next/link';
import { useState } from 'react';
import { StrategyBrief } from '@/lib/types';

export default function StrategyBriefDetailPage({ params }: { params: { id: string } }) {
  const [brief] = useState<StrategyBrief>({
    id: params.id,
    campaignId: '1',
    painPointId: '1',
    audienceProfile: 'Homeowners age 35-55 with older homes',
    buyingStage: 'research',
    angle: 'Emergency preparedness through professional help',
    callToAction: 'Schedule your inspection today',
    status: 'draft',
    rowVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/strategy-briefs" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block">
        ← Back to Briefs
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Strategy Brief</h1>
            <p className="text-slate-600">Campaign: Plumbing Services SEO</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 text-sm font-medium"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            {!isEditing && brief.status === 'draft' && (
              <>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                  Approve
                </button>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium">
                  Return to Research
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Audience Profile</label>
              <input
                type="text"
                defaultValue={brief.audienceProfile}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Buying Stage</label>
              <select defaultValue={brief.buyingStage} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="awareness">Awareness</option>
                <option value="research">Research</option>
                <option value="decision">Decision</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Content Angle</label>
              <textarea
                defaultValue={brief.angle}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Call to Action</label>
              <input
                type="text"
                defaultValue={brief.callToAction}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Save Changes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-sm font-semibold text-slate-600 mb-2">Audience Profile</div>
              <p className="text-slate-900">{brief.audienceProfile}</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-600 mb-2">Buying Stage</div>
              <p className="text-slate-900">{brief.buyingStage.charAt(0).toUpperCase() + brief.buyingStage.slice(1)}</p>
            </div>
            <div className="col-span-2">
              <div className="text-sm font-semibold text-slate-600 mb-2">Content Angle</div>
              <p className="text-slate-900">{brief.angle}</p>
            </div>
            <div className="col-span-2">
              <div className="text-sm font-semibold text-slate-600 mb-2">Call to Action</div>
              <p className="text-slate-900">{brief.callToAction}</p>
            </div>
          </div>
        )}

        {/* Evidence Links */}
        <div className="border-t border-slate-200 pt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Linked Evidence</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-slate-900">
                  Emergency plumbing services are available 24/7
                </p>
                <p className="text-sm text-slate-600 mt-1">Support Level: VerifiedExternalSource</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Linked</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-slate-900">
                  Burst pipes cost $500-2000+ in water damage
                </p>
                <p className="text-sm text-slate-600 mt-1">Support Level: VerifiedExternalSource</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Linked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
