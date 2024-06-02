/**
 * IMPORTS
 */
import { reverseGeocodeAsync, LocationObjectCoords } from "expo-location";

async function getAddressLocation({
  latitude,
  longitude,
}: LocationObjectCoords) {
  try {
    const addressResponse = await reverseGeocodeAsync({ latitude, longitude });

    return addressResponse[0]?.street;
  } catch (error) {
    console.log(error);
  }
}

/**
 * EXPORTS
 */
export { getAddressLocation };
