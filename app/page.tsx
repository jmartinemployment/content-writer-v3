import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Content Writer V3
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Evidence-bounded, human-approved content generation platform. Build factual, trustworthy content with AI-powered research and editorial review.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Open Dashboard
            </Link>
            <Link
              href="/campaigns"
              className="px-8 py-3 bg-slate-200 text-slate-900 rounded-lg font-medium hover:bg-slate-300 transition"
            >
              View Campaigns
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-3xl mb-4">🔬</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Research</h3>
            <p className="text-slate-600">
              Deep research into client pain points and market evidence with human-controlled depth budgets.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-3xl mb-4">✍️</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Draft</h3>
            <p className="text-slate-600">
              AI-powered drafting bounded by research evidence, with claim ledger traceability.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-3xl mb-4">👁️</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Review</h3>
            <p className="text-slate-600">
              Editorial review with human-in-the-loop approval for every step of the pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
