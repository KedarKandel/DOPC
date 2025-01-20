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
  venueLatitude: number;
  venueLongitude: number;
}> => {
  try {
    const endpoint = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch venue data: ${response.statusText}`);
    }
    const venueData = await response.json();
    console.log(venueData);
    return {
      venueLatitude: venueData.venue_raw.location.coordinates[0],
      venueLongitude: venueData.venue_raw.location.coordinates[1],
    };
  } catch (error) {
    console.error("Error fetching venue data:", error);
    throw error;
  }
};

// Helper function to calculate distance between two coordinates
export const calculateDistance = (
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
  console.log(R * c);
  return R * c; // Distance in kilometers
};
