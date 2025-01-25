
// type for distance ranges
export type distanceRangesType = {
    min: number;
    max: number;
    a: number;
    b: number;
    flag?: null | string;
  };
  
  // type for pricebreakdowm
  export type PriceBreakdownType = {
    cartValue: number;
    distance: number;
    smallOrderSurcharge: number;
    deliveryFee: number;
    totalPrice: number;
    error?: string;
  };