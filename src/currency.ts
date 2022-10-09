export interface ExchangeRate {
  country: string;
  currency: string;
  currencyCode: string;
  rate: number;
}

export interface CurrencyExchangeResult {
  baseCountry: string;
  baseCurrency: string;
  dateDeclared: Date;
  sequenceNumber: number;
  rates: ExchangeRate[];
}

// Fetches a text file containing currency exchange rates from: http://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing
// Documentation: https://www.cnb.cz/en/faq/Format-of-the-foreign-exchange-market-rates/
export async function getCzkCurrencyExchangeRates(): Promise<CurrencyExchangeResult> {
  // fetch document
  const res = await fetch("/daily.txt");
  const body = await res.text();

  // process text files into lines
  const parts = body.split("\n").filter((s) => !!s);

  // process date header on line 1 - we ignore line 2 with table header info
  const header = parts[0];
  const sequenceInd = header.indexOf("#");
  const date = header.slice(0, sequenceInd);
  const sequenceNumber = header.slice(sequenceInd + 1);

  // process per-country exchange rates
  const rates = parts.slice(2);
  const exchangeRates: ExchangeRate[] = rates.map((p) => {
    const [country, currency, _, currencyCode, rate] = p.split("|");
    return { country, currency, currencyCode, rate: Number(rate) };
  });

  return {
    baseCountry: "Czech Republic",
    baseCurrency: "CZK",
    dateDeclared: new Date(date),
    sequenceNumber: Number(sequenceNumber),
    rates: exchangeRates,
  };
}
