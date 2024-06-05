import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@ignitefleet:location";

type LocationProps = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

/**
 * função para obter localizações
 * @returns
 */
export async function getStorageLocation() {
  const storage = await AsyncStorage.getItem(STORAGE_KEY);

  const response = storage ? JSON.parse(storage) : [];

  return response;
}

/**
 * função para registrar localizaçoes
 * @returns
 */
export async function saveStorageLocation(newLocation: LocationProps) {
  const storage = await getStorageLocation();

  storage.push(newLocation);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

/**
 * função para remover localizaçoes
 * @returns
 */
export async function removeStorageLocations() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
