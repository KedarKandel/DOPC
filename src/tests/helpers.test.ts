import { describe, expect, it, } from "vitest";
import {
  calculatePriceBreakDown,
} from "../utils/helpers";

describe("calculatePriceBreakDown", () => {

  // distance_ranges": [
  //     {
  //       "min": 0,
  //       "max": 500,
  //       "a": 0,
  //       "b": 0,
  //       "flag": null
  //     },
  //     {
  //       "min": 500,
  //       "max": 1000,
  //       "a": 100,
  //       "b": 0,
  //       "flag": null
  //     },
  //     {
  //       "min": 1000,
  //       "max": 1500,
  //       "a": 200,
  //       "b": 0,
  //       "flag": null
  //     },
  //     {
  //       "min": 1500,
  //       "max": 2000,
  //       "a": 200,
  //       "b": 1,
  //       "flag": null
  //     },
  //     {
  //       "min": 2000,
  //       "max": 0,
  //       "a": 0,
  //       "b": 0,
  //       "flag": null
  //     }
  //   ]

  it("should calculate price break down correctly, testing with exact same co-ordinates where distance will be zero", async () => {
    // Test parameters
    const venueSlug = "home-assignment-venue-helsinki";
    const cartValue = 5; // In euros
    const userLatitude = 60.17012143; // same as venue lat
    const userLongitude = 24.92813512; // same as venue long

    // Call the function
    const result = await calculatePriceBreakDown(
      venueSlug,
      cartValue,
      userLatitude,
      userLongitude
    );
    // asserts
    expect(result).toEqual({
      cartValue: 500, // 5 * 100
      distance: 0, // exact same co-ordinates passed.
      smallOrderSurcharge: 500, // 1000-500
      deliveryFee: 190, //
      totalPrice: 1190, // Sum of cartValue, surcharge, and fee
    });
  });

  it("should calculate price break down correctly, testing with co-ordinates that includes multipler with distance above 1500m", async () => {
    // Test parameters
    const venueSlug = "home-assignment-venue-helsinki";
    const cartValue = 5; // In euros
    const userLatitude = 60.1702143; // same as venue lat
    const userLongitude = 24.9003512; // same as venue long

    // Act: Call the function
    const result = await calculatePriceBreakDown(
      venueSlug,
      cartValue,
      userLatitude,
      userLongitude
    );
    //console.log(result);
    // Verify the result
    expect(result).toEqual({
      cartValue: 500, // 5 * 100
      distance: 1537, // straightline distance calculation returns
      smallOrderSurcharge: 500, // 1000-500
      deliveryFee: 544, //(((190 + 200 + (1 * 1537) / 10) * 100) / 100):
      //   {
      //   base_price=190
      //   "min": 1500,
      //   "max": 2000,
      //   "a": 200,
      //   "b": 1,
      //    "flag": null
      //     }

      totalPrice: 1544, // 500+500+544
    });
  });
});

// can be done by mocking the function using vi but i just wanted to try it the other way😀//