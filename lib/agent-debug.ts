/** Browser-safe debug logger → /api/agent-debug (HTTPS). Session 2d6b04. */

export function agentDebug(
  hypothesisId: string,
  location: string,
  message: string,
  data?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  const payload = {
    sessionId: '2d6b04',
    runId: 'browser',
    hypothesisId,
    location,
    message,
    data: {
      ...data,
      hostname: window.location.hostname,
      href: window.location.href.slice(0, 200),
    },
    timestamp: Date.now(),
  };
  try {
    sessionStorage.setItem('cw_v3_last_debug', JSON.stringify(payload));
  } catch {
    /* ignore */
  }
  fetch('/api/agent-debug', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
