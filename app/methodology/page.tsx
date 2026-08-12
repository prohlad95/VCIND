export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">
      <div>
        <h1 className="font-display text-4xl mb-3">Methodology</h1>
        <p className="text-muted">How the India Venture Index (IND-V) is built and calculated.</p>
      </div>

      <Section title="What it tracks">
        <p>
          IND-V is a market-cap weighted index of Indian venture-backed companies that have gone
          public on the NSE since January 1, 2021. It exists to answer one question: how has this
          generation of startups performed as a group, once the public market started pricing
          them?
        </p>
      </Section>

      <Section title="Universe selection">
        <p>
          A company enters the index if it was venture-funded before its IPO and listed on NSE
          after the base date. The current roster and each company&apos;s live weight are on the{" "}
          <a href="/companies" className="text-accent hover:underline">
            Companies
          </a>{" "}
          page.
        </p>
      </Section>

      <Section title="Weighting">
        <p>
          Companies are weighted by <strong>total market capitalization</strong> (price × total
          shares outstanding), not free-float. That&apos;s a deliberate difference from indices
          like the Nifty 50 — it keeps founder and promoter holdings in the picture, since the
          point here is the value created, not just the tradable float.
        </p>
      </Section>

      <Section title="Same-store growth (chain-linking)">
        <p>
          A new listing shouldn&apos;t make the index jump on day one just because a new company
          showed up with a large market cap — that would be measuring new supply, not performance.
          So a newly listed company&apos;s market cap is added to the total immediately, but its
          own price movement only starts contributing to the index&apos;s daily return once it has
          been listed for 30+ days. Every day&apos;s change is calculated only from companies that
          were already &quot;in the comparison&quot; the day before, then chained together into a
          continuous series.
        </p>
      </Section>

      <Section title="Data & limitations">
        <p>
          Prices and market caps come from Yahoo Finance&apos;s public (unofficial) endpoints.
          Historical market caps are approximated by holding each company&apos;s current share
          count constant and applying it to historical prices — real share counts shift over time
          from ESOPs, buybacks, and bonus issues, so this introduces small drift versus a
          &quot;true&quot; index that tracks share count changes day by day. That&apos;s a known
          simplification worth fixing if you want this to be genuinely rigorous — the next step
          would be sourcing historical shares-outstanding data and adjusting for each corporate
          action individually.
        </p>
      </Section>

      <Section title="Base value">
        <p>The index is set to 100 on the first trading day for which company data is available.</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-data text-xs uppercase tracking-widest text-accent mb-3">{title}</h2>
      <div className="text-foreground/90 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
