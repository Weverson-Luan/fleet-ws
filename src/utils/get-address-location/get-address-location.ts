/**
 * IMPORTS
 */
import { reverseGeocodeAsync, LocationObjectCoords } from "expo-location";

type IType = {
  latitude: number;
  longitude: number;
};
async function getAddressLocation({ latitude, longitude }: IType) {
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
