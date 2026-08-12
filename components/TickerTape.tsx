"use client";

import { useEffect, useState } from "react";
import type { CompanyRow } from "@/lib/index-engine";

export default function TickerTape() {
  const [rows, setRows] = useState<CompanyRow[] | null>(null);

  useEffect(() => {
    fetch("/api/index-data")
      .then((r) => r.json())
      .then((d) => setRows(d.companyRows ?? null))
      .catch(() => setRows(null));
  }, []);

  if (!rows || rows.length === 0) return null;

  const items = [...rows, ...rows]; // duplicate for seamless loop

  return (
    <div className="bg-surface border-b border-border overflow-hidden">
      <div className="ticker-track flex whitespace-nowrap py-2 w-max">
        {items.map((row, i) => (
          <span key={i} className="flex items-center gap-2 px-5 font-data text-xs">
            <span className="text-muted">{row.ticker.replace(".NS", "").replace("^NSEI", "NIFTY 50")}</span>
            <span>{row.price?.toFixed(2) ?? "—"}</span>
            {row.changePercent != null && (
              <span className={row.changePercent >= 0 ? "text-positive" : "text-negative"}>
                {row.changePercent >= 0 ? "▲" : "▼"} {Math.abs(row.changePercent).toFixed(2)}%
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
