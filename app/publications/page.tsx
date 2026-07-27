'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Publication {
  id: string;
  contentTitle: string;
  status: 'Queued' | 'Scheduled' | 'Publishing' | 'Published' | 'Failed' | 'Unpublished';
  publishedUrl?: string;
  targetPlatform: string;
  publishedAt?: string;
  scheduledPublishAt?: string;
  retryCount: number;
  failureReason?: string;
}

export default function PublicationsPage() {
  const [publications] = useState<Publication[]>([
    {
      id: '1',
      contentTitle: 'Emergency Plumbing: When Minutes Matter',
      status: 'Published',
      publishedUrl: 'https://example.com/emergency-plumbing',
      targetPlatform: 'WordPress',
      publishedAt: '2026-07-25T10:30:00Z',
      retryCount: 0,
    },
    {
      id: '2',
      contentTitle: 'Preventive Maintenance ROI',
      status: 'Scheduled',
      targetPlatform: 'WordPress',
      scheduledPublishAt: '2026-07-29T08:00:00Z',
      retryCount: 0,
    },
    {
      id: '3',
      contentTitle: 'Pipe Materials: Lifespan Guide',
      status: 'Failed',
      targetPlatform: 'WordPress',
      retryCount: 1,
      failureReason: 'WordPress API connection timeout',
    },
  ]);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'Published':
        return '✓';
      case 'Scheduled':
        return '🕐';
      case 'Queued':
        return '⏳';
      case 'Publishing':
        return '⚙️';
      case 'Failed':
        return '✕';
      case 'Unpublished':
        return '🗑️';
      default:
        return '?';
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Queued':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Unpublished':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const published = publications.filter((p) => p.status === 'Published');
  const scheduled = publications.filter((p) => p.status === 'Scheduled');
  const failed = publications.filter((p) => p.status === 'Failed');
  const queued = publications.filter((p) => p.status === 'Queued');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Publications</h1>
        <p className="text-slate-600 mt-2">Content published to live sites</p>
      </div>

      {/* Published */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Published ({published.length})</h2>
        <div className="space-y-4">
          {published.length === 0 ? (
            <p className="text-slate-600">No published content yet</p>
          ) : (
            published.map((pub) => (
              <div key={pub.id} className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{statusIcon(pub.status)}</span>
                      <h3 className="text-lg font-semibold text-slate-900">{pub.contentTitle}</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      Published on {pub.publishedAt && new Date(pub.publishedAt).toLocaleDateString()}
                    </p>
                    {pub.publishedUrl && (
                      <a href={pub.publishedUrl} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
                        View Live →
                      </a>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(pub.status)}`}>
                      {pub.status}
                    </span>
                    <p className="text-xs text-slate-600 mt-2">{pub.targetPlatform}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Scheduled */}
      {scheduled.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Scheduled ({scheduled.length})</h2>
          <div className="space-y-4">
            {scheduled.map((pub) => (
              <div key={pub.id} className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{statusIcon(pub.status)}</span>
                      <h3 className="text-lg font-semibold text-slate-900">{pub.contentTitle}</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      Scheduled for {pub.scheduledPublishAt && new Date(pub.scheduledPublishAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(pub.status)}`}>
                    {pub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queued */}
      {queued.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Queued ({queued.length})</h2>
          <div className="space-y-4">
            {queued.map((pub) => (
              <div key={pub.id} className="bg-white rounded-lg shadow-sm border-l-4 border-yellow-500 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{statusIcon(pub.status)}</span>
                      <h3 className="text-lg font-semibold text-slate-900">{pub.contentTitle}</h3>
                    </div>
                    <p className="text-sm text-slate-600">Awaiting publication</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(pub.status)}`}>
                    {pub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Failed */}
      {failed.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Failed ({failed.length})</h2>
          <div className="space-y-4">
            {failed.map((pub) => (
              <div key={pub.id} className="bg-white rounded-lg shadow-sm border-l-4 border-red-500 p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{statusIcon(pub.status)}</span>
                      <h3 className="text-lg font-semibold text-slate-900">{pub.contentTitle}</h3>
                    </div>
                    {pub.failureReason && (
                      <p className="text-sm text-red-700 bg-red-50 p-2 rounded mt-2">
                        {pub.failureReason}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(pub.status)}`}>
                    {pub.status}
                  </span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                  🔄 Retry Publishing
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
