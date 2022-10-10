import React, { useEffect, useState } from "react";
import { capitalize, pluralize } from "./utils";
import {
  getCzkCurrencyExchangeRates,
  CurrencyExchangeResult,
  ExchangeRate,
} from "./currency";
import "./App.css";

function CurrencyExchangeRate(props: { exchangeRate: ExchangeRate }) {
  const { exchangeRate } = props;
  const currency = pluralize(capitalize(exchangeRate.currency));
  return (
    <div className="CurrencyExchangeRate">
      {exchangeRate.rate} {currency} ({exchangeRate.currencyCode} -{" "}
      {exchangeRate.country})
    </div>
  );
}

function CurrencyExchangeRates(props: { rates: ExchangeRate[] }) {
  const { rates } = props;
  return (
    <div className="CurrencyExchangeRates">
      <div className="CurrencyExchangeRates__text">
        1 Czech Koruna (CZK) converts to:
      </div>
      {rates.map((r) => (
        <CurrencyExchangeRate key={r.currencyCode} exchangeRate={r} />
      ))}
    </div>
  );
}

interface DisplayedExchangeRate {
  amount: number;
  rate: ExchangeRate;
  convertedAmount: number;
}

function DisplayedCurrencyExchangeRate(props: {
  displayedRate: DisplayedExchangeRate;
}) {
  const { displayedRate } = props;
  const currency = pluralize(capitalize(displayedRate.rate.currency));
  const text = `${displayedRate.amount} CZK to ${displayedRate.convertedAmount} ${currency} (${displayedRate.rate.currencyCode} - ${displayedRate.rate.country})`;
  return <div className="DisplayedRate">{text}</div>;
}

function App() {
  const [amount, setAmount] = useState<number>(1);
  const [selectedRate, setSelectedRate] = useState<ExchangeRate | null>(null);
  const [rateResults, setRateResults] = useState<CurrencyExchangeResult | null>(
    null
  );
  const [displayedRate, setDisplayedRate] =
    useState<DisplayedExchangeRate | null>(null);

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

  const onConvertClick = () => {
    if (!selectedRate) {
      return;
    }

    const converted = amount * selectedRate.rate;
    setDisplayedRate({
      amount,
      rate: selectedRate,
      convertedAmount: parseFloat(converted.toFixed(3)),
    });
  };

  return (
    <div className="Layout">
      <div className="App">
        <h1>Currency Converter</h1>
        <div className="ConversionInputs">
          <input
            id="amountInput"
            type="number"
            value={amount}
            onChange={onConversionAmountInputChange}
          />
          <span>CZK to currency</span>
          {rateResults && (
            <select
              id="currencyDropdown"
              onChange={onCurrencySelect}
              value={selectedRate?.currencyCode}
            >
              {rateResults.rates.map((r) => {
                return (
                  <option key={r.currencyCode} value={r.currencyCode}>
                    {capitalize(r.currency)} ({r.currencyCode} - {r.country})
                  </option>
                );
              })}
            </select>
          )}
          <button className="ConvertBtn" onClick={onConvertClick}>
            Convert
          </button>
        </div>

        {displayedRate && (
          <DisplayedCurrencyExchangeRate displayedRate={displayedRate} />
        )}

        {rateResults && <CurrencyExchangeRates rates={rateResults.rates} />}
      </div>
    </div>
  );
}

export default App;
