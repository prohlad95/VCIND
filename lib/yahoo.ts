// Thin wrappers around Yahoo Finance's UNOFFICIAL endpoints.
//
// These are not a documented/supported public API. They're widely used by
// hobby projects because there's no free official real-time NSE/BSE API,
// but Yahoo could change or block them without notice. If this ever breaks,
// swap the implementation of `getQuotes` / `getHistory` for a paid provider
// (e.g. Twelve Data, Financial Modeling Prep) — nothing else in the app
// needs to change.

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export interface Quote {
  symbol: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketPreviousClose?: number;
  regularMarketChangePercent?: number;
  marketCap?: number;
}

// Batch quote lookup: price, % change, market cap for many tickers in one call.
export async function getQuotes(symbols: string[]): Promise<Record<string, Quote>> {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(
    symbols.join(",")
  )}`;

  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    next: { revalidate: 300 }, // cache 5 minutes
  });

  if (!res.ok) {
    throw new Error(`Yahoo quote request failed: ${res.status}`);
  }

  const data = await res.json();
  const results: Quote[] = data?.quoteResponse?.result ?? [];

  const bySymbol: Record<string, Quote> = {};
  for (const q of results) bySymbol[q.symbol] = q;
  return bySymbol;
}

export interface HistoryPoint {
  date: string; // YYYY-MM-DD
  close: number;
}

// Daily historical closes for one symbol.
export async function getHistory(symbol: string, range = "5y"): Promise<HistoryPoint[]> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?range=${range}&interval=1d`;

  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    next: { revalidate: 3600 }, // cache 1 hour, this data doesn't need to be fresher
  });

  if (!res.ok) {
    throw new Error(`Yahoo chart request failed for ${symbol}: ${res.status}`);
  }

  const data = await res.json();
  const result = data?.chart?.result?.[0];
  if (!result) return [];

  const timestamps: number[] = result.timestamp ?? [];
  const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];

  const points: HistoryPoint[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const close = closes[i];
    if (close == null) continue;
    const date = new Date(timestamps[i] * 1000).toISOString().slice(0, 10);
    points.push({ date, close });
  }
  return points;
}
