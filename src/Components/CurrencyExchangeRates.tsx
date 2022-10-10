import CurrencyExchangeRate from "./CurrencyExchangeRate";
import { ExchangeRate } from "../currency";

export default function CurrencyExchangeRates(props: {
  rates: ExchangeRate[];
}) {
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
