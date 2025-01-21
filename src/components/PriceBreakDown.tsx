import { PriceBreakDownType } from "../utils/schema";

type PriceBreakdownDisplayProps = {
  priceBreakdown: PriceBreakDownType | null;
};

const PriceBreakdownDisplay = ({
  priceBreakdown,
}: PriceBreakdownDisplayProps) => {
  if (!priceBreakdown) {
    return <p>No price breakdown available. Please calculate first.</p>;
  }

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

  const formatDistance = (value: number) => (
    <span data-raw-value={value}>{`${value} m`}</span>
  );

  return (
    <div className="flex flex-col space-y-2 p-3 mt-8">
      <h2 className="text-lg font-bold text-gray-700">Price Breakdown</h2>
      <div className="flex justify-between">
        <span>Cart Value:</span>
        <span data-raw-value={priceBreakdown.cartValue * 100}>
          {formatCurrency(priceBreakdown.cartValue)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Distance:</span>
        <span data-raw-value={priceBreakdown.distance}>
          {formatDistance(priceBreakdown.distance)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Small Order Surcharge:</span>
        <span data-raw-value={priceBreakdown.smallOrderSurcharge * 100}>
          {formatCurrency(priceBreakdown.smallOrderSurcharge)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Delivery Fee:</span>
        <span data-raw-value={priceBreakdown.deliveryFee * 100}>
          {formatCurrency(priceBreakdown.deliveryFee)}
        </span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Total Price:</span>
        <span data-raw-value={priceBreakdown.totalPrice * 100}>
          {formatCurrency(priceBreakdown.totalPrice)}
        </span>
      </div>
    </div>
  );
};

export default PriceBreakdownDisplay;
