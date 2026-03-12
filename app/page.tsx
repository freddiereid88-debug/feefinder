"use client";

import { useState } from "react";

export default function FeeFinderHome() {
  const [sent, setSent] = useState(4000);
  const [received, setReceived] = useState(5000);
  const [sentCurrency, setSentCurrency] = useState("GBP");
  const [receivedCurrency, setReceivedCurrency] = useState("USD");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function calculate() {
    setLoading(true);

    const effectiveRate = received / sent;
    let benchmarkRate = 0;

    try {
      const res = await fetch(
        `https://api.frankfurter.dev/v1/latest?base=${sentCurrency}&symbols=${receivedCurrency}`
      );

      const data = await res.json();

      if (data?.rates?.[receivedCurrency]) {
        benchmarkRate = data.rates[receivedCurrency];
      }
    } catch (e) {
      console.error("FX API error", e);
    }

    const markup = ((benchmarkRate - effectiveRate) / benchmarkRate) * 100;
    const hiddenCost = Math.abs((benchmarkRate - effectiveRate) * sent);

    setResult({
      effectiveRate,
      benchmarkRate,
      markup,
      hiddenCost,
    });

    setLoading(false);
  }

  function loadExample(
    newSent: number,
    newReceived: number,
    newSentCurrency: string,
    newReceivedCurrency: string
  ) {
    setSent(newSent);
    setReceived(newReceived);
    setSentCurrency(newSentCurrency);
    setReceivedCurrency(newReceivedCurrency);
    setResult(null);
  }

  return (
    <main className="min-h-screen bg-[#F7FBFC] text-gray-800">
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#BDEFD7] bg-[#F2FFF8] text-lg font-bold text-[#006D77]">
              $£
            </div>
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-[#00C981]">Fee</span>
              <span className="text-[#006D77]">Finder</span>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
            <a href="#how-it-works" className="hover:text-[#006D77]">How it works</a>
            <a href="#examples" className="hover:text-[#006D77]">Examples</a>
            <a href="#about" className="hover:text-[#006D77]">About</a>
            <button className="rounded-lg bg-[#006D77] px-4 py-2 font-medium text-white">
              Check my transfer
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-14 px-8 py-20 md:grid-cols-2 md:py-24">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-[#BDEFD7] bg-[#F2FFF8] px-3 py-1 text-sm font-medium text-[#006D77]">
            Currency transfer transparency
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight">
            Check what your bank really charged you
          </h1>

          <p className="mb-8 max-w-xl text-lg text-gray-600">
            Compare your exchange rate with the real market rate in seconds and see the estimated hidden cost of your transfer.
          </p>

          <ul className="mb-8 space-y-3 text-gray-700">
            <li>✔ Benchmark data from global FX markets</li>
            <li>✔ Independent exchange rate comparison</li>
            <li>✔ Built to increase transparency in currency pricing</li>
          </ul>

          <div id="examples" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Try an example
            </p>

            <div className="space-y-3">
              <button
                onClick={() => loadExample(4000, 5000, "GBP", "USD")}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left transition hover:border-[#006D77] hover:bg-[#F7FBFC]"
              >
                <span className="font-medium">£4,000 → $5,000</span>
                <span className="text-sm text-gray-500">Personal transfer</span>
              </button>

              <button
                onClick={() => loadExample(10000, 11650, "GBP", "EUR")}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left transition hover:border-[#006D77] hover:bg-[#F7FBFC]"
              >
                <span className="font-medium">£10,000 → €11,650</span>
                <span className="text-sm text-gray-500">Property payment</span>
              </button>

              <button
                onClick={() => loadExample(50000, 63200, "GBP", "USD")}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left transition hover:border-[#006D77] hover:bg-[#F7FBFC]"
              >
                <span className="font-medium">£50,000 → $63,200</span>
                <span className="text-sm text-gray-500">Large transfer</span>
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold">Check your transfer</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-600">You sent</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={sent}
                  onChange={(e) => setSent(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#006D77]"
                />
                <select
                  value={sentCurrency}
                  onChange={(e) => setSentCurrency(e.target.value)}
                  className="rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#006D77]"
                >
                  <option>GBP</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">Recipient received</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={received}
                  onChange={(e) => setReceived(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#006D77]"
                />
                <select
                  value={receivedCurrency}
                  onChange={(e) => setReceivedCurrency(e.target.value)}
                  className="rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#006D77]"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculate}
              className="mt-4 w-full rounded-xl bg-[#006D77] py-3 font-medium text-white transition hover:bg-[#005760]"
            >
              {loading ? "Checking market rate..." : "Check my transfer"}
            </button>
          </div>

          {result && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="mb-4 text-xl font-semibold">Results</h3>

              <div className="space-y-3">
                <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-gray-600">Exchange rate you received</span>
                  <b>
                    1 {sentCurrency} = {result.effectiveRate.toFixed(4)} {receivedCurrency}
                  </b>
                </div>

                <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-gray-600">Market benchmark</span>
                  <b>
                    1 {sentCurrency} = {result.benchmarkRate.toFixed(4)} {receivedCurrency}
                  </b>
                </div>

                <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-gray-600">Estimated markup</span>
                  <b>{result.markup.toFixed(2)}%</b>
                </div>

                <div className="flex justify-between rounded-xl border border-[#BDEFD7] bg-[#F2FFF8] px-4 py-4">
                  <span className="text-gray-700">Estimated hidden cost</span>
                  <b className="text-[#006D77]">
                    {result.hiddenCost.toFixed(2)} {sentCurrency}
                  </b>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                This is an estimate based on the current mid-market benchmark rate.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-8 pb-20">
        <div className="mb-8 max-w-xl">
          <h2 className="mb-3 text-3xl font-bold tracking-tight">How it works</h2>
          <p className="text-gray-600">
            FeeFinder helps you understand whether the exchange rate on your transfer was fair.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#F2FFF8] font-semibold text-[#006D77]">
              1
            </div>
            <h3 className="mb-2 text-lg font-semibold">Enter your transfer</h3>
            <p className="text-gray-600">
              Add what you sent and what the recipient received.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#F2FFF8] font-semibold text-[#006D77]">
              2
            </div>
            <h3 className="mb-2 text-lg font-semibold">We check the market rate</h3>
            <p className="text-gray-600">
              FeeFinder compares your transfer against a live market benchmark.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#F2FFF8] font-semibold text-[#006D77]">
              3
            </div>
            <h3 className="mb-2 text-lg font-semibold">See the hidden cost</h3>
            <p className="text-gray-600">
              Instantly see the markup and estimated hidden fee in your transfer.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-8 py-10 text-sm text-gray-500">
          FeeFinder is built to make currency pricing easier to understand.
        </div>
      </section>
    </main>
  );
}
