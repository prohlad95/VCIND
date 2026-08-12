// Real VC-backed Indian companies listed on NSE after Jan 1, 2021.
// Tickers use the .NS suffix (NSE) required by Yahoo Finance's unofficial API.
//
// IMPORTANT: Tickers occasionally change (e.g. Zomato renamed to Eternal in
// Nov 2024, ticker ETERNAL.NS). Verify tickers periodically at nseindia.com.

export interface Company {
  name: string;
  ticker: string; // Yahoo Finance symbol, e.g. "PAYTM.NS"
  sector: string;
  listedDate: string; // ISO date of NSE/BSE listing
}

export const companies: Company[] = [
  { name: "Eternal (Zomato)", ticker: "ETERNAL.NS", sector: "Food Delivery", listedDate: "2021-07-23" },
  { name: "One97 Communications (Paytm)", ticker: "PAYTM.NS", sector: "Fintech", listedDate: "2021-11-18" },
  { name: "FSN E-Commerce (Nykaa)", ticker: "NYKAA.NS", sector: "E-commerce/Beauty", listedDate: "2021-11-10" },
  { name: "PB Fintech (PolicyBazaar)", ticker: "POLICYBZR.NS", sector: "Insurtech", listedDate: "2021-11-15" },
  { name: "Delhivery", ticker: "DELHIVERY.NS", sector: "Logistics", listedDate: "2022-05-24" },
  { name: "CarTrade Tech", ticker: "CARTRADE.NS", sector: "Auto Marketplace", listedDate: "2021-08-20" },
  { name: "C.E. Info Systems (MapmyIndia)", ticker: "MAPMYINDIA.NS", sector: "Geospatial Tech", listedDate: "2021-12-21" },
  { name: "Five-Star Business Finance", ticker: "FIVESTAR.NS", sector: "NBFC", listedDate: "2022-11-21" },
  { name: "Honasa Consumer (Mamaearth)", ticker: "HONASA.NS", sector: "D2C/Beauty", listedDate: "2023-11-07" },
  { name: "Awfis Space Solutions", ticker: "AWFIS.NS", sector: "Coworking", listedDate: "2024-05-30" },
  { name: "Go Digit General Insurance", ticker: "GODIGIT.NS", sector: "Insurtech", listedDate: "2024-05-23" },
  { name: "Ola Electric Mobility", ticker: "OLAELEC.NS", sector: "EV", listedDate: "2024-08-09" },
  { name: "Brainbees Solutions (FirstCry)", ticker: "FIRSTCRY.NS", sector: "E-commerce/Baby", listedDate: "2024-08-13" },
  { name: "Unicommerce eSolutions", ticker: "UNICOMMERCE.NS", sector: "SaaS/E-commerce", listedDate: "2024-08-13" },
  { name: "Swiggy", ticker: "SWIGGY.NS", sector: "Food Delivery", listedDate: "2024-11-13" },
  { name: "ideaForge Technology", ticker: "IDEAFORGE.NS", sector: "Drones", listedDate: "2023-07-07" },
  { name: "Yatra Online", ticker: "YATRA.NS", sector: "Travel", listedDate: "2022-09-13" },
  { name: "TBO Tek", ticker: "TBOTEK.NS", sector: "Travel Tech", listedDate: "2024-05-15" },
];

// Benchmark index to compare against.
export const BENCHMARK_TICKER = "^NSEI"; // Nifty 50
