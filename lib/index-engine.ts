import { companies, BENCHMARK_TICKER } from "./companies";
import { getQuotes, getHistory } from "./yahoo";

const BASE_VALUE = 100;

export interface SeriesPoint {
  date: string;
  indexValue: number;
  benchmarkValue: number | null;
}

export interface CompanyRow {
  name: string;
  ticker: string;
  sector: string;
  listedDate: string;
  price: number | null;
  changePercent: number | null;
  marketCap: number | null;
  weightPercent: number | null;
}

export interface IndexData {
  series: SeriesPoint[];
  companyRows: CompanyRow[];
  lastUpdated: string;
}

/**
 * Builds the daily index series using "same-store growth" chain-linking:
 * a newly listed company's market cap is added to the total, but its
 * month-one growth is excluded from the index move. Only once a company
 * has been listed for 30+ days does its day-to-day growth start
 * contributing to the index.
 */
export async function getIndexData(): Promise<IndexData> {
  const tickers = companies.map((c) => c.ticker);

  // 1. Current snapshot (price, market cap, % change) for the companies table.
  const quotes = await getQuotes([...tickers, BENCHMARK_TICKER]);

  // 2. Historical daily closes for every company + the Nifty 50 benchmark.
  const histories = await Promise.all(tickers.map((t) => getHistory(t, "5y")));
  const benchmarkHistory = await getHistory(BENCHMARK_TICKER, "5y");

  // Implied share count = current market cap / current price. Approximation:
  // real share counts change over time via buybacks/ESOPs/bonus issues, but
  // Yahoo doesn't expose free historical share-count data, so we hold shares
  // constant and scale historical price by today's share count. This mirrors
  // the "minor discrepancies" caveat real index providers also disclose.
  const impliedShares: Record<string, number> = {};
  for (const c of companies) {
    const q = quotes[c.ticker];
    if (q?.marketCap && q?.regularMarketPrice) {
      impliedShares[c.ticker] = q.marketCap / q.regularMarketPrice;
    }
  }

  // Build a per-company map of date -> market cap.
  const marketCapByDate: Record<string, Map<string, number>> = {};
  companies.forEach((c, i) => {
    const shares = impliedShares[c.ticker];
    const map = new Map<string, number>();
    if (shares) {
      for (const point of histories[i]) {
        map.set(point.date, point.close * shares);
      }
    }
    marketCapByDate[c.ticker] = map;
  });

  const benchmarkByDate = new Map(benchmarkHistory.map((p) => [p.date, p.close]));

  // Master list of trading dates, driven by the benchmark's calendar.
  const dates = benchmarkHistory.map((p) => p.date).sort();

  const series: SeriesPoint[] = [];
  let indexValue = BASE_VALUE;
  let benchmarkBase: number | null = null;
  let prevIncludedCaps: Record<string, number> | null = null;

  const isEligible = (ticker: string, date: string) => {
    const company = companies.find((c) => c.ticker === ticker)!;
    const daysSinceListing =
      (new Date(date).getTime() - new Date(company.listedDate).getTime()) / 86400000;
    return daysSinceListing >= 30;
  };

  for (const date of dates) {
    // Companies eligible to be in the "same store" set as of this date.
    const eligibleToday = tickers.filter(
      (t) => isEligible(t, date) && marketCapByDate[t].has(date)
    );

    const capsToday: Record<string, number> = {};
    for (const t of eligibleToday) capsToday[t] = marketCapByDate[t].get(date)!;

    if (prevIncludedCaps) {
      // Same-store set = tickers present both yesterday and today.
      const sameStore = Object.keys(prevIncludedCaps).filter((t) => t in capsToday);
      if (sameStore.length > 0) {
        const totalPrev = sameStore.reduce((s, t) => s + prevIncludedCaps![t], 0);
        const totalToday = sameStore.reduce((s, t) => s + capsToday[t], 0);
        if (totalPrev > 0) {
          indexValue = indexValue * (totalToday / totalPrev);
        }
      }
    }

    const benchmarkClose = benchmarkByDate.get(date) ?? null;
    if (benchmarkClose && benchmarkBase === null) benchmarkBase = benchmarkClose;
    const benchmarkValue = benchmarkClose && benchmarkBase ? (benchmarkClose / benchmarkBase) * BASE_VALUE : null;

    // Only start recording once at least one company is in the index.
    if (eligibleToday.length > 0) {
      series.push({ date, indexValue: round2(indexValue), benchmarkValue: benchmarkValue ? round2(benchmarkValue) : null });
      prevIncludedCaps = capsToday;
    }
  }

  // 3. Companies table (current snapshot + weight).
  const totalMarketCap = companies.reduce((sum, c) => {
    const q = quotes[c.ticker];
    return sum + (q?.marketCap ?? 0);
  }, 0);

  const companyRows: CompanyRow[] = companies.map((c) => {
    const q = quotes[c.ticker];
    return {
      name: c.name,
      ticker: c.ticker,
      sector: c.sector,
      listedDate: c.listedDate,
      price: q?.regularMarketPrice ?? null,
      changePercent: q?.regularMarketChangePercent ?? null,
      marketCap: q?.marketCap ?? null,
      weightPercent: q?.marketCap ? round2((q.marketCap / totalMarketCap) * 100) : null,
    };
  });
  companyRows.sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));

  return {
    series,
    companyRows,
    lastUpdated: new Date().toISOString(),
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
