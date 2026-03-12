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

    const markup =
      ((benchmarkRate - effectiveRate) / benchmarkRate) * 100;

    const hiddenCost =
      Math.abs((benchmarkRate - effectiveRate) * sent);

    setResult({
      effectiveRate,
      benchmarkRate,
      markup,
      hiddenCost
    });

    setLoading(false);
  }

  return (

    <main className="min-h-screen bg-gray-50 text-gray-800">

      <div className="max-w-6xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-16">

        <div>

          <h1 className="text-5xl font-bold mb-6">
            Check what your bank really charged you
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            Compare your exchange rate with the real market rate in seconds.
          </p>

          <ul className="space-y-3 text-gray-700">
            <li>✔ Benchmark data from global FX markets</li>
            <li>✔ Independent exchange rate comparison</li>
            <li>✔ Built to increase transparency in currency pricing</li>
          </ul>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-semibold mb-6">
            Check your transfer
          </h2>

          <div className="space-y-4">

            <div>
              <label className="text-sm">You sent</label>

              <div className="flex gap-2">

                <input
                  type="number"
                  value={sent}
                  onChange={(e) => setSent(Number(e.target.value))}
                  className="border rounded-lg p-2 w-full"
                />

                <select
                  value={sentCurrency}
                  onChange={(e) => setSentCurrency(e.target.value)}
                  className="border rounded-lg p-2"
                >
                  <option>GBP</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>

              </div>
            </div>

            <div>
              <label className="text-sm">Recipient received</label>

              <div className="flex gap-2">

                <input
                  type="number"
                  value={received}
                  onChange={(e) => setReceived(Number(e.target.value))}
                  className="border rounded-lg p-2 w-full"
                />

                <select
                  value={receivedCurrency}
                  onChange={(e) => setReceivedCurrency(e.target.value)}
                  className="border rounded-lg p-2"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>

              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-[#006D77] text-white py-3 rounded-lg mt-4"
            >
              {loading ? "Checking market rate..." : "Check my transfer"}
            </button>

          </div>

          {result && (

            <div className="mt-8 border-t pt-6 space-y-3">

              <div className="flex justify-between">
                <span>Exchange rate you received</span>

                <b>
                  1 {sentCurrency} = {result.effectiveRate.toFixed(4)} {receivedCurrency}
                </b>
              </div>

              <div className="flex justify-between">
                <span>Market benchmark</span>

                <b>
                  1 {sentCurrency} = {result.benchmarkRate.toFixed(4)} {receivedCurrency}
                </b>
              </div>

              <div className="flex justify-between">
                <span>Estimated markup</span>
                <b>{result.markup.toFixed(2)}%</b>
              </div>

              <div className="flex justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <span>Estimated hidden cost</span>

                <b>
                  {result.hiddenCost.toFixed(2)} {sentCurrency}
                </b>
              </div>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}