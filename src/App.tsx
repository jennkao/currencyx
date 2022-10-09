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
  const [amount, setAmount] = useState<number>(1);
  const [selectedRate, setSelectedRate] = useState<ExchangeRate | null>(null);
  const [rateResults, setRateResults] = useState<CurrencyExchangeResult | null>(
    null
  );
  useEffect(() => {
    async function fetchData() {
      const res = await getCzkCurrencyExchangeRates();
      setRateResults(res);
      setSelectedRate(res.rates[0]);
    }
    fetchData();
  }, []);

  const onConversionAmountInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);
    setAmount(value);
  };

  const onCurrencySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!rateResults) {
      return;
    }

    const selectedCurrency = e.target.value;
    const selectedRate = rateResults.rates.filter(
      (r) => selectedCurrency === r.currencyCode
    );
    setSelectedRate(selectedRate[0]);
  };

  return (
    <div className="App">
      <h1>Currency Converter</h1>
      <div>
        <div>
          <input
            type="number"
            id="conversion_input"
            name="conversion_input"
            value={amount}
            onChange={onConversionAmountInputChange}
          />
          <span>CZK</span>
          {rateResults && (
            <span>
              <span> to currency </span>
              <select
                id="conversion_currency"
                onChange={onCurrencySelect}
                value={selectedRate?.currencyCode}
              >
                {rateResults.rates.map((r) => {
                  return (
                    <option value={r.currencyCode}>
                      {capitalize(r.currency)} ({r.currencyCode})
                    </option>
                  );
                })}
              </select>
            </span>
          )}
        </div>
      </div>
      <br />
      <div>1 Czech Koruna (CZK) converts to:</div>
      {rateResults && <CurrencyExchangeRates rates={rateResults.rates} />}
    </div>
  );
}

export default App;
