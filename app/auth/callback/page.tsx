import { OAuthHandler } from './oauth-handler';

export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <OAuthHandler />
        </div>
      </div>
    </div>
  );
}
