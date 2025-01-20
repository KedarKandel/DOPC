import { distanceRangesType, PriceBreakdown } from "./schema";

// helper function to get user location co-ordinates.
export const getUserLocation = (): Promise<{
  userLatitude: string;
  userLongitude: string;
}> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatitude = position.coords.latitude.toString();
          const userLongitude = position.coords.longitude.toString();
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

// Helper function to fetch venue data
export const fetchVenueLocation = async (
  venueSlug: string
): Promise<{
  venueLatitude: string;
  venueLongitude: string;
}> => {
  try {
    const endpoint = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch venue data: ${response.statusText}`);
    }
    const venueData = await response.json();
    return {
      venueLongitude: venueData.venue_raw.location.coordinates[0],
      venueLatitude: venueData.venue_raw.location.coordinates[1],
    };
  } catch (error) {
    console.error("Error fetching venue data:", error);
    throw error;
  }
};

// Helper function to calculate distance between two coordinates
export const haversineDistance = (
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
  const distance = parseFloat((R * c * 1000).toFixed(2)); // distance in metres
  return distance;
};

// Combined helper to calculate distance between user and venue
export const calculateDistance = async (venueSlug: string): Promise<number> => {
  try {
    // Fetch both user and venue locations
    const { userLatitude, userLongitude } = await getUserLocation();
    const { venueLatitude, venueLongitude } = await fetchVenueLocation(
      venueSlug
    );

    // Convert strings to numbers
    const userLat = parseFloat(userLatitude);
    const userLon = parseFloat(userLongitude);
    const venueLat = parseFloat(venueLatitude);
    const venueLon = parseFloat(venueLongitude);

    // Calculate distance using haversine formula
    return haversineDistance(userLat, userLon, venueLat, venueLon);
  } catch (error) {
    console.error("Error calculating distance:", error);
    throw error;
  }
};

// helper function to fetch the venue dynamic data

export const fetchVenueDynamicData = async (
  venueSlug: string
): Promise<{
  distance: number;
  basePrice: number;
  orderMinimumNoSurcharge: number;
  distanceRanges: distanceRangesType[];
}> => {
  const endpoint = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch venue data: ${response.statusText}`);
    }
    const venueData = await response.json();
    const distance = await calculateDistance(venueSlug);
    return {
      distance: distance,
      basePrice: venueData.venue_raw.delivery_specs.delivery_pricing.base_price,
      orderMinimumNoSurcharge:
        venueData.venue_raw.delivery_specs.order_minimum_no_surcharge,
      distanceRanges:
        venueData.venue_raw.delivery_specs.delivery_pricing.distance_ranges,
    };
  } catch (error) {
    console.log("Error fetching data", error);
    throw new Error(`Error `);
  }
};

// calculate price break down

export const calculatePriceBreakDown = async (
  venueSlug: string,
  cartValue: number
): Promise<PriceBreakdown> => {
  try {
    const { distance, basePrice, orderMinimumNoSurcharge, distanceRanges } =
      await fetchVenueDynamicData(venueSlug);

    // Calculate small order surcharge
    const cartValueInCents= cartValue *100
    const smallOrderSurcharge = Math.max(
      0,
      orderMinimumNoSurcharge - cartValueInCents
    );

    // Find the appropriate distance range
    const applicableRange = distanceRanges.find(
      (range) =>
        distance >= range.min && (range.max === 0 || distance < range.max)
    );

    if (!applicableRange) {
      return {
        cartValue,
        distance,
        smallOrderSurcharge,
        deliveryFee: 0,
        totalPrice: 0,
        error: "Delivery not possible for this distance.",
      };
    }

    const { a, b } = applicableRange;

    // Calculate delivery fee
    const deliveryFee = basePrice + a + (b * distance) / 10;

    // Calculate total price
    const totalPrice = cartValueInCents + smallOrderSurcharge + deliveryFee;

    return {
      cartValue,
      distance,
      smallOrderSurcharge,
      deliveryFee,
      totalPrice,
    };
  } catch (error) {
    console.error("Error calculating price breakdown:", error);
    return {
      cartValue,
      distance: 0,
      smallOrderSurcharge: 0,
      deliveryFee: 0,
      totalPrice: 0,
      error: `Failed to calculate price breakdown. Please try again.`,
    };
  }
};
