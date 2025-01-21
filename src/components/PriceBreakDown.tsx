import { PriceBreakdown } from "../utils/schema";

type PriceBreakdownDisplayProps = {
    priceBreakdown: PriceBreakdown | null;
  };
  
  const PriceBreakdownDisplay = ({ priceBreakdown }: PriceBreakdownDisplayProps) => {
    if (!priceBreakdown) {
      return <p>No price breakdown available. Please calculate first.</p>;
    }
  
    return (
      <div className="max-w-sm mx-auto flex flex-col space-y-2 p-3 mt-8">
        <h2>Price Breakdown</h2>
        <p>Cart Value: {priceBreakdown.cartValue } EUR</p>
        <p>Distance: {priceBreakdown.distance} meters</p>
        <p>Small Order Surcharge: {priceBreakdown.smallOrderSurcharge} EUR</p>
        <p>Delivery Fee: {priceBreakdown.deliveryFee} EUR</p>
        <p>Total Price: {priceBreakdown.totalPrice} EUR</p>
      </div>
    );
  };
  
  export default PriceBreakdownDisplay;
  