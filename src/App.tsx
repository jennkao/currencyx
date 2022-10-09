import React, { useEffect, useState } from "react";
import { capitalize } from "./utils";
import {
  getCzkCurrencyExchangeRates,
  CurrencyExchangeResult,
  ExchangeRate,
} from "./currency";
import "./App.css";

function CurrencyExchangeRate(props: { exchangeRate: ExchangeRate }) {
  const { exchangeRate } = props;
  const currency = capitalize(exchangeRate.currency);
  return (
    <div>
      <div>
        {exchangeRate.rate} {currency} ({exchangeRate.currencyCode})
      </div>
      <div>{exchangeRate.country}</div>
    </div>
  );
}

function CurrencyExchangeRates(props: { rates: ExchangeRate[] }) {
  const { rates } = props;
  return (
    <div>
      {rates.map((r) => (
        <CurrencyExchangeRate key={r.currencyCode} exchangeRate={r} />
      ))}
    </div>
  );
}

function App() {
  const [rateResults, setRateResults] = useState<CurrencyExchangeResult | null>(
    null
  );
  useEffect(() => {
    async function fetchData() {
      const res = await getCzkCurrencyExchangeRates();
      setRateResults(res);
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Currency Converter</h1>
      <div>1 Czech Koruna (CZK) converts to:</div>
      {rateResults && <CurrencyExchangeRates rates={rateResults.rates} />}
    </div>
  );
}

export default App;
