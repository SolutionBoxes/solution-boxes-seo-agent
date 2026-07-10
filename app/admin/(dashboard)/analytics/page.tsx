import { getAnalyticsSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const summary = await getAnalyticsSummary();

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="mb-1 text-lg font-semibold text-secondary">Performance</h1>
        <p className="mb-6 text-sm text-text-muted">Usage since the assistant went live.</p>

        {!summary.connected ? (
          <div className="rounded-xl border border-border bg-background-light px-4 py-6 text-sm text-text-secondary">
            Analytics database isn&apos;t connected yet. Add{" "}
            <code className="rounded bg-background px-1">KV_REST_API_URL</code> and{" "}
            <code className="rounded bg-background px-1">KV_REST_API_TOKEN</code> to enable usage
            tracking (see <code className="rounded bg-background px-1">README.md</code>).
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Conversations" value={summary.totalSessions} />
              <StatCard label="Messages" value={summary.totalMessages} />
              <StatCard label="Messages today" value={summary.messagesToday} />
            </div>

            <h2 className="mb-2 mt-8 text-sm font-semibold text-secondary">Last 7 days</h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-background-light text-left text-text-muted">
                  <tr>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Conversations</th>
                    <th className="px-4 py-2 font-medium">Messages</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.dailyBreakdown.map((day) => (
                    <tr key={day.date} className="border-t border-border">
                      <td className="px-4 py-2 text-text-secondary">{day.date}</td>
                      <td className="px-4 py-2 text-text-secondary">{day.sessions}</td>
                      <td className="px-4 py-2 text-text-secondary">{day.messages}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-background-light px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-secondary">{value.toLocaleString()}</p>
    </div>
  );
}
