import { distanceRangesType, PriceBreakdownType } from "./types";

//1. helper function to get user's location co-ordinates.
export const getUserLocation = (): Promise<{
  userLatitude: number;
  userLongitude: number;
}> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatitude = Number(position.coords.latitude);
          const userLongitude = Number(position.coords.longitude);

          //for testing purpose
          // invalid corordinates:
          //const userLatitude = -91.1702143;
          //const userLongitude = 181.8813512;

          // --within range co-ordinates with distance multiplier as well):
          //const userLatitude = 60.1702143;
          //const userLongitude = 24.9003512;

          // --out of range co-ordinates:
          //const userLatitude = 60.1702143;
          //const userLongitude = 24.8813512;

          resolve({ userLatitude, userLongitude });
        },
        (error) => {
          reject(error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      reject(new Error("Geolocation not supported"));
    }
  });
};

//2. Helper function to fetch venue's static data
export const fetchVenueLocation = async (
  venueSlug: string
): Promise<{
  venueLatitude: number;
  venueLongitude: number;
}> => {
  try {
    const endpoint = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch venue data or venue not found:${response.status}`
      );
    }
    const venueData = await response.json();
    const venueLatitude = parseFloat(
      venueData.venue_raw.location.coordinates[1]
    );
    const venueLongitude = parseFloat(
      venueData.venue_raw.location.coordinates[0]
    );

    return {
      venueLatitude,
      venueLongitude,
    };
  } catch (error: any) {
    console.log(`Error fetching venue static data: ${error}`);
    throw Error(error.message);
  }
};

//3. Helper function to fetch the venue's dynamic data

export const fetchVenueDynamicData = async (
  venueSlug: string
): Promise<{
  basePrice: number;
  orderMinimumNoSurcharge: number;
  distanceRanges: distanceRangesType[];
}> => {
  const endpoint = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(
        ` ${response.status}! Failed to fetch venue data or venue not found.`
      );
    }
    const venueData = await response.json();
    //console.log(venueData);
    return {
      basePrice: venueData.venue_raw.delivery_specs.delivery_pricing.base_price,
      orderMinimumNoSurcharge:
        venueData.venue_raw.delivery_specs.order_minimum_no_surcharge,
      distanceRanges:
        venueData.venue_raw.delivery_specs.delivery_pricing.distance_ranges,
    };
  } catch (error: any) {
    console.log("Error fetching venue dynamic data.", error);
    throw Error(error.message);
  }
};

//4. Helper function to calculate distance between two coordinates
export const straightLineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = Math.round(R * c * 1000);
  return distance;
};

//5. Helper function to calculate price break down
export const calculatePriceBreakDown = async (
  venueSlug: string,
  cartValue: number,
  userLatitude: number,
  userLongitude: number
): Promise<PriceBreakdownType> => {
  // converting cartvalue to cents(venue data returns on cents)

  const cartValueInCents = cartValue * 100;
  try {
    const { basePrice, orderMinimumNoSurcharge, distanceRanges } =
      await fetchVenueDynamicData(venueSlug);

    // Fetch venue location
    const { venueLatitude, venueLongitude } = await fetchVenueLocation(
      venueSlug
    );

    const distance = straightLineDistance(
      userLatitude,
      userLongitude,
      venueLatitude,
      venueLongitude
    );

    // Calculate small order surcharge(can't be negative).
    const smallOrderSurcharge = Math.max(
      0,
      orderMinimumNoSurcharge - cartValueInCents
    );

    let deliveryUpperLimit: number = 0;

    // Find the appropriate distance range or return undefined.
    const applicableRange = distanceRanges.find((range) => {
      if (range.max === 0) {
        deliveryUpperLimit = range.min;
        // "max: 0" means delivery is not available for distances >= range.min
        return distance < deliveryUpperLimit; // If distance >= range.min, return false
      }
      return distance >= range.min && distance < range.max;
    });

    if (!applicableRange) {
      return {
        cartValue: cartValueInCents,
        distance,
        smallOrderSurcharge: 0,
        deliveryFee: 0,
        totalPrice: 0,
        error: `Oops!, our delivery distance range is less than ${
          deliveryUpperLimit / 1000
        }km for now. Distance measured is approx: ${distance / 1000} km.`,
      };
    }

    const { a, b } = applicableRange;

    // Calculate delivery fee
    const deliveryFee = Math.round(
      ((basePrice + a + (b * distance) / 10) * 100) / 100
    );

    // Calculate total price
    const totalPrice = cartValueInCents + smallOrderSurcharge + deliveryFee;

    return {
      cartValue: cartValueInCents,
      distance,
      smallOrderSurcharge,
      deliveryFee,
      totalPrice,
    };
  } catch (error) {
    console.log("Error calculating price breakdown:", error);
    return {
      cartValue: 0,
      distance: 0,
      smallOrderSurcharge: 0,
      deliveryFee: 0,
      totalPrice: 0,
      error: `${error}` || "Failed to calculate pricebreakdown.",
    };
  }
};
