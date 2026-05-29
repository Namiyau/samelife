import { CURRENCIES } from "../data/basket";

export const FALLBACK_RATES = {
  CNY: {
    CNY: 1,
    JPY: 23.47,
    USD: 0.138
  },
  JPY: {
    CNY: 0.0426,
    JPY: 1,
    USD: 0.00588
  },
  USD: {
    CNY: 7.25,
    JPY: 170.2,
    USD: 1
  }
};

export function formatMoney(value, currency) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const maximumFractionDigits = currency === "USD" ? 2 : 0;
  const amount = new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits
  }).format(safeValue);

  const unit = CURRENCIES[currency]?.label || currency;
  const symbol = CURRENCIES[currency]?.symbol || "";

  return `${symbol}${amount} ${unit}`;
}

export function convertCurrency(value, fromCurrency, toCurrency, rates) {
  if (!fromCurrency || !toCurrency) return value;
  if (fromCurrency === toCurrency) return value;

  const directRate = rates?.[fromCurrency]?.[toCurrency];

  if (Number.isFinite(directRate)) {
    return value * directRate;
  }

  const fallbackRate = FALLBACK_RATES[fromCurrency]?.[toCurrency];

  if (Number.isFinite(fallbackRate)) {
    return value * fallbackRate;
  }

  return value;
}

async function fetchWithTimeout(url, timeoutMs = 6000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Rate API failed: ${response.status}`);
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

async function fetchFrankfurterV2(base, quote) {
  const url = `https://api.frankfurter.dev/v2/rates?base=${base}&quotes=${quote}`;
  const data = await fetchWithTimeout(url);
  return data.rates?.[quote];
}

async function fetchFrankfurterV1(base, quote) {
  const url = `https://api.frankfurter.app/latest?from=${base}&to=${quote}`;
  const data = await fetchWithTimeout(url);
  return data.rates?.[quote];
}

async function fetchOpenExchangeRateApi(base, quote) {
  const url = `https://open.er-api.com/v6/latest/${base}`;
  const data = await fetchWithTimeout(url);
  if (data?.result !== "success") {
    throw new Error("ExchangeRate-API did not return success");
  }
  return data.rates?.[quote];
}

async function fetchPairRate(base, quote) {
  if (base === quote) return 1;

  const providers = [
    () => fetchFrankfurterV2(base, quote),
    () => fetchFrankfurterV1(base, quote),
    () => fetchOpenExchangeRateApi(base, quote)
  ];

  for (const provider of providers) {
    try {
      const rate = await provider();

      if (Number.isFinite(rate) && rate > 0) {
        return rate;
      }
    } catch (error) {
      // Try the next provider.
    }
  }

  const fallbackRate = FALLBACK_RATES[base]?.[quote];

  if (Number.isFinite(fallbackRate)) {
    return fallbackRate;
  }

  throw new Error(`No exchange rate available for ${base}/${quote}`);
}

export async function fetchLiveRates() {
  const currencies = Object.keys(CURRENCIES);
  const nextRates = {};

  await Promise.all(
    currencies.map(async (base) => {
      nextRates[base] = {
        [base]: 1
      };

      await Promise.all(
        currencies
          .filter((quote) => quote !== base)
          .map(async (quote) => {
            nextRates[base][quote] = await fetchPairRate(base, quote);
          })
      );
    })
  );

  return nextRates;
}
