import { NextRequest, NextResponse } from "next/server";

function isSupportedPair(base: string, quote: string) {
  const supportedPairs = [
    "EUR/USD",
    "USD/EUR",
    "GBP/USD",
    "USD/GBP",
    "GBP/EUR",
    "EUR/GBP",
  ];

  return supportedPairs.includes(`${base}/${quote}`);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const base = searchParams.get("base");
  const quote = searchParams.get("quote");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  if (!base || !quote || !date || !time) {
    return NextResponse.json(
      { error: "Missing base, quote, date, or time" },
      { status: 400 }
    );
  }

  if (!isSupportedPair(base, quote)) {
    return NextResponse.json(
      { error: "Minute lookup is currently available for GBP, EUR and USD pairs only." },
      { status: 400 }
    );
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing Twelve Data API key." },
      { status: 500 }
    );
  }

  const startDateTime = `${date} ${time}:00`;

  const start = new Date(`${date}T${time}:00Z`);
  if (Number.isNaN(start.getTime())) {
    return NextResponse.json(
      { error: "Invalid date/time format." },
      { status: 400 }
    );
  }

  const end = new Date(start.getTime() + 60 * 1000);
  const endDateTime = end.toISOString().replace("T", " ").slice(0, 19);

  const url =
    `https://api.twelvedata.com/time_series` +
    `?symbol=${base}/${quote}` +
    `&interval=1min` +
    `&start_date=${encodeURIComponent(startDateTime)}` +
    `&end_date=${encodeURIComponent(endDateTime)}` +
    `&timezone=UTC` +
    `&outputsize=2` +
    `&apikey=${apiKey}`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  if (!res.ok || data.status === "error") {
    return NextResponse.json(
      { error: data.message || "Failed to fetch minute FX data." },
      { status: 502 }
    );
  }

  const bar = data?.values?.[0];

  if (!bar) {
    return NextResponse.json(
      { error: "No minute bar returned for that timestamp." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    benchmarkRate: Number(bar.close),
    benchmarkTimestamp: bar.datetime,
    source: "Twelve Data",
  });
}