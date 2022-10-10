import { ExchangeRate } from "../currency";
import { pluralize, capitalize } from "../utils";

export default function CurrencyExchangeRate(props: {
  exchangeRate: ExchangeRate;
}) {
  const { exchangeRate } = props;
  const currency = pluralize(capitalize(exchangeRate.currency));
  return (
    <div className="CurrencyExchangeRate">
      {exchangeRate.rate} {currency} ({exchangeRate.currencyCode} -{" "}
      {exchangeRate.country})
    </div>
  );
}
