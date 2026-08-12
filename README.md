# India Venture Index (IND-V) — clone

A market-cap weighted index of VC-backed Indian companies listed on NSE,
benchmarked against the Nifty 50. Built with Next.js + Tailwind + Recharts.

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000. Since this fetches live data from Yahoo
Finance's unofficial API, you need normal internet access (this won't work
in network-restricted sandboxes).

## Deploy (free)

1. Push this folder to a new GitHub repository.
2. Go to https://vercel.com, sign in with GitHub, click "Add New Project",
   and import the repo. Vercel auto-detects Next.js — just click Deploy.
3. Done. You'll get a live `.vercel.app` URL, same as the original site.

## How it works

- `lib/companies.ts` — the list of ~18 real VC-backed companies (edit this
  to add/remove companies).
- `lib/yahoo.ts` — fetches live quotes + historical prices from Yahoo
  Finance's unofficial endpoint (no API key needed, but not officially
  supported — see comments in the file).
- `lib/index-engine.ts` — the actual index math: market-cap weighting +
  "same-store growth" chain-linking, so new listings don't spike the index.
- `app/page.tsx`, `app/companies/page.tsx`, `app/methodology/page.tsx` —
  the three pages.

## Known simplifications (read `app/methodology/page.tsx`)

- Historical share counts are approximated (held constant at today's count)
  since free historical shares-outstanding data isn't available. Real share
  counts shift with ESOPs, buybacks, bonus issues.
- If Yahoo's endpoint ever blocks or rate-limits you, swap the two
  functions in `lib/yahoo.ts` for a paid provider (Twelve Data, Financial
  Modeling Prep, etc.) — nothing else in the app needs to change.

## Next steps to make it more "exact"

- Add more companies to `lib/companies.ts`.
- Track real historical share-count changes for more accurate history.
- Add company detail pages (click a row in Companies).
- Add a date-range selector on the chart (1M/6M/1Y/5Y).
