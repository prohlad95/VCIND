import { getIndexData } from "@/lib/index-engine";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const data = await getIndexData();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-2">Constituents</h1>
      <p className="text-muted mb-8">
        All {data.companyRows.length} companies currently in the India Venture Index, weighted by
        total market capitalization.
      </p>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted font-data text-xs uppercase tracking-wide">
              <th className="px-5 py-3">Company</th>
              <th className="px-5 py-3">Sector</th>
              <th className="px-5 py-3">Listed</th>
              <th className="px-5 py-3 text-right">Price (₹)</th>
              <th className="px-5 py-3 text-right">Change</th>
              <th className="px-5 py-3 text-right">Market Cap</th>
              <th className="px-5 py-3 text-right">Weight</th>
            </tr>
          </thead>
          <tbody>
            {data.companyRows.map((c) => (
              <tr key={c.ticker} className="border-b border-border last:border-0">
                <td className="px-5 py-3">
                  <div>{c.name}</div>
                  <div className="text-muted font-data text-xs">{c.ticker}</div>
                </td>
                <td className="px-5 py-3 text-muted">{c.sector}</td>
                <td className="px-5 py-3 text-muted font-data text-xs">{c.listedDate}</td>
                <td className="px-5 py-3 text-right font-data">{c.price?.toFixed(2) ?? "—"}</td>
                <td
                  className={`px-5 py-3 text-right font-data ${
                    (c.changePercent ?? 0) >= 0 ? "text-positive" : "text-negative"
                  }`}
                >
                  {c.changePercent != null
                    ? `${c.changePercent >= 0 ? "▲" : "▼"} ${Math.abs(c.changePercent).toFixed(2)}%`
                    : "—"}
                </td>
                <td className="px-5 py-3 text-right font-data">
                  {c.marketCap ? formatCrore(c.marketCap) : "—"}
                </td>
                <td className="px-5 py-3 text-right font-data">
                  {c.weightPercent != null ? `${c.weightPercent.toFixed(2)}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatCrore(rupees: number) {
  const crore = rupees / 1e7;
  return `₹${crore.toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr`;
}
