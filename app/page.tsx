import { getIndexData } from "@/lib/index-engine";
import IndexChart from "@/components/IndexChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getIndexData();
  const latest = data.series.at(-1);
  const first = data.series[0];
  const pctSinceBase = latest && first ? ((latest.indexValue - first.indexValue) / first.indexValue) * 100 : 0;

  const gainers = [...data.companyRows]
    .filter((c) => c.changePercent != null)
    .sort((a, b) => (b.changePercent ?? 0) - (a.changePercent ?? 0))
    .slice(0, 3);
  const losers = [...data.companyRows]
    .filter((c) => c.changePercent != null)
    .sort((a, b) => (a.changePercent ?? 0) - (b.changePercent ?? 0))
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-display text-4xl mb-2">India Venture Index</h1>
          <p className="text-muted max-w-xl">
            A market-cap weighted benchmark of {data.companyRows.length} VC-backed Indian companies
            listed on NSE, tracked against the Nifty 50.
          </p>
        </div>
        <div className="text-right">
          <div className="font-data text-5xl text-accent">{latest?.indexValue.toFixed(2)}</div>
          <div className={`font-data text-sm ${pctSinceBase >= 0 ? "text-positive" : "text-negative"}`}>
            {pctSinceBase >= 0 ? "▲" : "▼"} {Math.abs(pctSinceBase).toFixed(2)}% since base
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6 mb-10">
        <IndexChart series={data.series} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <MoversCard title="Top Gainers Today" rows={gainers} />
        <MoversCard title="Top Losers Today" rows={losers} />
      </div>

      <p className="text-xs text-muted font-data mt-10">
        Last updated {new Date(data.lastUpdated).toLocaleString("en-IN")}. Base value 100 on first
        trading day of available history. Index math approximates historical market cap using
        current share counts — see the Methodology page for details and caveats.
      </p>
    </div>
  );
}

function MoversCard({
  title,
  rows,
}: {
  title: string;
  rows: { name: string; ticker: string; changePercent: number | null }[];
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h2 className="font-data text-xs uppercase tracking-widest text-muted mb-4">{title}</h2>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.ticker} className="flex justify-between items-center">
            <span>{r.name}</span>
            <span
              className={`font-data text-sm ${
                (r.changePercent ?? 0) >= 0 ? "text-positive" : "text-negative"
              }`}
            >
              {(r.changePercent ?? 0) >= 0 ? "▲" : "▼"} {Math.abs(r.changePercent ?? 0).toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
