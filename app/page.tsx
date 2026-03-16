"use client";

import { useMemo, useState } from "react";

const currencySymbols: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

function formatMoney(value: number, currency: string) {
  return `${currencySymbols[currency] ?? ""}${value.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function FeeFinderHome() {
  const [sent, setSent] = useState(5000);
  const [received, setReceived] = useState(4600);
  const [sentCurrency, setSentCurrency] = useState("USD");
  const [receivedCurrency, setReceivedCurrency] = useState("EUR");
  const [provider, setProvider] = useState("HSBC");

  const [date, setDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trustItems = useMemo(
    () => [
      "Minute benchmark for GBP, EUR and USD pairs",
      "Independent exchange rate comparison",
      "Built to increase transparency in currency pricing",
    ],
    []
  );

  async function calculate() {
    setLoading(true);
    setError("");
    setResult(null);

    const effectiveRate = received / sent;

    const supportedPairs = [
      "EUR/USD",
      "USD/EUR",
      "GBP/USD",
      "USD/GBP",
      "GBP/EUR",
      "EUR/GBP",
    ];

    const pair = `${sentCurrency}/${receivedCurrency}`;

    if (!supportedPairs.includes(pair)) {
      setError(
        "Minute lookup currently available for GBP, EUR and USD pairs only."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/fx-minute?base=${sentCurrency}&quote=${receivedCurrency}&date=${date}&time=${time}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to retrieve benchmark.");
      }

      const benchmarkRate = data.benchmarkRate;
      const markup = ((benchmarkRate - effectiveRate) / benchmarkRate) * 100;
      const hiddenCost = Math.abs((benchmarkRate - effectiveRate) * sent);

      setResult({
        effectiveRate,
        benchmarkRate,
        benchmarkTimestamp: data.benchmarkTimestamp,
        markup,
        hiddenCost,
      });
    } catch (e: any) {
      setError(e.message || "Error retrieving benchmark");
    }

    setLoading(false);
  }

  function loadExample(
    newSent: number,
    newReceived: number,
    newSentCurrency: string,
    newReceivedCurrency: string,
    newProvider: string
  ) {
    setSent(newSent);
    setReceived(newReceived);
    setSentCurrency(newSentCurrency);
    setReceivedCurrency(newReceivedCurrency);
    setProvider(newProvider);
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#F7FBFC] text-slate-900">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_right,rgba(0,109,119,0.10),transparent_28%),radial-gradient(circle_at_20%_10%,rgba(0,255,159,0.12),transparent_20%),linear-gradient(180deg,#ffffff_0%,#f7fbfc_72%)]" />

      <nav className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#BDEFD7] bg-white shadow-sm">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#006D77] text-[11px] font-bold text-[#006D77]">
                <span className="absolute -left-1.5 top-[8px] text-[#00C981]">
                  $
                </span>
                <span className="absolute right-[-2px] top-[8px] text-[#006D77]">
                  £
                </span>
                <span className="absolute bottom-[-7px] right-[-10px] h-2.5 w-5 rotate-45 rounded-full border-t-2 border-[#006D77]" />
              </div>
            </div>

            <div className="text-[28px] font-bold tracking-tight">
              <span className="text-[#00C981]">Fee</span>
              <span className="text-[#006D77]">Finder</span>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <a
              href="#how-it-works"
              className="transition hover:text-[#006D77]"
            >
              How it works
            </a>
            <a href="#examples" className="transition hover:text-[#006D77]">
              Examples
            </a>
            <a href="#about" className="transition hover:text-[#006D77]">
              About
            </a>
            <button className="rounded-xl bg-[#006D77] px-4 py-2.5 text-white shadow-sm transition hover:bg-[#00555c]">
              Check my transfer
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
        <div className="pt-2 lg:pt-8">
          <div className="mb-5 inline-flex rounded-full border border-[#BDEFD7] bg-white px-3 py-1.5 text-sm font-semibold text-[#006D77] shadow-sm">
            Minute-by-minute GBP / EUR / USD benchmark
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-slate-950 md:text-6xl">
            Check what your bank really charged you
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Compare your exchange rate with the benchmark rate at that exact
            minute and see the estimated hidden cost of your transfer.
          </p>

          <div className="mt-8 space-y-3">
            {trustItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-[15px] text-slate-700"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F2FFF8] text-[#006D77]">
                  ✓
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div
            id="examples"
            className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Try an example
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  Start with a real-world transfer
                </h3>
              </div>
              <div className="rounded-full bg-[#F2FFF8] px-3 py-1 text-xs font-semibold text-[#006D77]">
                3 examples
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() =>
                  loadExample(5000, 4600, "USD", "EUR", "HSBC")
                }
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-4 text-left transition hover:border-[#006D77] hover:bg-white"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    $5,000 → €4,600
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    Personal transfer
                  </div>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                  HSBC
                </div>
              </button>

              <button
                onClick={() =>
                  loadExample(10000, 7900, "GBP", "USD", "Santander")
                }
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-4 text-left transition hover:border-[#006D77] hover:bg-white"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    £10,000 → $7,900
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    International payment
                  </div>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                  Santander
                </div>
              </button>

              <button
                onClick={() =>
                  loadExample(50000, 58500, "EUR", "USD", "Barclays")
                }
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-4 text-left transition hover:border-[#006D77] hover:bg-white"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    €50,000 → $58,500
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    Large transfer
                  </div>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                  Barclays
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[32px] bg-[#DDF9EE] blur-2xl" />

          <div className="relative rounded-[32px] border border-white/80 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.10)] md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex rounded-full bg-[#F2FFF8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#006D77]">
                  Live calculator
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                  Check your transfer
                </h2>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right text-sm">
                <div className="text-slate-500">Provider</div>
                <div className="font-semibold text-slate-900">{provider}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  You sent
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={sent}
                    onChange={(e) => setSent(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#006D77]"
                  />
                  <select
                    value={sentCurrency}
                    onChange={(e) => setSentCurrency(e.target.value)}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#006D77]"
                  >
                    <option>GBP</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Recipient received
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={received}
                    onChange={(e) => setReceived(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#006D77]"
                  />
                  <select
                    value={receivedCurrency}
                    onChange={(e) => setReceivedCurrency(e.target.value)}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#006D77]"
                  >
                    <option>GBP</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#006D77]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#006D77]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#006D77]"
                >
                  <option>HSBC</option>
                  <option>Barclays</option>
                  <option>Santander</option>
                  <option>Wise</option>
                  <option>Revolut</option>
                  <option>Other</option>
                </select>
              </div>

              <button
                onClick={calculate}
                className="mt-2 w-full rounded-2xl bg-[#006D77] py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#00555c]"
              >
                {loading ? "Checking market rate..." : "Check my transfer"}
              </button>

              <p className="text-sm text-slate-500">
                Minute-by-minute benchmark currently available for GBP, EUR and
                USD pairs.
              </p>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            {result && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-950">
                    Results
                  </h3>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                    Minute benchmark
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
                    <span className="text-slate-600">
                      Exchange rate you received
                    </span>
                    <span className="font-semibold text-slate-900">
                      1 {sentCurrency} = {result.effectiveRate.toFixed(4)}{" "}
                      {receivedCurrency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
                    <span className="text-slate-600">Market benchmark</span>
                    <span className="font-semibold text-slate-900">
                      1 {sentCurrency} = {result.benchmarkRate.toFixed(4)}{" "}
                      {receivedCurrency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
                    <span className="text-slate-600">Benchmark timestamp</span>
                    <span className="font-semibold text-slate-900">
                      {result.benchmarkTimestamp} UTC
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
                    <span className="text-slate-600">Estimated markup</span>
                    <span className="font-semibold text-slate-900">
                      {result.markup.toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-[#BDEFD7] bg-[#F2FFF8] px-4 py-4">
                    <span className="text-slate-700">
                      Estimated hidden cost
                    </span>
                    <span className="text-lg font-semibold text-[#006D77]">
                      {formatMoney(result.hiddenCost, sentCurrency)}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  This is an estimate based on the benchmark rate for the
                  selected minute.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 pb-20 lg:px-8"
      >
        <div className="mb-8 max-w-2xl">
          <div className="mb-3 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
            How it works
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Minute-level benchmarking for real transfers
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            FeeFinder checks your transfer against the benchmark market rate at
            the selected minute.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2FFF8] text-lg font-semibold text-[#006D77]">
              1
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-950">
              Enter your transfer
            </h3>
            <p className="leading-7 text-slate-600">
              Add what you sent, what the recipient received, plus the transfer
              date and time.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2FFF8] text-lg font-semibold text-[#006D77]">
              2
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-950">
              We fetch the minute benchmark
            </h3>
            <p className="leading-7 text-slate-600">
              FeeFinder uses a minute-level market benchmark to compare your
              effective exchange rate.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2FFF8] text-lg font-semibold text-[#006D77]">
              3
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-950">
              See the hidden cost
            </h3>
            <p className="leading-7 text-slate-600">
              Instantly see the estimated markup and hidden cost so you can
              judge whether the rate was fair.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 text-sm text-slate-500 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            FeeFinder is built to make currency pricing easier to understand.
          </div>
          <div>Minute benchmark powered by Twelve Data.</div>
        </div>
      </section>
    </main>
  );
}