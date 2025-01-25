
import { PriceBreakdownType } from "../utils/types";

type PriceBreakDownProps = {
  priceBreakdown: PriceBreakdownType | null;
};

const PriceBreakDown = ({ priceBreakdown }: PriceBreakDownProps) => {
  if (!priceBreakdown) {
    return <></>;
  }

  // format currency, pass data-raw-value
  const formatCurrency = (value: number, testId: string) => {
    const euros = (value / 100).toFixed(2);
    return (
      <span data-testid={testId} data-raw-value={value} >
        {new Intl.NumberFormat("fi-FI", {
          style: "currency",
          currency: "EUR",
        }).format(parseFloat(euros))}
      </span>
    );
  };

  // format distance, pass handle data-raw-value
  const formatDistance = (value: number, testId:string) => (
    <span data-testid={testId} data-raw-value={value}>
      {`${value} m`}
    </span>
  );

  return (
    <div className="flex flex-col space-y-2 p-3 mt-8">
      <h2 className="text-lg font-bold text-gray-700">Price Breakdown</h2>
      <div className="flex justify-between font-medium">
        <span>Cart Value:</span>
        {formatCurrency(priceBreakdown.cartValue, "resultCartValue")}
      </div>
      <div className="flex justify-between font-medium">
        <span>Distance:</span>
        {formatDistance(priceBreakdown.distance, "distance")}
      </div>
      <div className="flex justify-between font-medium">
        <span>Delivery Fee:</span>
        {formatCurrency(priceBreakdown.deliveryFee, "deliveryFee")}
      </div>
      <div className="flex justify-between font-medium">
        <span>Small Order Surcharge:</span>
        {formatCurrency(
          priceBreakdown.smallOrderSurcharge,
          "smallOrderSurcharge"
        )}
      </div>

      <div className="flex justify-between font-bold">
        <span>Total Price:</span>
        {formatCurrency(priceBreakdown.totalPrice, "totalPrice")}
      </div>
    </div>
  );
};

export default PriceBreakDown;
