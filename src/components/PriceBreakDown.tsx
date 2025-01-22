import { PriceBreakDownType } from "../utils/types";

type PriceBreakdownDisplayProps = {
  priceBreakdown: PriceBreakDownType | null;
};

const PriceBreakdownDisplay = ({
  priceBreakdown,
}: PriceBreakdownDisplayProps) => {
  if (!priceBreakdown) {
    return <></>;
  }

  // format currency and handle data-raw-value
  const formatCurrency = (value: number) => {
    const euros = (value / 100).toFixed(2);
    return (
      <span data-raw-value={value}>
        {new Intl.NumberFormat("fi-FI", {
          style: "currency",
          currency: "EUR",
        }).format(parseFloat(euros))}
      </span>
    );
  };

  // format distance and handle data-raw-value
  const formatDistance = (value: number) => (
    <span data-raw-value={value / 1000}>{`${value} m`}</span>
  );

  return (
    <div className="flex flex-col space-y-2 p-3 mt-8">
      <h2 className="text-lg font-bold text-gray-700">Price Breakdown</h2>
      <div className="flex justify-between font-medium">
        <span>Cart Value:</span>
        {formatCurrency(priceBreakdown.cartValue)}
      </div>
      <div className="flex justify-between font-medium">
        <span>Distance:</span>
        {formatDistance(priceBreakdown.distance)}
      </div>
      <div className="flex justify-between font-medium">
        <span>Delivery Fee:</span>
        {formatCurrency(priceBreakdown.deliveryFee)}
      </div>
      <div className="flex justify-between font-medium">
        <span>Small Order Surcharge:</span>
        {formatCurrency(priceBreakdown.smallOrderSurcharge)}
      </div>

      <div className="flex justify-between font-bold">
        <span>Total Price:</span>
        {formatCurrency(priceBreakdown.totalPrice)}
      </div>
    </div>
  );
};

export default PriceBreakdownDisplay;
