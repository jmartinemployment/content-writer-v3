import { NextRequest, NextResponse } from 'next/server';

/** Temporary debug sink (session 2d6b04). Remove after verification. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(
      '[agent-debug]',
      JSON.stringify({
        sessionId: '2d6b04',
        ...body,
        receivedAt: new Date().toISOString(),
        origin: req.headers.get('origin'),
      })
    );
  } catch (err) {
    console.log('[agent-debug] parse-failed', String(err));
  }
  return NextResponse.json({ ok: true });
}
